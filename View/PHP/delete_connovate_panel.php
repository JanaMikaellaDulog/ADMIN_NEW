<?php
header('Content-Type: application/json');
include('db_connect.php');

$payload = json_decode(file_get_contents('php://input'), true);

$project = trim($payload['project'] ?? '');
$block = trim($payload['block'] ?? '');
$lot = trim($payload['lot'] ?? '');
$floor = strtoupper(trim($payload['floor'] ?? ''));
$panelId = trim($payload['panelId'] ?? '');

if ($project === '' || $block === '' || $lot === '' || $floor === '' || $panelId === '') {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Project, block, lot, floor, and panel are required.'
    ]);
    exit;
}

$sql = "DELETE FROM connovate_panels
        WHERE project_name = ?
          AND block_no = ?
          AND lot_no = ?
          AND floor_name = ?
          AND panel_key = ?";

$stmt = $conn->prepare($sql);
if (!$stmt) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Unable to prepare panel removal.'
    ]);
    exit;
}

$stmt->bind_param('sssss', $project, $block, $lot, $floor, $panelId);

if (!$stmt->execute()) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Unable to remove Connovate panel.'
    ]);
    exit;
}

echo json_encode([
    'success' => true
]);
