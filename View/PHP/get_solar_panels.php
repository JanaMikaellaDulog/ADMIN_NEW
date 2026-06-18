<?php
header('Content-Type: application/json');
include('db_connect.php');

$project = trim($_GET['project'] ?? '');
$block = trim($_GET['block'] ?? '');
$lot = trim($_GET['lot'] ?? '');

if ($project === '' || $block === '' || $lot === '') {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Project, block, and lot are required.']);
    exit;
}

$sql = "SELECT * FROM solar_panels
        WHERE project_name = ?
          AND block_no = ?
          AND lot_no = ?
        LIMIT 1";

$stmt = $conn->prepare($sql);
$stmt->bind_param('sss', $project, $block, $lot);
$stmt->execute();
$result = $stmt->get_result();

echo json_encode([
    'success' => true,
    'solar' => $result->fetch_assoc()
]);