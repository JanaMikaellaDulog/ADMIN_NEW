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
$connovatePart = trim($payload['connovatePart'] ?? ''); 

if ($connovatePart === '') {
    $connovatePart = $controlNumber;
}

$completedById = isset($_SESSION['admin_id']) ? (int)$_SESSION['admin_id'] : null;
$completedBy = trim($_SESSION['admin_name'] ?? 'System');

if ($project === '' || $block === '' || $lot === '' || $floor === '' || $panelId === '' || $controlNumber === '' || $quantity <= 0) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Missing required fields'
    ]);
    exit;
}

//
// CHECK EXISTING
//
$check = $conn->prepare("
    SELECT id
    FROM connovate_panels
    WHERE project_name = ?
      AND block_no = ?
      AND lot_no = ?
      AND floor_name = ?
      AND panel_key = ?
    LIMIT 1
");

$check->bind_param("sssss", $project, $block, $lot, $floor, $panelId);
$check->execute();
$result = $check->get_result();
$existing = $result->fetch_assoc();

//
// UPDATE
//
if ($existing) {

    $stmt = $conn->prepare("
        UPDATE connovate_panels
        SET control_number = ?,
            connovate_part = ?,
            quantity = ?,
            status = 'finished',
            completed_by_id = ?,
            completed_by = ?,
            completed_at = NOW(),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    ");

    $stmt->bind_param(
        "ssissi",
        $controlNumber,
        $connovatePart,
        $quantity,
        $completedById,
        $completedBy,
        $existing['id']
    );

//
// INSERT
//
} else {

    $stmt = $conn->prepare("
        INSERT INTO connovate_panels (
            project_name,
            block_no,
            lot_no,
            floor_name,
            panel_key,
            control_number,
            connovate_part,
            quantity,
            status,
            completed_by_id,
            completed_by,
            completed_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'finished', ?, ?, NOW())
    ");

    $stmt->bind_param(
        "sssssssiss",
        $project,
        $block,
        $lot,
        $floor,
        $panelId,
        $controlNumber,
        $connovatePart,
        $quantity,
        $completedById,
        $completedBy
    );
}

//
// EXECUTE
//
if (!$stmt->execute()) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to save Connovate panel',
        'error' => $stmt->error
    ]);
    exit;
}

echo json_encode([
    'success' => true,
    'message' => $existing ? 'Panel updated (FINISHED)' : 'Panel inserted (FINISHED)',
    'status' => 'finished',
    'project' => $project,
    'block' => $block,
    'lot' => $lot,
    'floor' => $floor,
    'panelId' => $panelId,
    'controlNumber' => $controlNumber,
    'connovatePart' => $connovatePart,
    'quantity' => $quantity,
    'completedBy' => $completedBy,
    'completedAt' => date('Y-m-d H:i:s')
]);