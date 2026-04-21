<?php
header('Content-Type: application/json');
include('db_connect.php');

$project = trim($_GET['project'] ?? '');
$block = trim($_GET['block'] ?? '');
$lot = trim($_GET['lot'] ?? '');

if ($project === '' || $block === '' || $lot === '') {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Project, block, and lot are required.'
    ]);
    exit;
}

$sql = "SELECT floor_name, panel_key, control_number, quantity, status, completed_by_id, completed_by, created_at AS started_at, completed_at
        FROM connovate_panels
        WHERE project_name = ?
          AND block_no = ?
          AND lot_no = ?
        ORDER BY floor_name ASC, panel_key ASC";

$stmt = $conn->prepare($sql);
if (!$stmt) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Unable to prepare panel query.'
    ]);
    exit;
}

$stmt->bind_param('sss', $project, $block, $lot);
$stmt->execute();
$result = $stmt->get_result();

$panels = [];
while ($row = $result->fetch_assoc()) {
    $panels[] = [
        'floor' => strtoupper(trim($row['floor_name'] ?? '')),
        'panelId' => trim($row['panel_key'] ?? ''),
        'controlNumber' => trim($row['control_number'] ?? ''),
        'quantity' => (int) ($row['quantity'] ?? 0),
        'status' => trim($row['status'] ?? 'done'),
        'completedById' => isset($row['completed_by_id']) ? (int)$row['completed_by_id'] : null,
        'completedBy' => trim($row['completed_by'] ?? ''),
        'startedAt' => trim($row['started_at'] ?? ''),
        'completedAt' => trim($row['completed_at'] ?? '')
    ];
}

echo json_encode([
    'success' => true,
    'panels' => $panels
]);

