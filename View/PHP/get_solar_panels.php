<?php
header('Content-Type: application/json');
include('db_connect.php');

$project = trim($_GET['project'] ?? '');
$block = trim($_GET['block'] ?? '');
$lot = trim($_GET['lot'] ?? '');

if ($project === '' || $block === '' || $lot === '') {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Project, block, and lot are required.']);
    exit;
}

$defaultParts = [
    [
        'part_name' => 'Solar Panel',
        'description' => 'PV module that converts sunlight to electricity.'
    ],
    [
        'part_name' => 'Solar Inverter',
        'description' => 'Converts solar power into usable electricity.'
    ],
    [
        'part_name' => 'Battery Inverter',
        'description' => 'Manages battery power for hybrid systems.'
    ],
    [
        'part_name' => 'Electrical Cables',
        'description' => 'Wires and cables used for solar connections.'
    ],
    [
        'part_name' => 'Mounting Structure',
        'description' => 'Supports and holds the solar panels.'
    ],
    [
        'part_name' => 'Electrical Devices',
        'description' => 'Breakers, switches, protection, and related devices.'
    ],
    [
        'part_name' => 'Net Metering',
        'description' => 'Optional grid export/import metering setup.'
    ]
];

$stmt = $conn->prepare("
    SELECT *
    FROM solar_panel_parts
    WHERE project_name = ?
      AND block_no = ?
      AND lot_no = ?
");

$stmt->bind_param('sss', $project, $block, $lot);
$stmt->execute();
$result = $stmt->get_result();

$savedParts = [];

while ($row = $result->fetch_assoc()) {
    $savedParts[$row['part_name']] = $row;
}

$parts = [];

foreach ($defaultParts as $part) {
    $name = $part['part_name'];

    if (isset($savedParts[$name])) {
        $row = $savedParts[$name];
        $row['description'] = $part['description'];
        $parts[] = $row;
    } else {
        $parts[] = [
            'id' => null,
            'resident_id' => null,
            'project_name' => $project,
            'block_no' => $block,
            'lot_no' => $lot,
            'part_name' => $name,
            'description' => $part['description'],
            'solar_status' => 'Not Installed',
            'installation_date' => '',
            'provider' => '',
            'capacity_details' => '',
            'proof_file' => '',
            'remarks' => '',
            'created_at' => '',
            'updated_at' => ''
        ];
    }
}

echo json_encode([
    'success' => true,
    'parts' => $parts
]);