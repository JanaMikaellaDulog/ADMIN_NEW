<?php
header('Content-Type: application/json');
include('db_connect.php');

$resident_id = $_POST['resident_id'] ?? null;
$project = trim($_POST['project_name'] ?? '');
$block = trim($_POST['block_no'] ?? '');
$lot = trim($_POST['lot_no'] ?? '');
$status = trim($_POST['solar_status'] ?? 'Not Installed');
$date = $_POST['installation_date'] ?: null;
$provider = trim($_POST['provider'] ?? '');
$capacity = trim($_POST['capacity_details'] ?? '');
$remarks = trim($_POST['remarks'] ?? '');
$proofFile = trim($_POST['proof_file'] ?? '');

if ($project === '' || $block === '' || $lot === '') {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Project, block, and lot are required.']);
    exit;
}

$check = $conn->prepare("SELECT id, proof_file FROM solar_panels WHERE project_name=? AND block_no=? AND lot_no=? LIMIT 1");
$check->bind_param('sss', $project, $block, $lot);
$check->execute();
$existing = $check->get_result()->fetch_assoc();

// If user cleared everything and status is Not Installed,
// remove the record completely.
if (
    $status === 'Not Installed' &&
    empty($date) &&
    empty($provider) &&
    empty($capacity) &&
    empty($proofFile) &&
    empty($remarks)
) {

    $delete = $conn->prepare("
        DELETE FROM solar_panels
        WHERE project_name=? AND block_no=? AND lot_no=?
    ");

    $delete->bind_param('sss', $project, $block, $lot);

    if ($delete->execute()) {
        echo json_encode([
            'success' => true,
            'message' => 'Solar record removed.'
        ]);
        exit;
    }
}


if ($existing) {


    $sql = "UPDATE solar_panels
            SET resident_id=?, solar_status=?, installation_date=?, provider=?, capacity_details=?, proof_file=?, remarks=?
            WHERE id=?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('issssssi', $resident_id, $status, $date, $provider, $capacity, $proofFile, $remarks, $existing['id']);
} else {
    $sql = "INSERT INTO solar_panels
            (resident_id, project_name, block_no, lot_no, solar_status, installation_date, provider, capacity_details, proof_file, remarks)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('isssssssss', $resident_id, $project, $block, $lot, $status, $date, $provider, $capacity, $proofFile, $remarks);
}

if (!$stmt->execute()) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Unable to save solar information.']);
    exit;
}

echo json_encode(['success' => true, 'message' => 'Solar information saved.']);