<?php
session_start();

if (!isset($_SESSION['admin_id'])) {
    exit("Unauthorized");
}

require_once('db_connect.php');

// Download headers
header('Content-Type: text/csv; charset=utf-8');
header('Content-Disposition: attachment; filename="audit_logs_' . date('Y-m-d_H-i-s') . '.csv"');

// Open output
$output = fopen('php://output', 'w');

// CSV Headers
fputcsv($output, [
    'Log ID',
    'Admin ID',
    'Admin Name',
    'Action Type',
    'Details',
    'Timestamp'
]);

// Query
$query = "
SELECT
    l.log_id,
    l.admin_id,
    a.admin_name,
    l.action_type,
    l.details,
    l.timestamp
FROM admin_logs l
LEFT JOIN admins a
ON l.admin_id = a.admin_id
ORDER BY l.timestamp DESC
";

$result = $conn->query($query);

// Output rows
while ($row = $result->fetch_assoc()) {
    fputcsv($output, [
        $row['log_id'],
        $row['admin_id'],
        $row['admin_name'],
        $row['action_type'],
        $row['details'],
        $row['timestamp']
    ]);
}

fclose($output);
exit;