<?php
header('Content-Type: application/json');

$payload = json_decode(file_get_contents('php://input'), true);
$file = $payload['file'] ?? '';

if ($file === '') {
    echo json_encode(['success' => true]);
    exit;
}

$baseDir = realpath(__DIR__ . '/../../');
$target = realpath($baseDir . '/' . $file);

if ($target && str_starts_with($target, $baseDir) && file_exists($target)) {
    unlink($target);
}

echo json_encode(['success' => true]);