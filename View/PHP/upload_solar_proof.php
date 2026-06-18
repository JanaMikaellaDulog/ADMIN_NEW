<?php
header('Content-Type: application/json');

if (!isset($_FILES['proof_file'])) {
    echo json_encode(['success' => true, 'file' => '']);
    exit;
}

$uploadDir = __DIR__ . '/../../uploads/solar_proofs/';

if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

$file = $_FILES['proof_file'];
$allowed = ['pdf', 'jpg', 'jpeg', 'png'];
$ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

if (!in_array($ext, $allowed)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Only PDF, JPG, JPEG, and PNG files are allowed.']);
    exit;
}

$newName = 'solar_' . time() . '_' . bin2hex(random_bytes(4)) . '.' . $ext;
$targetPath = $uploadDir . $newName;

if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Unable to upload proof file.']);
    exit;
}

echo json_encode([
    'success' => true,
    'file' => 'uploads/solar_proofs/' . $newName
]);