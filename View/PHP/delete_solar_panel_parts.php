<?php
header('Content-Type: application/json');
include('db_connect.php');

$data = json_decode(file_get_contents('php://input'), true);

$project = trim($data['project_name'] ?? '');
$block = trim($data['block_no'] ?? '');
$lot = trim($data['lot_no'] ?? '');

if ($project === '' || $block === '' || $lot === '') {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Project, block, and lot are required.'
    ]);
    exit;
}

/**
 * Get proof files first so they can be removed from uploads folder.
 */
$getFiles = $conn->prepare("
    SELECT proof_file
    FROM solar_panel_parts
    WHERE project_name = ?
      AND block_no = ?
      AND lot_no = ?
      AND proof_file IS NOT NULL
      AND proof_file <> ''
");

$getFiles->bind_param('sss', $project, $block, $lot);
$getFiles->execute();
$fileResult = $getFiles->get_result();

$baseDir = realpath(__DIR__ . '/../../');

while ($row = $fileResult->fetch_assoc()) {
    $file = $row['proof_file'];

    if ($file) {
        $target = realpath($baseDir . '/' . $file);

        if ($target && str_starts_with($target, $baseDir) && file_exists($target)) {
            unlink($target);
        }
    }
}

$getFiles->close();

$stmt = $conn->prepare("
    DELETE FROM solar_panel_parts
    WHERE project_name = ?
      AND block_no = ?
      AND lot_no = ?
");

$stmt->bind_param('sss', $project, $block, $lot);

if ($stmt->execute()) {
    echo json_encode([
        'success' => true,
        'message' => 'Solar installation records deleted.'
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Unable to delete solar installation records.'
    ]);
}

$stmt->close();