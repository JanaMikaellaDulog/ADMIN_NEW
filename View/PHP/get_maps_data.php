<?php
// 1. Database connection (Ensure the path to db_connect is correct from View/PHP/)
include('db_connect.php');

// 2. Set the header so the browser treats this as a JS file
header('Content-Type: application/javascript');

// 3. Fetch only projects that actually have a map assigned
$projects = $conn->query("SELECT * FROM subdivisions WHERE map_path IS NOT NULL AND map_path != ''");
$maps = [];

// 4. Loop through results and build the array
if ($projects) {
    while($row = $projects->fetch_assoc()) {
    $name = $row['project_name'];
    $maps[$name] = [
        // From View/PHP/, go UP to View/, then into assets/img/maps/
        "image" => "../assets/img/maps/" . $row['map_path'], 
        "size" => [(int)$row['map_width'], (int)$row['map_height']]
    ];
}
}

// 5. Output as a global JavaScript variable
echo "const MAPS = " . json_encode($maps, JSON_PRETTY_PRINT) . ";\n";
echo "console.log('Successfully loaded ' + Object.keys(MAPS).length + ' maps from database.');";
?>