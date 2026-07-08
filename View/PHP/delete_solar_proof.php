<?php
header('Content-Type: application/json');
error_reporting(0);
ini_set('display_errors', 0);

$payload = json_decode(file_get_contents('php://input'), true);
$file = $payload['file'] ?? '';

if ($file === '') {
    echo json_encode(['success' => true]);
    exit;
}

$baseDir = realpath(__DIR__ . '/../../');

if (!$baseDir) {
    echo json_encode([
        'success' => false,
        'message' => 'Base directory not found.'
    ]);
    exit;
}

$file = str_replace(['../', '..\\'], '', $file);
$targetPath = $baseDir . DIRECTORY_SEPARATOR . $file;
$target = realpath($targetPath);

if ($target && strpos($target, $baseDir) === 0 && file_exists($target)) {
    unlink($target);
}

echo json_encode(['success' => true]);
exit;