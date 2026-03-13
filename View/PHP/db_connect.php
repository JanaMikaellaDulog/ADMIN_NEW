<?php
$host = "127.0.0.1"; // Change from 'localhost' to this
$user = "root";
$pass = ""; 
$dbname = "subdivision_management";

// Explicitly use the default port 3306
$conn = new mysqli($host, $user, $pass, $dbname, 3307);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>