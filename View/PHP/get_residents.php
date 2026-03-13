<?php
// Ensure this path is correct based on your folder structure
include('db_connect.php');

header('Content-Type: application/json');

/**
 * We join:
 * 1. residents (r)
 * 2. subdivisions (s) - to get the 'project_name'
 * 3. utility_bills (u) - to get 'electric_bill' and 'water_bill'
 */
$sql = "SELECT 
            r.*, 
            s.project_name, 
            u.electric_bill, 
            u.water_bill 
        FROM residents r
        LEFT JOIN subdivisions s ON r.subdivision_id = s.subdivision_id
        LEFT JOIN utility_bills u ON r.resident_id = u.resident_id
        ORDER BY r.resident_id DESC";

$result = $conn->query($sql);
$residents = [];

if ($result) {
    while ($row = $result->fetch_assoc()) {
        // We clean up the data for the JavaScript
        $residents[] = $row;
    }
    echo json_encode([
        "success" => true, 
        "count" => count($residents),
        "residents" => $residents
    ]);
} else {
    // If there is a SQL error, this will tell us exactly what went wrong
    echo json_encode([
        "success" => false, 
        "message" => "Database Query Error: " . $conn->error
    ]);
}
?>