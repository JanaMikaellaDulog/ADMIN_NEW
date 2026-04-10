<?php
session_start();
header('Content-Type: application/json');
include('db_connect.php');

$payload = json_decode(file_get_contents('php://input'), true);

$project = trim($payload['project'] ?? '');
$block = trim($payload['block'] ?? '');
$lot = trim($payload['lot'] ?? '');
$floor = strtoupper(trim($payload['floor'] ?? ''));
$panelId = trim($payload['panelId'] ?? '');
$controlNumber = trim($payload['controlNumber'] ?? '');
$quantity = (int) ($payload['quantity'] ?? 0);
$completedById = isset($_SESSION['admin_id']) ? (int)$_SESSION['admin_id'] : null;
$completedBy = trim($_SESSION['admin_name'] ?? 'System');

if ($project === '' || $block === '' || $lot === '' || $floor === '' || $panelId === '' || $controlNumber === '' || $quantity <= 0) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Project, block, lot, floor, panel, control number, and quantity are required.'
    ]);
    exit;
}

$sql = "INSERT INTO connovate_panels (
            project_name,
            block_no,
            lot_no,
            floor_name,
            panel_key,
            control_number,
            quantity,
            status,
            completed_by_id,
            completed_by,
            completed_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 'done', ?, ?, NOW())
        ON DUPLICATE KEY UPDATE
            control_number = VALUES(control_number),
            quantity = VALUES(quantity),
            status = 'done',
            completed_by_id = VALUES(completed_by_id),
            completed_by = VALUES(completed_by),
            completed_at = NOW(),
            updated_at = CURRENT_TIMESTAMP";

$stmt = $conn->prepare($sql);
if (!$stmt) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Unable to prepare panel save.'
    ]);
    exit;
}

$stmt->bind_param('ssssssiis', $project, $block, $lot, $floor, $panelId, $controlNumber, $quantity, $completedById, $completedBy);

if (!$stmt->execute()) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Unable to save Connovate panel.'
    ]);
    exit;
}

echo json_encode([
    'success' => true,
    'completedBy' => $completedBy,
    'completedById' => $completedById,
    'completedAt' => date('Y-m-d H:i:s')
]);

