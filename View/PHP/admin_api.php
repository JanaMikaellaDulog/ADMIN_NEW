<?php
session_start();
include('db_connect.php');

header('Content-Type: application/json');

// 1. GLOBAL SECURITY: Must be logged in
if (!isset($_SESSION['admin_id'])) {
    echo json_encode(['success' => false, 'message' => 'Unauthorized: Please log in again.']);
    exit;
}

/**
 * HELPER FUNCTION: Audit Logging
 */
function insert_audit_log($conn, $action_type, $details) {
    $admin_id = $_SESSION['admin_id'] ?? 0; 
    $stmt = $conn->prepare("INSERT INTO admin_logs (admin_id, action_type, details) VALUES (?, ?, ?)");
    $stmt->bind_param("iss", $admin_id, $action_type, $details);
    return $stmt->execute();
}

// Current User Context
$currentUserRole = strtolower(trim($_SESSION['authority_level'] ?? ''));
$isMaster = ($currentUserRole === 'master');
$currentSessionId = (int)$_SESSION['admin_id'];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';
    $target_id = isset($_POST['admin_id']) ? (int)$_POST['admin_id'] : 0;
    $providedKey = trim($_POST['auth_key'] ?? ''); // The Master PIN entered in the modal

    // --- ACTION: ADD OR UPDATE ---
    if ($action === 'add_admin' || $action === 'update_admin') {
        $name        = trim($_POST['admin_name'] ?? '');
        $newAuthKey  = trim($_POST['auth_key_to_save'] ?? ''); // THE KEY BEING SAVED TO THE ACCOUNT
        $password    = $_POST['password'] ?? '';
        $status      = trim($_POST['admin_status'] ?? 'Staff'); // Default to Staff status per your DB
        $newLevel    = ucfirst(strtolower(trim($_POST['authority_level'] ?? 'Staff')));

        if (!in_array($newLevel, ['Master', 'Staff'])) { $newLevel = 'Staff'; }

        // Logic for NEW Admin
        if ($action === 'add_admin') {
            if (!$isMaster) {
                echo json_encode(['success' => false, 'message' => 'Access Denied: Only Masters can create accounts.']);
                exit;
            }
            if (empty($password)) {
                echo json_encode(['success' => false, 'message' => 'Password is required for new accounts.']);
                exit;
            }

            $hashedPass = password_hash($password, PASSWORD_DEFAULT);
            $stmt = $conn->prepare("INSERT INTO admins (admin_name, auth_key, password, authority_level, admin_status) VALUES (?, ?, ?, ?, ?)");
            $stmt->bind_param("sssss", $name, $newAuthKey, $hashedPass, $newLevel, $status);
            
            if ($stmt->execute()) {
                insert_audit_log($conn, "CREATED", "Added admin: $name as $newLevel");
                echo json_encode(['success' => true]);
            } else {
                echo json_encode(['success' => false, 'message' => 'Database error: ' . $conn->error]);
            }
        } 
        
        // Logic for UPDATE Admin
        elseif ($action === 'update_admin') {
            $isEditingSelf = ($target_id === $currentSessionId);

            if (!$isMaster && !$isEditingSelf) {
                echo json_encode(['success' => false, 'message' => 'Access Denied: You can only edit your own profile.']);
                exit;
            }

            // Verification Check: If Master edits someone else, verify Master's PIN
            if ($isMaster && !$isEditingSelf) {
                $checkStmt = $conn->prepare("SELECT auth_key FROM admins WHERE admin_id = ?");
                $checkStmt->bind_param("i", $currentSessionId);
                $checkStmt->execute();
                $masterData = $checkStmt->get_result()->fetch_assoc();

                if (!$masterData || $providedKey !== $masterData['auth_key']) {
                    echo json_encode(['success' => false, 'message' => 'Verification Failed: Incorrect Master Auth Key.']);
                    exit;
                }
            }

            if (!empty($password)) {
                $hashedPass = password_hash($password, PASSWORD_DEFAULT);
                $stmt = $conn->prepare("UPDATE admins SET admin_name = ?, auth_key = ?, password = ?, authority_level = ?, admin_status = ? WHERE admin_id = ?");
                $stmt->bind_param("sssssi", $name, $newAuthKey, $hashedPass, $newLevel, $status, $target_id);
            } else {
                $stmt = $conn->prepare("UPDATE admins SET admin_name = ?, auth_key = ?, authority_level = ?, admin_status = ? WHERE admin_id = ?");
                $stmt->bind_param("ssssi", $name, $newAuthKey, $newLevel, $status, $target_id);
            }

            if ($stmt->execute()) {
                insert_audit_log($conn, "UPDATED", "Updated admin: $name");
                echo json_encode(['success' => true]);
            } else {
                echo json_encode(['success' => false, 'message' => 'Update failed.']);
            }
        }
    }

    // --- ACTION: UPDATE OWN PROFILE (Edit Profile modal) ---
    elseif ($action === 'update_profile') {
        // Security: this action always operates on the logged-in admin's own
        // account. We never trust a posted admin_id here.
        $target_id = $currentSessionId;

        $name             = trim($_POST['admin_name'] ?? '');
        $currentPassword  = $_POST['current_password'] ?? '';
        $newPassword      = $_POST['new_password'] ?? '';
        $confirmPassword  = $_POST['confirm_password'] ?? '';

        if (empty($name)) {
            echo json_encode(['success' => false, 'message' => 'Username cannot be empty.']);
            exit;
        }

        $checkStmt = $conn->prepare("SELECT admin_name, password FROM admins WHERE admin_id = ?");
        $checkStmt->bind_param("i", $target_id);
        $checkStmt->execute();
        $myData = $checkStmt->get_result()->fetch_assoc();

        if (!$myData) {
            echo json_encode(['success' => false, 'message' => 'Account not found.']);
            exit;
        }

        // --- Handle profile photo upload (renamed to match the username) ---
        $newPhotoFilename = null;

        if (!empty($_FILES['profile_photo']['name']) && $_FILES['profile_photo']['error'] === UPLOAD_ERR_OK) {
            $allowedExt = ['jpg', 'jpeg', 'png', 'gif'];
            $ext = strtolower(pathinfo($_FILES['profile_photo']['name'], PATHINFO_EXTENSION));

            if (!in_array($ext, $allowedExt)) {
                echo json_encode(['success' => false, 'message' => 'Invalid image type. Use JPG, PNG, or GIF.']);
                exit;
            }

            $safeUsername = preg_replace('/[^a-zA-Z0-9_-]/', '', strtolower($name));
            if ($safeUsername === '') { $safeUsername = 'admin_' . $target_id; }

            $destDir = __DIR__ . '/../assets/img/profiles/';
            if (!is_dir($destDir)) {
                mkdir($destDir, 0755, true);
            }

            // Clean up any old photo for this user saved under a different extension
            foreach ($allowedExt as $oldExt) {
                $oldPath = $destDir . $safeUsername . '.' . $oldExt;
                if ($oldExt !== $ext && file_exists($oldPath)) {
                    @unlink($oldPath);
                }
            }

            $newPhotoFilename = $safeUsername . '.' . $ext;
            $destPath = $destDir . $newPhotoFilename;

            if (!move_uploaded_file($_FILES['profile_photo']['tmp_name'], $destPath)) {
                echo json_encode(['success' => false, 'message' => 'Failed to save the uploaded photo.']);
                exit;
            }
        }

        // --- Handle password change (requires current password verification) ---
        $wantsPasswordChange = !empty($newPassword);
        $hashedNew = null;

        if ($wantsPasswordChange) {
            if (empty($currentPassword) || !password_verify($currentPassword, $myData['password'])) {
                echo json_encode(['success' => false, 'message' => 'Your current password is incorrect.']);
                exit;
            }
            if ($newPassword !== $confirmPassword) {
                echo json_encode(['success' => false, 'message' => 'New password and confirmation do not match.']);
                exit;
            }
            if (strlen($newPassword) < 6) {
                echo json_encode(['success' => false, 'message' => 'New password must be at least 6 characters.']);
                exit;
            }
            $hashedNew = password_hash($newPassword, PASSWORD_DEFAULT);
        }

        // --- Build and run the appropriate UPDATE based on what actually changed ---
        if ($wantsPasswordChange && $newPhotoFilename) {
            $stmt = $conn->prepare("UPDATE admins SET admin_name = ?, password = ?, profile_photo = ? WHERE admin_id = ?");
            $stmt->bind_param("sssi", $name, $hashedNew, $newPhotoFilename, $target_id);
        } elseif ($wantsPasswordChange) {
            $stmt = $conn->prepare("UPDATE admins SET admin_name = ?, password = ? WHERE admin_id = ?");
            $stmt->bind_param("ssi", $name, $hashedNew, $target_id);
        } elseif ($newPhotoFilename) {
            $stmt = $conn->prepare("UPDATE admins SET admin_name = ?, profile_photo = ? WHERE admin_id = ?");
            $stmt->bind_param("ssi", $name, $newPhotoFilename, $target_id);
        } else {
            $stmt = $conn->prepare("UPDATE admins SET admin_name = ? WHERE admin_id = ?");
            $stmt->bind_param("si", $name, $target_id);
        }

        if ($stmt->execute()) {
            // Keep the session in sync so "Welcome, X" updates immediately
            $_SESSION['admin_name'] = $name;

            insert_audit_log($conn, "UPDATED", "Updated own profile" . ($wantsPasswordChange ? " (password changed)" : ""));
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Update failed: ' . $conn->error]);
        }
    }

    // --- ACTION: DELETE ADMIN (Merged logic) ---
    elseif ($action === 'delete_admin') {
        if (!$isMaster) {
            echo json_encode(['success' => false, 'message' => 'Unauthorized: Only Masters can delete accounts.']);
            exit;
        }

        if ($target_id === $currentSessionId) {
            echo json_encode(['success' => false, 'message' => 'Security Error: You cannot delete your own account.']);
            exit;
        }

        // Verify the MASTER key of the person performing the delete
        $checkStmt = $conn->prepare("SELECT auth_key FROM admins WHERE admin_id = ?");
        $checkStmt->bind_param("i", $currentSessionId);
        $checkStmt->execute();
        $masterUser = $checkStmt->get_result()->fetch_assoc();

        if (!$masterUser || $providedKey !== $masterUser['auth_key']) {
            echo json_encode(['success' => false, 'message' => 'Invalid Master Authorization Key.']);
            exit;
        }

        $stmt = $conn->prepare("DELETE FROM admins WHERE admin_id = ?");
        $stmt->bind_param("i", $target_id);
        
        if ($stmt->execute()) {
            insert_audit_log($conn, "DELETED", "Deleted admin ID: $target_id");
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Delete operation failed.']);
        }
    }
    exit;
}