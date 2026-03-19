<?php
include('db_connect.php');

// process_resident.php
// 1. Get data from the JavaScript Fetch
$data = json_decode(file_get_contents("php://input"), true);

// Header for JSON response
header('Content-Type: application/json');

if ($data) {
    $action = $data['action'] ?? '';

    // ==========================================
    // ACTION: ADD RESIDENT (17 FIELDS)
    // ==========================================
    if ($action === 'add') {
        $sub_id          = $data['subdivision_id'] ?? null;
        $tct_no          = $data['tct_no'] ?? '';
        $phase           = $data['phase'] ?? '';
        $block           = $data['block_no'] ?? '';
        $lot             = $data['lot_no'] ?? '';
        $buyer_name      = $data['buyer_name'] ?? '';
        $new_buyer       = $data['new_buyer_assumed'] ?? '';
        $rep             = $data['buyer_representative'] ?? '';
        $contact         = $data['contact_no'] ?? '';
        $email           = $data['email_address'] ?? '';
        $social          = $data['social_media'] ?? '';
        $acc_no          = $data['account_number'] ?? '';
        $acc_addr        = $data['account_address'] ?? '';
        $status          = $data['resident_status'] ?? 'Active';
        $remarks         = $data['remarks'] ?? '';
        $created_at      = !empty($data['created_at']) ? $data['created_at'] : date('Y-m-d');

        $sql = "INSERT INTO residents (
                    subdivision_id, tct_no, phase, block_no, lot_no, 
                    buyer_name, new_buyer_assumed, buyer_representative, 
                    contact_no, email_address, social_media, 
                    account_number, account_address, resident_status, 
                    remarks, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        $stmt = $conn->prepare($sql);
        // 16 placeholders: "isssssssssssssss"
        $stmt->bind_param("isssssssssssssss", 
            $sub_id, $tct_no, $phase, $block, $lot, 
            $buyer_name, $new_buyer, $rep, 
            $contact, $email, $social, 
            $acc_no, $acc_addr, $status, 
            $remarks, $created_at
        );

        if ($stmt->execute()) {
            echo json_encode(["success" => true]);
        } else {
            echo json_encode(["success" => false, "message" => "Add failed: " . $stmt->error]);
        }
        $stmt->close();
    }

    // ==========================================
    // ACTION: EDIT/UPDATE RESIDENT (ENHANCED FOR ALL FIELDS)
    // ==========================================
    else if ($action === 'edit') {
        $id              = $data['id'] ?? null; 
        $sub_id          = $data['subdivision_id'] ?? null;
        $tct_no          = $data['tct_no'] ?? '';
        $phase           = $data['phase'] ?? '';
        $block           = $data['block_no'] ?? '';
        $lot             = $data['lot_no'] ?? '';
        $buyer_name      = $data['buyer_name'] ?? '';
        $new_buyer       = $data['new_buyer_assumed'] ?? '';
        $rep             = $data['buyer_representative'] ?? '';
        $contact         = $data['contact_no'] ?? '';
        $email           = $data['email_address'] ?? '';
        $social          = $data['social_media'] ?? '';
        $acc_no          = $data['account_number'] ?? '';
        $acc_addr        = $data['account_address'] ?? '';
        $status          = $data['resident_status'] ?? 'Active';
        $remarks         = $data['remarks'] ?? '';

        $sql = "UPDATE residents SET 
                subdivision_id=?, tct_no=?, phase=?, block_no=?, lot_no=?, 
                buyer_name=?, new_buyer_assumed=?, buyer_representative=?, 
                contact_no=?, email_address=?, social_media=?, 
                account_number=?, account_address=?, resident_status=?, 
                remarks=? 
                WHERE resident_id=?";

        $stmt = $conn->prepare($sql);
        // 1 integer (sub_id), 14 strings, 1 integer (ID) -> "issssssssssssssi"
        $stmt->bind_param("issssssssssssssi", 
            $sub_id, $tct_no, $phase, $block, $lot, 
            $buyer_name, $new_buyer, $rep, 
            $contact, $email, $social, 
            $acc_no, $acc_addr, $status, 
            $remarks, $id
        );

        if ($stmt->execute()) {
            echo json_encode(["success" => true]);
        } else {
            echo json_encode(["success" => false, "message" => "Update failed: " . $stmt->error]);
        }
        $stmt->close();
    }

    // ==========================================
    // ACTION: DELETE RESIDENT
    // ==========================================
    else if ($action === 'delete') {
        $id = $data['id'] ?? null;
        $inputPin = $data['admin_pin'] ?? ''; 

        $authStmt = $conn->prepare("SELECT admin_name FROM admins WHERE auth_key = ?");
        $authStmt->bind_param("s", $inputPin);
        $authStmt->execute();
        $authResult = $authStmt->get_result();

        if ($authResult->num_rows > 0) {
            $admin = $authResult->fetch_assoc();
            
            $stmt = $conn->prepare("DELETE FROM residents WHERE resident_id=?");
            $stmt->bind_param("i", $id);

            if ($stmt->execute()) {
                echo json_encode(["success" => true, "message" => "Deleted by " . $admin['admin_name']]);
            } else {
                echo json_encode(["success" => false, "message" => "Delete failed: " . $stmt->error]);
            }
            $stmt->close();
        } else {
            echo json_encode(["success" => false, "message" => "Invalid Admin PIN."]);
        }
        $authStmt->close();
    }
} else {
    echo json_encode(["success" => false, "message" => "No data received."]);
}

$conn->close();
?>