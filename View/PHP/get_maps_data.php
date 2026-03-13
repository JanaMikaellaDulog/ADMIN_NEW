<?php
include('db_connect.php');
header('Content-Type: application/javascript'); // Tell the browser this IS a JS file

$projects = $conn->query("SELECT * FROM subdivisions WHERE map_path IS NOT NULL");
$maps = [];

while($row = $projects->fetch_assoc()) {
    $name = $row['project_name'];
    $maps[$name] = [
        "image" => "../assets/img/maps/" . $row['map_path'],
        "size" => [(int)$row['map_width'], (int)$row['map_height']]
    ];
}

// This creates the global MAPS variable for your other scripts to use
echo "const MAPS = " . json_encode($maps, JSON_PRETTY_PRINT) . ";";
echo "\nconsole.log('Maps loaded from database');";
?>