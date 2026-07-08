<?php
header('Content-Type: application/json');
include('db_connect.php');

$resident_id = $_POST['resident_id'] ?? null;
$project = trim($_POST['project_name'] ?? '');
$block = trim($_POST['block_no'] ?? '');
$lot = trim($_POST['lot_no'] ?? '');
$partName = trim($_POST['part_name'] ?? '');
$solarType = trim($_POST['solar_type'] ?? 'Grid-Tied');

$status = trim($_POST['solar_status'] ?? 'Not Installed');
$date = $_POST['installation_date'] ?: null;
$provider = trim($_POST['provider'] ?? '');
$capacity = trim($_POST['capacity_details'] ?? '');
$remarks = trim($_POST['remarks'] ?? '');
$proofFile = trim($_POST['proof_file'] ?? '');

if ($project === '' || $block === '' || $lot === '' || $partName === '') {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Project, block, lot, and solar part are required.'
    ]);
    exit;
}

$check = $conn->prepare("
    SELECT id
    FROM solar_panel_parts
    WHERE project_name = ?
      AND block_no = ?
      AND lot_no = ?
      AND part_name = ?
    LIMIT 1
");

$check->bind_param('ssss', $project, $block, $lot, $partName);
$check->execute();
$existing = $check->get_result()->fetch_assoc();

if (
    $existing &&
    $status === 'Not Installed' &&
    empty($date) &&
    empty($provider) &&
    empty($capacity) &&
    empty($proofFile) &&
    empty($remarks)
) {
    $delete = $conn->prepare("
        DELETE FROM solar_panel_parts
        WHERE id = ?
    ");

    $delete->bind_param('i', $existing['id']);

    if ($delete->execute()) {
        echo json_encode([
            'success' => true,
            'message' => 'Solar part record removed.'
        ]);
        exit;
    }
}

if ($existing) {
    $sql = "
        UPDATE solar_panel_parts
        SET resident_id = ?,
            solar_type = ?,
            solar_status = ?,
            installation_date = ?,
            provider = ?,
            capacity_details = ?,
            proof_file = ?,
            remarks = ?
        WHERE id = ?
    ";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param(
        'isssssssi',
        $resident_id,
        $solarType,
        $status,
        $date,
        $provider,
        $capacity,
        $proofFile,
        $remarks,
        $existing['id']
    );
} else {
    $sql = "
        INSERT INTO solar_panel_parts
        (resident_id, project_name, block_no, lot_no, solar_type, part_name, solar_status, installation_date, provider, capacity_details, proof_file, remarks)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param(
        'isssssssssss',
        $resident_id,
        $project,
        $block,
        $lot,
        $solarType,
        $partName,
        $status,
        $date,
        $provider,
        $capacity,
        $proofFile,
        $remarks
    );
}

if (!$stmt->execute()) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Unable to save solar part.'
    ]);
    exit;
}

echo json_encode([
    'success' => true,
    'message' => 'Solar part saved.'
]);