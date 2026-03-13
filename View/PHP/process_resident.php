<?php
include('db_connect.php');

// 1. Get data from the JavaScript Fetch
$data = json_decode(file_get_contents("php://input"), true);

// Header for JSON response
header('Content-Type: application/json');

if ($data) {
    $action = $data['action'] ?? '';

    // ==========================================
    // ACTION: ADD RESIDENT
    // ==========================================
    if ($action === 'add') {
        $name   = $data['name'] ?? '';
        $sub_id = $data['subdivision_id'] ?? '';
        $phase  = $data['phase'] ?? '';
        $block  = $data['block'] ?? '';
        $lot    = $data['lot'] ?? '';
        $status = $data['status'] ?? 'Active';

        $stmt = $conn->prepare("INSERT INTO residents (subdivision_id, full_name, phase, block_no, lot_no, resident_status) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("isssss", $sub_id, $name, $phase, $block, $lot, $status);

        if ($stmt->execute()) {
            echo json_encode(["success" => true, "status" => "success"]);
        } else {
            echo json_encode(["success" => false, "message" => $stmt->error]);
        }
        $stmt->close();
    }

    // ==========================================
    // ACTION: EDIT/UPDATE RESIDENT
    // ==========================================
    else if ($action === 'edit') {
        $id     = $data['id'] ?? null;
        $name   = $data['name'] ?? '';
        $sub_id = $data['subdivision_id'] ?? '';
        $phase  = $data['phase'] ?? '';
        $block  = $data['block'] ?? '';
        $lot    = $data['lot'] ?? '';
        $status = $data['status'] ?? '';

        $stmt = $conn->prepare("UPDATE residents SET full_name=?, subdivision_id=?, phase=?, block_no=?, lot_no=?, resident_status=? WHERE resident_id=?");
        $stmt->bind_param("sissssi", $name, $sub_id, $phase, $block, $lot, $status, $id);

        if ($stmt->execute()) {
            echo json_encode(["success" => true]);
        } else {
            echo json_encode(["success" => false, "message" => $stmt->error]);
        }
        $stmt->close();
    }

    // ==========================================
    // ACTION: DELETE RESIDENT (WITH DB AUTH)
    // ==========================================
    else if ($action === 'delete') {
        $id = $data['id'] ?? null;
        $inputPassword = $data['password'] ?? '';

        // 1. Verify the password against the 'admins' table
        $authStmt = $conn->prepare("SELECT admin_name FROM admins WHERE auth_key = ?");
        $authStmt->bind_param("s", $inputPassword);
        $authStmt->execute();
        $authResult = $authStmt->get_result();

        if ($authResult->num_rows > 0) {
            $admin = $authResult->fetch_assoc();
            
            // 2. If password is correct, proceed with deletion
            $stmt = $conn->prepare("DELETE FROM residents WHERE resident_id=?");
            $stmt->bind_param("i", $id);

            if ($stmt->execute()) {
                echo json_encode(["success" => true, "message" => "Deleted by " . $admin['admin_name']]);
            } else {
                echo json_encode(["success" => false, "message" => "Delete failed: " . $stmt->error]);
            }
            $stmt->close();
        } else {
            // 3. Password was wrong or not found in the database
            echo json_encode(["success" => false, "message" => "Invalid Authorization Key."]);
        }
        $authStmt->close();
    }
} else {
    echo json_encode(["success" => false, "message" => "No data received."]);
}

$conn->close();
?>