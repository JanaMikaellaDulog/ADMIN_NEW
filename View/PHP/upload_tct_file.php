<?php
header('Content-Type: application/json');

if (!isset($_FILES['tct_file'])) {
    echo json_encode(['success' => true, 'file' => '']);
    exit;
}

$uploadDir = __DIR__ . '/../../uploads/tct_files/';

if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

$file = $_FILES['tct_file'];
$allowed = ['pdf', 'jpg', 'jpeg', 'png'];
$ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

if (!in_array($ext, $allowed)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Only PDF, JPG, JPEG, and PNG files are allowed.']);
    exit;
}

$newName = 'tct_' . time() . '_' . bin2hex(random_bytes(4)) . '.' . $ext;
$targetPath = $uploadDir . $newName;

if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Unable to upload TCT file.']);
    exit;
}

echo json_encode([
    'success' => true,
    'file' => 'uploads/tct_files/' . $newName
]);