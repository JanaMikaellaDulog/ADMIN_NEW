-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Apr 21, 2026 at 03:28 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `subdivision_management`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `admin_id` int(11) NOT NULL,
  `admin_name` varchar(100) DEFAULT NULL,
  `authority_level` enum('Master','Staff') NOT NULL DEFAULT 'Staff',
  `auth_key` varchar(255) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `password` varchar(255) NOT NULL,
  `admin_status` varchar(20) DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`admin_id`, `admin_name`, `authority_level`, `auth_key`, `updated_at`, `password`, `admin_status`) VALUES
(1, 'Kervie Balolong', 'Master', 'delete123', '2026-03-25 03:16:22', '$2y$10$dxpLXcfRT5xro2lScRogUu5S4OBfLHp/4xkntzyTTocuv/8ThYMEO', 'active'),
(2, 'MasterAdmin', 'Master', 'admin123', '2026-04-21 01:22:27', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(3, 'William Reynold', 'Staff', 'william123', '2026-03-29 11:41:54', '$2y$10$IdRFDkeJ02430e7Oy0X6t.JHRIRORQ.2pCne7Yk8of4TlCWENcnai', 'active'),
(4, 'CVSU ADMIN', 'Master', 'admincvsu', '2026-03-29 11:41:54', '$2y$12$/R2nD6jUk9jKLwM21UO9XO/JJbwXWOdptQGz5dVOedTTngfYSY.HO', 'active');

-- --------------------------------------------------------

--
-- Table structure for table `admin_logs`
--

CREATE TABLE `admin_logs` (
  `log_id` int(11) NOT NULL,
  `admin_id` int(11) NOT NULL,
  `action_type` varchar(50) NOT NULL,
  `details` text NOT NULL,
  `timestamp` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin_logs`
--

INSERT INTO `admin_logs` (`log_id`, `admin_id`, `action_type`, `details`, `timestamp`) VALUES
(1, 1, 'CREATED', 'Added new resident: John Doe to Block 5 Lot 2', '2026-03-20 10:01:07'),
(2, 1, 'UPDATED', 'Updated utility bill for Account #10025', '2026-03-20 10:01:07'),
(3, 1, 'UPDATED', 'Modified: Andress Jose Bonifacio', '2026-03-21 10:38:58'),
(4, 2, 'UPDATED', 'Modified: Andress Jose Bonifacio', '2026-03-25 08:47:49'),
(5, 2, 'UPDATED', 'Modified: Andress Jose Bonifacio', '2026-03-25 09:26:53'),
(6, 2, 'CREATED', 'Added: Albert Poblacion', '2026-03-25 09:43:10'),
(7, 2, 'CREATED', 'Created new admin: William Reynolds', '2026-03-25 11:16:06'),
(8, 2, 'UPDATED', 'Updated admin profile: Kervie Balolong', '2026-03-25 11:16:22'),
(9, 2, 'UPDATED', 'Updated admin profile: William Reynold (Staff)', '2026-03-25 11:38:48'),
(10, 2, 'DELETE', 'Deleted ID: 2', '2026-03-25 11:47:39'),
(11, 2, 'ADD', 'Added: sampleresidents', '2026-03-25 11:51:47'),
(12, 2, 'UPDATED', 'Updated admin profile: MasterAdmin (Master)', '2026-03-25 11:52:15'),
(13, 2, 'DELETE', 'Deleted ID: 16', '2026-03-25 11:52:56'),
(14, 2, 'ADD', 'Added: John Doe', '2026-03-25 11:58:26'),
(15, 2, 'DELETED', 'Deleted Resident: John Doe (ID: 17)', '2026-03-25 12:03:34'),
(16, 2, 'UPDATED', 'Updated admin: MasterAdmin', '2026-03-29 19:36:31'),
(17, 2, 'UPDATED', 'Updated admin: MasterAdmin', '2026-03-29 19:39:25'),
(18, 2, 'CREATED', 'Added: Franz Matthew', '2026-03-29 21:03:37');

-- --------------------------------------------------------

--
-- Table structure for table `connovate_panels`
--

CREATE TABLE `connovate_panels` (
  `id` int(11) NOT NULL,
  `project_name` varchar(100) NOT NULL,
  `block_no` varchar(50) NOT NULL,
  `lot_no` varchar(50) NOT NULL,
  `floor_name` varchar(50) NOT NULL,
  `panel_key` varchar(100) NOT NULL,
  `control_number` varchar(100) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 0,
  `status` varchar(50) NOT NULL DEFAULT 'done',
  `completed_by_id` int(11) DEFAULT NULL,
  `completed_by` varchar(100) DEFAULT NULL,
  `completed_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `connovate_part` varchar(255) DEFAULT NULL,
  `started_at` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `connovate_panels`
--

INSERT INTO `connovate_panels` (`id`, `project_name`, `block_no`, `lot_no`, `floor_name`, `panel_key`, `control_number`, `quantity`, `status`, `completed_by_id`, `completed_by`, `completed_at`, `created_at`, `updated_at`, `connovate_part`, `started_at`) VALUES
(1, 'PADRE GARCIA', '1', '1', 'GROUND FLOOR', 'test-panel', 'CTRL-001', 2, 'done', NULL, NULL, NULL, '2026-04-08 06:44:43', '2026-04-21 00:19:41', 'TDX-001A', NULL),
(2, 'PADRE GARCIA', '1', '2', 'GROUND FLOOR', 'gf-center-green', 'CTRL-ADMIN', 1, 'done', NULL, NULL, NULL, '2026-04-08 07:15:43', '2026-04-21 00:29:40', 'TDX-002A', NULL),
(3, 'PADRE GARCIA', '18', '63', 'GROUND FLOOR', 'gf-center-green', 'TIR-207A', 1, 'done', NULL, NULL, NULL, '2026-04-08 07:17:30', '2026-04-21 00:29:52', 'TDX-003A', NULL),
(4, 'PADRE GARCIA', '18', '63', 'GROUND FLOOR', 'gf-center-left-red', 'TIR-207A', 1, 'done', 2, 'MasterAdmin', '2026-04-08 15:29:39', '2026-04-08 07:29:39', '2026-04-21 00:30:06', 'TDX-004A', NULL),
(5, 'PADRE GARCIA', '18', '63', 'GROUND FLOOR', 'pk-214A', 'CTRL-214A', 1, 'done', NULL, NULL, NULL, '2026-04-20 10:35:14', '2026-04-21 00:30:21', 'TIR-214A', NULL),
(6, 'PADRE GARCIA', '18', '63', 'GROUND FLOOR', 'pk-206A', 'CTRL-206A', 1, 'done', NULL, NULL, NULL, '2026-04-20 10:35:14', '2026-04-21 00:30:36', 'TDX-206A', NULL),
(7, 'PADRE GARCIA', '18', '63', 'GROUND FLOOR', 'pk-205A', 'CTRL-205A', 1, 'done', NULL, NULL, NULL, '2026-04-20 10:35:14', '2026-04-21 00:30:50', 'TDX-205A', NULL),
(8, 'PADRE GARCIA', '18', '63', 'GROUND FLOOR', 'pk-220A', 'CTRL-220A', 1, 'done', NULL, NULL, NULL, '2026-04-20 10:35:14', '2026-04-21 00:31:03', 'TDX-220A', NULL),
(9, 'PADRE GARCIA', '18', '63', 'GROUND FLOOR', 'pk-219A', 'CTRL-219A', 1, 'done', NULL, NULL, NULL, '2026-04-20 10:35:14', '2026-04-21 00:31:18', 'TDX-219A', NULL),
(10, 'PADRE GARCIA', '18', '63', 'GROUND FLOOR', 'pk-201A', 'CTRL-201A', 1, 'done', NULL, NULL, NULL, '2026-04-20 10:35:14', '2026-04-21 00:32:00', 'TDX-201A', NULL),
(11, 'PADRE GARCIA', '18', '63', 'GROUND FLOOR', 'pk-TIR201', 'CTRL-TIR201', 1, 'done', NULL, NULL, NULL, '2026-04-20 10:35:14', '2026-04-21 00:32:29', 'TIR-201A', NULL),
(12, 'PADRE GARCIA', '18', '63', 'GROUND FLOOR', 'pk-TIR207', 'CTRL-TIR207', 1, 'done', NULL, NULL, NULL, '2026-04-20 10:35:14', '2026-04-21 00:33:41', 'TIR-207A', NULL),
(13, 'PADRE GARCIA', '18', '63', 'GROUND FLOOR', 'pk-204A', 'CTRL-204A', 1, 'done', NULL, NULL, NULL, '2026-04-20 10:35:14', '2026-04-21 00:33:56', 'TDX-204A', NULL),
(14, 'PADRE GARCIA', '18', '63', 'GROUND FLOOR', 'pk-203A', 'CTRL-203A', 1, 'done', NULL, NULL, NULL, '2026-04-20 10:35:14', '2026-04-21 00:34:15', 'TDX-203A', NULL),
(15, 'PADRE GARCIA', '18', '63', 'GROUND FLOOR', 'pk-216A', 'CTRL-216A', 1, 'done', NULL, NULL, NULL, '2026-04-20 10:35:14', '2026-04-21 00:34:38', 'TDX-216A', NULL),
(16, 'PADRE GARCIA', '18', '63', 'GROUND FLOOR', 'pk-215A', 'CTRL-215A', 1, 'done', NULL, NULL, NULL, '2026-04-20 10:35:14', '2026-04-21 00:34:58', 'TDX-215A', NULL),
(17, 'PADRE GARCIA', '18', '63', 'SECOND FLOOR', 'pk-SF-213A', 'CTRL-SF-213A', 1, 'done', NULL, NULL, NULL, '2026-04-20 10:56:26', '2026-04-21 00:35:19', 'TDX-213A', NULL),
(18, 'PADRE GARCIA', '18', '63', 'SECOND FLOOR', 'pk-SF-212A', 'CTRL-SF-212A', 1, 'done', NULL, NULL, NULL, '2026-04-20 10:56:26', '2026-04-21 00:35:34', 'TDX-212A', NULL),
(19, 'PADRE GARCIA', '18', '63', 'SECOND FLOOR', 'pk-SF-209A', 'CTRL-SF-209A', 1, 'done', NULL, NULL, NULL, '2026-04-20 10:56:26', '2026-04-21 00:35:50', 'TIR-209A', NULL),
(20, 'PADRE GARCIA', '18', '63', 'SECOND FLOOR', 'pk-SF-208A', 'CTRL-SF-208A', 1, 'done', NULL, NULL, NULL, '2026-04-20 10:56:26', '2026-04-21 00:36:07', 'TIR-208A', NULL),
(21, 'PADRE GARCIA', '18', '63', 'SECOND FLOOR', 'pk-SF-208-TDX', 'CTRL-SF-208-TDX', 1, 'done', NULL, NULL, NULL, '2026-04-20 10:56:26', '2026-04-21 00:36:26', 'TDX-208A', NULL),
(22, 'PADRE GARCIA', '18', '63', 'SECOND FLOOR', 'pk-SF-214A-TIR', 'CTRL-SF-214A-TIR', 1, 'done', NULL, NULL, NULL, '2026-04-20 10:56:26', '2026-04-21 00:36:46', 'TIR-214A', NULL),
(23, 'PADRE GARCIA', '18', '63', 'SECOND FLOOR', 'pk-SF-211A', 'CTRL-SF-211A', 1, 'done', NULL, NULL, NULL, '2026-04-20 10:56:26', '2026-04-21 00:36:59', 'TDX-211A', NULL),
(24, 'PADRE GARCIA', '18', '63', 'SECOND FLOOR', 'pk-SF-210A', 'CTRL-SF-210A', 1, 'done', NULL, NULL, NULL, '2026-04-20 10:56:26', '2026-04-21 00:37:12', 'TDX-210A', NULL),
(25, 'PADRE GARCIA', '18', '63', 'SECOND FLOOR', 'pk-SF-218A', 'CTRL-SF-218A', 1, 'done', NULL, NULL, NULL, '2026-04-20 10:56:26', '2026-04-21 00:37:29', 'TDX-218A', NULL),
(26, 'PADRE GARCIA', '18', '63', 'SECOND FLOOR', 'pk-SF-217A', 'CTRL-SF-217A', 1, 'done', NULL, NULL, NULL, '2026-04-20 10:56:26', '2026-04-21 01:10:16', 'TDX-217A', NULL),
(28, 'Brgy. Estanza', '1', '1', 'GROUND FLOOR', 'pk-EST-001A', 'CTRL-EST-001A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:08:22', '2026-04-21 01:10:48', 'TDX-001A', NULL),
(29, 'Brgy. Estanza', '1', '1', 'GROUND FLOOR', 'pk-EST-002A', 'CTRL-EST-002A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:08:22', '2026-04-21 01:11:06', 'TDX-002A', NULL),
(30, 'Brgy. Estanza', '1', '1', 'GROUND FLOOR', 'pk-EST-003A', 'CTRL-EST-003A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:08:22', '2026-04-21 01:11:22', 'TDX-003A', NULL),
(31, 'Brgy. Estanza', '1', '1', 'GROUND FLOOR', 'pk-EST-004A', 'CTRL-EST-004A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:08:22', '2026-04-21 01:12:10', 'TDX-004A', NULL),
(32, 'Brgy. Estanza', '1', '1', 'GROUND FLOOR', 'pk-EST-214A', 'CTRL-EST-214A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:08:22', '2026-04-21 01:12:26', 'TIR-214A', NULL),
(33, 'Brgy. Estanza', '1', '1', 'GROUND FLOOR', 'pk-EST-206A', 'CTRL-EST-206A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:08:22', '2026-04-21 01:12:45', 'TDX-206A', NULL),
(34, 'Brgy. Estanza', '1', '1', 'GROUND FLOOR', 'pk-EST-205A', 'CTRL-EST-205A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:08:22', '2026-04-21 01:12:58', 'TDX-205A', NULL),
(35, 'Brgy. Estanza', '1', '1', 'GROUND FLOOR', 'pk-EST-220A', 'CTRL-EST-220A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:08:22', '2026-04-21 01:13:10', 'TDX-220A', NULL),
(36, 'Brgy. Estanza', '1', '1', 'GROUND FLOOR', 'pk-EST-219A', 'CTRL-EST-219A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:08:22', '2026-04-21 01:13:23', 'TDX-219A', NULL),
(37, 'Brgy. Estanza', '1', '1', 'GROUND FLOOR', 'pk-EST-201A', 'CTRL-EST-201A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:08:22', '2026-04-21 01:13:36', 'TDX-201A', NULL),
(38, 'Brgy. Estanza', '1', '1', 'GROUND FLOOR', 'pk-EST-TIR201', 'CTRL-EST-TIR201', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:08:22', '2026-04-21 01:13:51', 'TIR-201A', NULL),
(39, 'Brgy. Estanza', '1', '1', 'GROUND FLOOR', 'pk-EST-TIR207', 'CTRL-EST-TIR207', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:08:22', '2026-04-21 01:14:05', 'TIR-207A', NULL),
(40, 'Brgy. Estanza', '1', '1', 'GROUND FLOOR', 'pk-EST-204A', 'CTRL-EST-204A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:08:22', '2026-04-21 01:14:18', 'TDX-204A', NULL),
(41, 'Brgy. Estanza', '1', '1', 'GROUND FLOOR', 'pk-EST-203A', 'CTRL-EST-203A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:08:22', '2026-04-21 01:14:37', 'TDX-203A', NULL),
(42, 'Brgy. Estanza', '1', '1', 'GROUND FLOOR', 'pk-EST-216A', 'CTRL-EST-216A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:08:22', '2026-04-21 01:14:55', 'TDX-216A', NULL),
(43, 'Brgy. Estanza', '1', '1', 'GROUND FLOOR', 'pk-EST-215A', 'CTRL-EST-215A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:08:22', '2026-04-21 01:15:15', 'TDX-215A', NULL),
(44, 'Brgy. Estanza', '1', '1', 'SECOND FLOOR', 'pk-EST-SF-213A', 'CTRL-EST-SF-213A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:18:30', '2026-04-21 01:18:53', 'TDX-213A', NULL),
(45, 'Brgy. Estanza', '1', '1', 'SECOND FLOOR', 'pk-EST-SF-212A', 'CTRL-EST-SF-212A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:18:30', '2026-04-21 01:19:09', 'TDX-212A', NULL),
(46, 'Brgy. Estanza', '1', '1', 'SECOND FLOOR', 'pk-EST-SF-209A', 'CTRL-EST-SF-209A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:18:30', '2026-04-21 01:19:29', 'TIR-209A', NULL),
(47, 'Brgy. Estanza', '1', '1', 'SECOND FLOOR', 'pk-EST-SF-208A', 'CTRL-EST-SF-208A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:18:30', '2026-04-21 01:19:44', 'TIR-208A', NULL),
(48, 'Brgy. Estanza', '1', '1', 'SECOND FLOOR', 'pk-EST-SF-208-TDX', 'CTRL-EST-SF-208-TDX', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:18:30', '2026-04-21 01:19:58', 'TDX-208A', NULL),
(49, 'Brgy. Estanza', '1', '1', 'SECOND FLOOR', 'pk-EST-SF-214A-TIR', 'CTRL-EST-SF-214A-TIR', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:18:30', '2026-04-21 01:20:17', 'TIR-214A', NULL),
(50, 'Brgy. Estanza', '1', '1', 'SECOND FLOOR', 'pk-EST-SF-211A', 'CTRL-EST-SF-211A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:18:30', '2026-04-21 01:20:34', 'TDX-211A', NULL),
(51, 'Brgy. Estanza', '1', '1', 'SECOND FLOOR', 'pk-EST-SF-210A', 'CTRL-EST-SF-210A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:18:30', '2026-04-21 01:20:50', 'TDX-210A', NULL),
(52, 'Brgy. Estanza', '1', '1', 'SECOND FLOOR', 'pk-EST-SF-218A', 'CTRL-EST-SF-218A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:18:30', '2026-04-21 01:21:16', 'TDX-218A', NULL),
(53, 'Brgy. Estanza', '1', '1', 'SECOND FLOOR', 'pk-EST-SF-217A', 'CTRL-EST-SF-217A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:18:30', '2026-04-21 01:22:02', 'TDX-217A', NULL),
(75, 'Brgy. STO.Domingo', '1', '1', 'GROUND FLOOR', 'pk-DOM-001A', 'CTRL-DOM-001A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:42:27', '2026-04-21 01:42:27', 'TDX-001A', NULL),
(76, 'Brgy. STO.Domingo', '1', '1', 'GROUND FLOOR', 'pk-DOM-002A', 'CTRL-DOM-002A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:42:27', '2026-04-21 01:42:27', 'TDX-002A', NULL),
(77, 'Brgy. STO.Domingo', '1', '1', 'GROUND FLOOR', 'pk-DOM-003A', 'CTRL-DOM-003A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:42:27', '2026-04-21 01:42:27', 'TDX-003A', NULL),
(78, 'Brgy. STO.Domingo', '1', '1', 'GROUND FLOOR', 'pk-DOM-004A', 'CTRL-DOM-004A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:42:27', '2026-04-21 01:42:27', 'TDX-004A', NULL),
(79, 'Brgy. STO.Domingo', '1', '1', 'GROUND FLOOR', 'pk-DOM-214A', 'CTRL-DOM-214A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:42:27', '2026-04-21 01:42:27', 'TIR-214A', NULL),
(80, 'Brgy. STO.Domingo', '1', '1', 'GROUND FLOOR', 'pk-DOM-206A', 'CTRL-DOM-206A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:42:27', '2026-04-21 01:42:27', 'TDX-206A', NULL),
(81, 'Brgy. STO.Domingo', '1', '1', 'GROUND FLOOR', 'pk-DOM-205A', 'CTRL-DOM-205A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:42:27', '2026-04-21 01:42:27', 'TDX-205A', NULL),
(82, 'Brgy. STO.Domingo', '1', '1', 'GROUND FLOOR', 'pk-DOM-220A', 'CTRL-DOM-220A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:42:27', '2026-04-21 01:42:27', 'TDX-220A', NULL),
(83, 'Brgy. STO.Domingo', '1', '1', 'GROUND FLOOR', 'pk-DOM-219A', 'CTRL-DOM-219A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:42:27', '2026-04-21 01:42:27', 'TDX-219A', NULL),
(84, 'Brgy. STO.Domingo', '1', '1', 'GROUND FLOOR', 'pk-DOM-201A', 'CTRL-DOM-201A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:42:27', '2026-04-21 01:42:27', 'TDX-201A', NULL),
(85, 'Brgy. STO.Domingo', '1', '1', 'GROUND FLOOR', 'pk-DOM-TIR201', 'CTRL-DOM-TIR201', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:42:27', '2026-04-21 01:42:27', 'TIR-201A', NULL),
(86, 'Brgy. STO.Domingo', '1', '1', 'GROUND FLOOR', 'pk-DOM-TIR207', 'CTRL-DOM-TIR207', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:42:27', '2026-04-21 01:42:27', 'TIR-207A', NULL),
(87, 'Brgy. STO.Domingo', '1', '1', 'GROUND FLOOR', 'pk-DOM-204A', 'CTRL-DOM-204A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:42:27', '2026-04-21 01:42:27', 'TDX-204A', NULL),
(88, 'Brgy. STO.Domingo', '1', '1', 'GROUND FLOOR', 'pk-DOM-203A', 'CTRL-DOM-203A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:42:27', '2026-04-21 01:42:27', 'TDX-203A', NULL),
(89, 'Brgy. STO.Domingo', '1', '1', 'GROUND FLOOR', 'pk-DOM-216A', 'CTRL-DOM-216A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:42:27', '2026-04-21 01:42:27', 'TDX-216A', NULL),
(90, 'Brgy. STO.Domingo', '1', '1', 'GROUND FLOOR', 'pk-DOM-215A', 'CTRL-DOM-215A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:42:27', '2026-04-21 01:42:27', 'TDX-215A', NULL),
(91, 'Brgy. STO.Domingo', '1', '1', 'SECOND FLOOR', 'pk-DOM-SF-213A', 'CTRL-DOM-SF-213A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:45:26', '2026-04-21 01:45:26', 'TDX-213A', NULL),
(92, 'Brgy. STO.Domingo', '1', '1', 'SECOND FLOOR', 'pk-DOM-SF-212A', 'CTRL-DOM-SF-212A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:45:26', '2026-04-21 01:45:26', 'TDX-212A', NULL),
(93, 'Brgy. STO.Domingo', '1', '1', 'SECOND FLOOR', 'pk-DOM-SF-209A', 'CTRL-DOM-SF-209A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:45:26', '2026-04-21 01:45:26', 'TIR-209A', NULL),
(94, 'Brgy. STO.Domingo', '1', '1', 'SECOND FLOOR', 'pk-DOM-SF-208A', 'CTRL-DOM-SF-208A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:45:26', '2026-04-21 01:45:26', 'TIR-208A', NULL),
(95, 'Brgy. STO.Domingo', '1', '1', 'SECOND FLOOR', 'pk-DOM-SF-208-TDX', 'CTRL-DOM-SF-208-TDX', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:45:26', '2026-04-21 01:45:26', 'TDX-208A', NULL),
(96, 'Brgy. STO.Domingo', '1', '1', 'SECOND FLOOR', 'pk-DOM-SF-214A-TIR', 'CTRL-DOM-SF-214A-TIR', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:45:26', '2026-04-21 01:45:26', 'TIR-214A', NULL),
(97, 'Brgy. STO.Domingo', '1', '1', 'SECOND FLOOR', 'pk-DOM-SF-211A', 'CTRL-DOM-SF-211A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:45:26', '2026-04-21 01:45:26', 'TDX-211A', NULL),
(98, 'Brgy. STO.Domingo', '1', '1', 'SECOND FLOOR', 'pk-DOM-SF-210A', 'CTRL-DOM-SF-210A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:45:26', '2026-04-21 01:45:26', 'TDX-210A', NULL),
(99, 'Brgy. STO.Domingo', '1', '1', 'SECOND FLOOR', 'pk-DOM-SF-218A', 'CTRL-DOM-SF-218A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:45:26', '2026-04-21 01:45:26', 'TDX-218A', NULL),
(100, 'Brgy. STO.Domingo', '1', '1', 'SECOND FLOOR', 'pk-DOM-SF-217A', 'CTRL-DOM-SF-217A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:45:26', '2026-04-21 01:45:26', 'TDX-217A', NULL),
(101, 'Brgy. Tartaria', '1', '1', 'GROUND FLOOR', 'pk-TAR-001A', 'CTRL-TAR-001A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:48:03', '2026-04-21 01:48:03', 'TDX-001A', NULL),
(102, 'Brgy. Tartaria', '1', '1', 'GROUND FLOOR', 'pk-TAR-002A', 'CTRL-TAR-002A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:48:03', '2026-04-21 01:48:03', 'TDX-002A', NULL),
(103, 'Brgy. Tartaria', '1', '1', 'GROUND FLOOR', 'pk-TAR-003A', 'CTRL-TAR-003A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:48:03', '2026-04-21 01:48:03', 'TDX-003A', NULL),
(104, 'Brgy. Tartaria', '1', '1', 'GROUND FLOOR', 'pk-TAR-004A', 'CTRL-TAR-004A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:48:03', '2026-04-21 01:48:03', 'TDX-004A', NULL),
(105, 'Brgy. Tartaria', '1', '1', 'GROUND FLOOR', 'pk-TAR-214A', 'CTRL-TAR-214A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:48:03', '2026-04-21 01:48:03', 'TIR-214A', NULL),
(106, 'Brgy. Tartaria', '1', '1', 'GROUND FLOOR', 'pk-TAR-206A', 'CTRL-TAR-206A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:48:03', '2026-04-21 01:48:03', 'TDX-206A', NULL),
(107, 'Brgy. Tartaria', '1', '1', 'GROUND FLOOR', 'pk-TAR-205A', 'CTRL-TAR-205A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:48:03', '2026-04-21 01:48:03', 'TDX-205A', NULL),
(108, 'Brgy. Tartaria', '1', '1', 'GROUND FLOOR', 'pk-TAR-220A', 'CTRL-TAR-220A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:48:03', '2026-04-21 01:48:03', 'TDX-220A', NULL),
(109, 'Brgy. Tartaria', '1', '1', 'GROUND FLOOR', 'pk-TAR-219A', 'CTRL-TAR-219A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:48:03', '2026-04-21 01:48:03', 'TDX-219A', NULL),
(110, 'Brgy. Tartaria', '1', '1', 'GROUND FLOOR', 'pk-TAR-201A', 'CTRL-TAR-201A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:48:03', '2026-04-21 01:48:03', 'TDX-201A', NULL),
(111, 'Brgy. Tartaria', '1', '1', 'GROUND FLOOR', 'pk-TAR-TIR201', 'CTRL-TAR-TIR201', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:48:03', '2026-04-21 01:48:03', 'TIR-201A', NULL),
(112, 'Brgy. Tartaria', '1', '1', 'GROUND FLOOR', 'pk-TAR-TIR207', 'CTRL-TAR-TIR207', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:48:03', '2026-04-21 01:48:03', 'TIR-207A', NULL),
(113, 'Brgy. Tartaria', '1', '1', 'GROUND FLOOR', 'pk-TAR-204A', 'CTRL-TAR-204A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:48:03', '2026-04-21 01:48:03', 'TDX-204A', NULL),
(114, 'Brgy. Tartaria', '1', '1', 'GROUND FLOOR', 'pk-TAR-203A', 'CTRL-TAR-203A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:48:03', '2026-04-21 01:48:03', 'TDX-203A', NULL),
(115, 'Brgy. Tartaria', '1', '1', 'GROUND FLOOR', 'pk-TAR-216A', 'CTRL-TAR-216A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:48:03', '2026-04-21 01:48:03', 'TDX-216A', NULL),
(116, 'Brgy. Tartaria', '1', '1', 'GROUND FLOOR', 'pk-TAR-215A', 'CTRL-TAR-215A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:48:03', '2026-04-21 01:48:03', 'TDX-215A', NULL),
(117, 'Brgy. Tartaria', '1', '1', 'SECOND FLOOR', 'pk-TAR-SF-213A', 'CTRL-TAR-SF-213A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:50:18', '2026-04-21 01:50:18', 'TDX-213A', NULL),
(118, 'Brgy. Tartaria', '1', '1', 'SECOND FLOOR', 'pk-TAR-SF-212A', 'CTRL-TAR-SF-212A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:50:18', '2026-04-21 01:50:18', 'TDX-212A', NULL),
(119, 'Brgy. Tartaria', '1', '1', 'SECOND FLOOR', 'pk-TAR-SF-209A', 'CTRL-TAR-SF-209A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:50:18', '2026-04-21 01:50:18', 'TIR-209A', NULL),
(120, 'Brgy. Tartaria', '1', '1', 'SECOND FLOOR', 'pk-TAR-SF-208A', 'CTRL-TAR-SF-208A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:50:18', '2026-04-21 01:50:18', 'TIR-208A', NULL),
(121, 'Brgy. Tartaria', '1', '1', 'SECOND FLOOR', 'pk-TAR-SF-208-TDX', 'CTRL-TAR-SF-208-TDX', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:50:18', '2026-04-21 01:50:18', 'TDX-208A', NULL),
(122, 'Brgy. Tartaria', '1', '1', 'SECOND FLOOR', 'pk-TAR-SF-214A-TIR', 'CTRL-TAR-SF-214A-TIR', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:50:18', '2026-04-21 01:50:18', 'TIR-214A', NULL),
(123, 'Brgy. Tartaria', '1', '1', 'SECOND FLOOR', 'pk-TAR-SF-211A', 'CTRL-TAR-SF-211A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:50:18', '2026-04-21 01:50:18', 'TDX-211A', NULL),
(124, 'Brgy. Tartaria', '1', '1', 'SECOND FLOOR', 'pk-TAR-SF-210A', 'CTRL-TAR-SF-210A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:50:18', '2026-04-21 01:50:18', 'TDX-210A', NULL),
(125, 'Brgy. Tartaria', '1', '1', 'SECOND FLOOR', 'pk-TAR-SF-218A', 'CTRL-TAR-SF-218A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:50:18', '2026-04-21 01:50:18', 'TDX-218A', NULL),
(126, 'Brgy. Tartaria', '1', '1', 'SECOND FLOOR', 'pk-TAR-SF-217A', 'CTRL-TAR-SF-217A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:50:18', '2026-04-21 01:50:18', 'TDX-217A', NULL),
(127, 'Buragwis', '1', '1', 'GROUND FLOOR', 'pk-BUR-001A', 'CTRL-BUR-001A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:53:25', '2026-04-21 01:53:25', 'TDX-001A', NULL),
(128, 'Buragwis', '1', '1', 'GROUND FLOOR', 'pk-BUR-002A', 'CTRL-BUR-002A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:53:25', '2026-04-21 01:53:25', 'TDX-002A', NULL),
(129, 'Buragwis', '1', '1', 'GROUND FLOOR', 'pk-BUR-003A', 'CTRL-BUR-003A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:53:25', '2026-04-21 01:53:25', 'TDX-003A', NULL),
(130, 'Buragwis', '1', '1', 'GROUND FLOOR', 'pk-BUR-004A', 'CTRL-BUR-004A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:53:25', '2026-04-21 01:53:25', 'TDX-004A', NULL),
(131, 'Buragwis', '1', '1', 'GROUND FLOOR', 'pk-BUR-214A', 'CTRL-BUR-214A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:53:25', '2026-04-21 01:53:25', 'TIR-214A', NULL),
(132, 'Buragwis', '1', '1', 'GROUND FLOOR', 'pk-BUR-206A', 'CTRL-BUR-206A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:53:25', '2026-04-21 01:53:25', 'TDX-206A', NULL),
(133, 'Buragwis', '1', '1', 'GROUND FLOOR', 'pk-BUR-205A', 'CTRL-BUR-205A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:53:25', '2026-04-21 01:53:25', 'TDX-205A', NULL),
(134, 'Buragwis', '1', '1', 'GROUND FLOOR', 'pk-BUR-220A', 'CTRL-BUR-220A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:53:25', '2026-04-21 01:53:25', 'TDX-220A', NULL),
(135, 'Buragwis', '1', '1', 'GROUND FLOOR', 'pk-BUR-219A', 'CTRL-BUR-219A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:53:25', '2026-04-21 01:53:25', 'TDX-219A', NULL),
(136, 'Buragwis', '1', '1', 'GROUND FLOOR', 'pk-BUR-201A', 'CTRL-BUR-201A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:53:25', '2026-04-21 01:53:25', 'TDX-201A', NULL),
(137, 'Buragwis', '1', '1', 'GROUND FLOOR', 'pk-BUR-TIR201', 'CTRL-BUR-TIR201', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:53:25', '2026-04-21 01:53:25', 'TIR-201A', NULL),
(138, 'Buragwis', '1', '1', 'GROUND FLOOR', 'pk-BUR-TIR207', 'CTRL-BUR-TIR207', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:53:25', '2026-04-21 01:53:25', 'TIR-207A', NULL),
(139, 'Buragwis', '1', '1', 'GROUND FLOOR', 'pk-BUR-204A', 'CTRL-BUR-204A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:53:25', '2026-04-21 01:53:25', 'TDX-204A', NULL),
(140, 'Buragwis', '1', '1', 'GROUND FLOOR', 'pk-BUR-203A', 'CTRL-BUR-203A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:53:25', '2026-04-21 01:53:25', 'TDX-203A', NULL),
(141, 'Buragwis', '1', '1', 'GROUND FLOOR', 'pk-BUR-216A', 'CTRL-BUR-216A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:53:25', '2026-04-21 01:53:25', 'TDX-216A', NULL),
(142, 'Buragwis', '1', '1', 'GROUND FLOOR', 'pk-BUR-215A', 'CTRL-BUR-215A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:53:25', '2026-04-21 01:53:25', 'TDX-215A', NULL),
(143, 'Buragwis', '1', '1', 'SECOND FLOOR', 'pk-BUR-SF-213A', 'CTRL-BUR-SF-213A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:55:14', '2026-04-21 01:55:14', 'TDX-213A', NULL),
(144, 'Buragwis', '1', '1', 'SECOND FLOOR', 'pk-BUR-SF-212A', 'CTRL-BUR-SF-212A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:55:14', '2026-04-21 01:55:14', 'TDX-212A', NULL),
(145, 'Buragwis', '1', '1', 'SECOND FLOOR', 'pk-BUR-SF-209A', 'CTRL-BUR-SF-209A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:55:14', '2026-04-21 01:55:14', 'TIR-209A', NULL),
(146, 'Buragwis', '1', '1', 'SECOND FLOOR', 'pk-BUR-SF-208A', 'CTRL-BUR-SF-208A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:55:14', '2026-04-21 01:55:14', 'TIR-208A', NULL),
(147, 'Buragwis', '1', '1', 'SECOND FLOOR', 'pk-BUR-SF-208-TDX', 'CTRL-BUR-SF-208-TDX', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:55:14', '2026-04-21 01:55:14', 'TDX-208A', NULL),
(148, 'Buragwis', '1', '1', 'SECOND FLOOR', 'pk-BUR-SF-214A-TIR', 'CTRL-BUR-SF-214A-TIR', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:55:14', '2026-04-21 01:55:14', 'TIR-214A', NULL),
(149, 'Buragwis', '1', '1', 'SECOND FLOOR', 'pk-BUR-SF-211A', 'CTRL-BUR-SF-211A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:55:14', '2026-04-21 01:55:14', 'TDX-211A', NULL),
(150, 'Buragwis', '1', '1', 'SECOND FLOOR', 'pk-BUR-SF-210A', 'CTRL-BUR-SF-210A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:55:14', '2026-04-21 01:55:14', 'TDX-210A', NULL),
(151, 'Buragwis', '1', '1', 'SECOND FLOOR', 'pk-BUR-SF-218A', 'CTRL-BUR-SF-218A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:55:14', '2026-04-21 01:55:14', 'TDX-218A', NULL),
(152, 'Buragwis', '1', '1', 'SECOND FLOOR', 'pk-BUR-SF-217A', 'CTRL-BUR-SF-217A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:55:14', '2026-04-21 01:55:14', 'TDX-217A', NULL),
(153, 'Estanza PH 1 & 2', '1', '1', 'GROUND FLOOR', 'pk-E12-001A', 'CTRL-E12-001A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:58:16', '2026-04-21 01:58:16', 'TDX-001A', NULL),
(154, 'Estanza PH 1 & 2', '1', '1', 'GROUND FLOOR', 'pk-E12-002A', 'CTRL-E12-002A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:58:16', '2026-04-21 01:58:16', 'TDX-002A', NULL),
(155, 'Estanza PH 1 & 2', '1', '1', 'GROUND FLOOR', 'pk-E12-003A', 'CTRL-E12-003A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:58:16', '2026-04-21 01:58:16', 'TDX-003A', NULL),
(156, 'Estanza PH 1 & 2', '1', '1', 'GROUND FLOOR', 'pk-E12-004A', 'CTRL-E12-004A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:58:16', '2026-04-21 01:58:16', 'TDX-004A', NULL),
(157, 'Estanza PH 1 & 2', '1', '1', 'GROUND FLOOR', 'pk-E12-214A', 'CTRL-E12-214A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:58:16', '2026-04-21 01:58:16', 'TIR-214A', NULL),
(158, 'Estanza PH 1 & 2', '1', '1', 'GROUND FLOOR', 'pk-E12-206A', 'CTRL-E12-206A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:58:16', '2026-04-21 01:58:16', 'TDX-206A', NULL),
(159, 'Estanza PH 1 & 2', '1', '1', 'GROUND FLOOR', 'pk-E12-205A', 'CTRL-E12-205A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:58:16', '2026-04-21 01:58:16', 'TDX-205A', NULL),
(160, 'Estanza PH 1 & 2', '1', '1', 'GROUND FLOOR', 'pk-E12-220A', 'CTRL-E12-220A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:58:16', '2026-04-21 01:58:16', 'TDX-220A', NULL),
(161, 'Estanza PH 1 & 2', '1', '1', 'GROUND FLOOR', 'pk-E12-219A', 'CTRL-E12-219A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:58:16', '2026-04-21 01:58:16', 'TDX-219A', NULL),
(162, 'Estanza PH 1 & 2', '1', '1', 'GROUND FLOOR', 'pk-E12-201A', 'CTRL-E12-201A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:58:16', '2026-04-21 01:58:16', 'TDX-201A', NULL),
(163, 'Estanza PH 1 & 2', '1', '1', 'GROUND FLOOR', 'pk-E12-TIR201', 'CTRL-E12-TIR201', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:58:16', '2026-04-21 01:58:16', 'TIR-201A', NULL),
(164, 'Estanza PH 1 & 2', '1', '1', 'GROUND FLOOR', 'pk-E12-TIR207', 'CTRL-E12-TIR207', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:58:16', '2026-04-21 01:58:16', 'TIR-207A', NULL),
(165, 'Estanza PH 1 & 2', '1', '1', 'GROUND FLOOR', 'pk-E12-204A', 'CTRL-E12-204A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:58:16', '2026-04-21 01:58:16', 'TDX-204A', NULL),
(166, 'Estanza PH 1 & 2', '1', '1', 'GROUND FLOOR', 'pk-E12-203A', 'CTRL-E12-203A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:58:16', '2026-04-21 01:58:16', 'TDX-203A', NULL),
(167, 'Estanza PH 1 & 2', '1', '1', 'GROUND FLOOR', 'pk-E12-216A', 'CTRL-E12-216A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:58:16', '2026-04-21 01:58:16', 'TDX-216A', NULL),
(168, 'Estanza PH 1 & 2', '1', '1', 'GROUND FLOOR', 'pk-E12-215A', 'CTRL-E12-215A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:58:16', '2026-04-21 01:58:16', 'TDX-215A', NULL),
(169, 'Estanza PH 1 & 2', '1', '1', 'SECOND FLOOR', 'pk-E12-SF-213A', 'CTRL-E12-SF-213A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:59:33', '2026-04-21 01:59:33', 'TDX-213A', NULL),
(170, 'Estanza PH 1 & 2', '1', '1', 'SECOND FLOOR', 'pk-E12-SF-212A', 'CTRL-E12-SF-212A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:59:33', '2026-04-21 01:59:33', 'TDX-212A', NULL),
(171, 'Estanza PH 1 & 2', '1', '1', 'SECOND FLOOR', 'pk-E12-SF-209A', 'CTRL-E12-SF-209A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:59:33', '2026-04-21 01:59:33', 'TIR-209A', NULL),
(172, 'Estanza PH 1 & 2', '1', '1', 'SECOND FLOOR', 'pk-E12-SF-208A', 'CTRL-E12-SF-208A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:59:33', '2026-04-21 01:59:33', 'TIR-208A', NULL),
(173, 'Estanza PH 1 & 2', '1', '1', 'SECOND FLOOR', 'pk-E12-SF-208-TDX', 'CTRL-E12-SF-208-TDX', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:59:33', '2026-04-21 01:59:33', 'TDX-208A', NULL),
(174, 'Estanza PH 1 & 2', '1', '1', 'SECOND FLOOR', 'pk-E12-SF-214A-TIR', 'CTRL-E12-SF-214A-TIR', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:59:33', '2026-04-21 01:59:33', 'TIR-214A', NULL),
(175, 'Estanza PH 1 & 2', '1', '1', 'SECOND FLOOR', 'pk-E12-SF-211A', 'CTRL-E12-SF-211A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:59:33', '2026-04-21 01:59:33', 'TDX-211A', NULL),
(176, 'Estanza PH 1 & 2', '1', '1', 'SECOND FLOOR', 'pk-E12-SF-210A', 'CTRL-E12-SF-210A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:59:33', '2026-04-21 01:59:33', 'TDX-210A', NULL),
(177, 'Estanza PH 1 & 2', '1', '1', 'SECOND FLOOR', 'pk-E12-SF-218A', 'CTRL-E12-SF-218A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:59:33', '2026-04-21 01:59:33', 'TDX-218A', NULL),
(178, 'Estanza PH 1 & 2', '1', '1', 'SECOND FLOOR', 'pk-E12-SF-217A', 'CTRL-E12-SF-217A', 1, 'done', NULL, NULL, NULL, '2026-04-21 01:59:33', '2026-04-21 01:59:33', 'TDX-217A', NULL),
(179, 'Estanza Phase 1', '1', '1', 'GROUND FLOOR', 'pk-EP1-001A', 'CTRL-EP1-001A', 1, 'done', NULL, NULL, NULL, '2026-04-21 02:01:15', '2026-04-21 02:01:15', 'TDX-001A', NULL),
(180, 'Estanza Phase 1', '1', '1', 'GROUND FLOOR', 'pk-EP1-002A', 'CTRL-EP1-002A', 1, 'done', NULL, NULL, NULL, '2026-04-21 02:01:15', '2026-04-21 02:01:15', 'TDX-002A', NULL),
(181, 'Estanza Phase 1', '1', '1', 'GROUND FLOOR', 'pk-EP1-003A', 'CTRL-EP1-003A', 1, 'done', NULL, NULL, NULL, '2026-04-21 02:01:15', '2026-04-21 02:01:15', 'TDX-003A', NULL),
(182, 'Estanza Phase 1', '1', '1', 'GROUND FLOOR', 'pk-EP1-004A', 'CTRL-EP1-004A', 1, 'done', NULL, NULL, NULL, '2026-04-21 02:01:15', '2026-04-21 02:01:15', 'TDX-004A', NULL),
(183, 'Estanza Phase 1', '1', '1', 'GROUND FLOOR', 'pk-EP1-214A', 'CTRL-EP1-214A', 1, 'done', NULL, NULL, NULL, '2026-04-21 02:01:15', '2026-04-21 02:01:15', 'TIR-214A', NULL),
(184, 'Estanza Phase 1', '1', '1', 'GROUND FLOOR', 'pk-EP1-206A', 'CTRL-EP1-206A', 1, 'done', NULL, NULL, NULL, '2026-04-21 02:01:15', '2026-04-21 02:01:15', 'TDX-206A', NULL),
(185, 'Estanza Phase 1', '1', '1', 'GROUND FLOOR', 'pk-EP1-205A', 'CTRL-EP1-205A', 1, 'done', NULL, NULL, NULL, '2026-04-21 02:01:15', '2026-04-21 02:01:15', 'TDX-205A', NULL),
(186, 'Estanza Phase 1', '1', '1', 'GROUND FLOOR', 'pk-EP1-220A', 'CTRL-EP1-220A', 1, 'done', NULL, NULL, NULL, '2026-04-21 02:01:15', '2026-04-21 02:01:15', 'TDX-220A', NULL),
(187, 'Estanza Phase 1', '1', '1', 'GROUND FLOOR', 'pk-EP1-219A', 'CTRL-EP1-219A', 1, 'done', NULL, NULL, NULL, '2026-04-21 02:01:15', '2026-04-21 02:01:15', 'TDX-219A', NULL),
(188, 'Estanza Phase 1', '1', '1', 'GROUND FLOOR', 'pk-EP1-201A', 'CTRL-EP1-201A', 1, 'done', NULL, NULL, NULL, '2026-04-21 02:01:15', '2026-04-21 02:01:15', 'TDX-201A', NULL),
(189, 'Estanza Phase 1', '1', '1', 'GROUND FLOOR', 'pk-EP1-TIR201', 'CTRL-EP1-TIR201', 1, 'done', NULL, NULL, NULL, '2026-04-21 02:01:15', '2026-04-21 02:01:15', 'TIR-201A', NULL),
(190, 'Estanza Phase 1', '1', '1', 'GROUND FLOOR', 'pk-EP1-TIR207', 'CTRL-EP1-TIR207', 1, 'done', NULL, NULL, NULL, '2026-04-21 02:01:15', '2026-04-21 02:01:15', 'TIR-207A', NULL),
(191, 'Estanza Phase 1', '1', '1', 'GROUND FLOOR', 'pk-EP1-204A', 'CTRL-EP1-204A', 1, 'done', NULL, NULL, NULL, '2026-04-21 02:01:15', '2026-04-21 02:01:15', 'TDX-204A', NULL),
(192, 'Estanza Phase 1', '1', '1', 'GROUND FLOOR', 'pk-EP1-203A', 'CTRL-EP1-203A', 1, 'done', NULL, NULL, NULL, '2026-04-21 02:01:15', '2026-04-21 02:01:15', 'TDX-203A', NULL),
(193, 'Estanza Phase 1', '1', '1', 'GROUND FLOOR', 'pk-EP1-216A', 'CTRL-EP1-216A', 1, 'done', NULL, NULL, NULL, '2026-04-21 02:01:15', '2026-04-21 02:01:15', 'TDX-216A', NULL),
(194, 'Estanza Phase 1', '1', '1', 'GROUND FLOOR', 'pk-EP1-215A', 'CTRL-EP1-215A', 1, 'done', NULL, NULL, NULL, '2026-04-21 02:01:15', '2026-04-21 02:01:15', 'TDX-215A', NULL),
(195, 'Estanza Phase 1', '1', '1', 'SECOND FLOOR', 'pk-EP1-SF-213A', 'CTRL-EP1-SF-213A', 1, 'done', NULL, NULL, NULL, '2026-04-21 02:02:17', '2026-04-21 02:02:17', 'TDX-213A', NULL),
(196, 'Estanza Phase 1', '1', '1', 'SECOND FLOOR', 'pk-EP1-SF-212A', 'CTRL-EP1-SF-212A', 1, 'done', NULL, NULL, NULL, '2026-04-21 02:02:17', '2026-04-21 02:02:17', 'TDX-212A', NULL),
(197, 'Estanza Phase 1', '1', '1', 'SECOND FLOOR', 'pk-EP1-SF-209A', 'CTRL-EP1-SF-209A', 1, 'done', NULL, NULL, NULL, '2026-04-21 02:02:17', '2026-04-21 02:02:17', 'TIR-209A', NULL),
(198, 'Estanza Phase 1', '1', '1', 'SECOND FLOOR', 'pk-EP1-SF-208A', 'CTRL-EP1-SF-208A', 1, 'done', NULL, NULL, NULL, '2026-04-21 02:02:17', '2026-04-21 02:02:17', 'TIR-208A', NULL),
(199, 'Estanza Phase 1', '1', '1', 'SECOND FLOOR', 'pk-EP1-SF-208-TDX', 'CTRL-EP1-SF-208-TDX', 1, 'done', NULL, NULL, NULL, '2026-04-21 02:02:17', '2026-04-21 02:02:17', 'TDX-208A', NULL),
(200, 'Estanza Phase 1', '1', '1', 'SECOND FLOOR', 'pk-EP1-SF-214A-TIR', 'CTRL-EP1-SF-214A-TIR', 1, 'done', NULL, NULL, NULL, '2026-04-21 02:02:17', '2026-04-21 02:02:17', 'TIR-214A', NULL),
(201, 'Estanza Phase 1', '1', '1', 'SECOND FLOOR', 'pk-EP1-SF-211A', 'CTRL-EP1-SF-211A', 1, 'done', NULL, NULL, NULL, '2026-04-21 02:02:17', '2026-04-21 02:02:17', 'TDX-211A', NULL),
(202, 'Estanza Phase 1', '1', '1', 'SECOND FLOOR', 'pk-EP1-SF-210A', 'CTRL-EP1-SF-210A', 1, 'done', NULL, NULL, NULL, '2026-04-21 02:02:17', '2026-04-21 02:02:17', 'TDX-210A', NULL),
(203, 'Estanza Phase 1', '1', '1', 'SECOND FLOOR', 'pk-EP1-SF-218A', 'CTRL-EP1-SF-218A', 1, 'done', NULL, NULL, NULL, '2026-04-21 02:02:17', '2026-04-21 02:02:17', 'TDX-218A', NULL),
(204, 'Estanza Phase 1', '1', '1', 'SECOND FLOOR', 'pk-EP1-SF-217A', 'CTRL-EP1-SF-217A', 1, 'done', NULL, NULL, NULL, '2026-04-21 02:02:17', '2026-04-21 02:02:17', 'TDX-217A', NULL),
(205, 'Homapon Legazpi City', '1', '1', 'GROUND FLOOR', 'pk-HOM-001A', 'CTRL-HOM-001A', 1, 'done', NULL, NULL, NULL, '2026-04-21 02:04:02', '2026-04-21 02:04:02', 'TDX-001A', NULL),
(206, 'Homapon Legazpi City', '1', '1', 'GROUND FLOOR', 'pk-HOM-002A', 'CTRL-HOM-002A', 1, 'done', NULL, NULL, NULL, '2026-04-21 02:04:02', '2026-04-21 02:04:02', 'TDX-002A', NULL),
(207, 'Homapon Legazpi City', '1', '1', 'GROUND FLOOR', 'pk-HOM-003A', 'CTRL-HOM-003A', 1, 'done', NULL, NULL, NULL, '2026-04-21 02:04:02', '2026-04-21 02:04:02', 'TDX-003A', NULL),
(208, 'Homapon Legazpi City', '1', '1', 'GROUND FLOOR', 'pk-HOM-004A', 'CTRL-HOM-004A', 1, 'done', NULL, NULL, NULL, '2026-04-21 02:04:02', '2026-04-21 02:04:02', 'TDX-004A', NULL),
(209, 'Homapon Legazpi City', '1', '1', 'GROUND FLOOR', 'pk-HOM-214A', 'CTRL-HOM-214A', 1, 'done', NULL, NULL, NULL, '2026-04-21 02:04:02', '2026-04-21 02:04:02', 'TIR-214A', NULL),
(210, 'Homapon Legazpi City', '1', '1', 'GROUND FLOOR', 'pk-HOM-206A', 'CTRL-HOM-206A', 1, 'done', NULL, NULL, NULL, '2026-04-21 02:04:02', '2026-04-21 02:04:02', 'TDX-206A', NULL),
(211, 'Homapon Legazpi City', '1', '1', 'GROUND FLOOR', 'pk-HOM-205A', 'CTRL-HOM-205A', 1, 'done', NULL, NULL, NULL, '2026-04-21 02:04:02', '2026-04-21 02:04:02', 'TDX-205A', NULL),
(212, 'Homapon Legazpi City', '1', '1', 'GROUND FLOOR', 'pk-HOM-220A', 'CTRL-HOM-220A', 1, 'done', NULL, NULL, NULL, '2026-04-21 02:04:02', '2026-04-21 02:04:02', 'TDX-220A', NULL),
(213, 'Homapon Legazpi City', '1', '1', 'GROUND FLOOR', 'pk-HOM-219A', 'CTRL-HOM-219A', 1, 'done', NULL, NULL, NULL, '2026-04-21 02:04:02', '2026-04-21 02:04:02', 'TDX-219A', NULL),
(214, 'Homapon Legazpi City', '1', '1', 'GROUND FLOOR', 'pk-HOM-201A', 'CTRL-HOM-201A', 1, 'done', NULL, NULL, NULL, '2026-04-21 02:04:02', '2026-04-21 02:04:02', 'TDX-201A', NULL),
(215, 'Homapon Legazpi City', '1', '1', 'GROUND FLOOR', 'pk-HOM-TIR201', 'CTRL-HOM-TIR201', 1, 'done', NULL, NULL, NULL, '2026-04-21 02:04:02', '2026-04-21 02:04:02', 'TIR-201A', NULL),
(216, 'Homapon Legazpi City', '1', '1', 'GROUND FLOOR', 'pk-HOM-TIR207', 'CTRL-HOM-TIR207', 1, 'done', NULL, NULL, NULL, '2026-04-21 02:04:02', '2026-04-21 02:04:02', 'TIR-207A', NULL),
(217, 'Homapon Legazpi City', '1', '1', 'GROUND FLOOR', 'pk-HOM-204A', 'CTRL-HOM-204A', 1, 'done', NULL, NULL, NULL, '2026-04-21 02:04:02', '2026-04-21 02:04:02', 'TDX-204A', NULL),
(218, 'Homapon Legazpi City', '1', '1', 'GROUND FLOOR', 'pk-HOM-203A', 'CTRL-HOM-203A', 1, 'done', NULL, NULL, NULL, '2026-04-21 02:04:02', '2026-04-21 02:04:02', 'TDX-203A', NULL),
(219, 'Homapon Legazpi City', '1', '1', 'GROUND FLOOR', 'pk-HOM-216A', 'CTRL-HOM-216A', 1, 'done', NULL, NULL, NULL, '2026-04-21 02:04:02', '2026-04-21 02:04:02', 'TDX-216A', NULL),
(220, 'Homapon Legazpi City', '1', '1', 'GROUND FLOOR', 'pk-HOM-215A', 'CTRL-HOM-215A', 1, 'done', NULL, NULL, NULL, '2026-04-21 02:04:02', '2026-04-21 02:04:02', 'TDX-215A', NULL),
(221, 'Homapon Legazpi City', '1', '1', 'SECOND FLOOR', 'pk-HOM-SF-213A', 'CTRL-HOM-SF-213A', 1, 'done', NULL, NULL, NULL, '2026-04-21 02:05:15', '2026-04-21 02:05:15', 'TDX-213A', NULL),
(222, 'Homapon Legazpi City', '1', '1', 'SECOND FLOOR', 'pk-HOM-SF-212A', 'CTRL-HOM-SF-212A', 1, 'done', NULL, NULL, NULL, '2026-04-21 02:05:15', '2026-04-21 02:05:15', 'TDX-212A', NULL),
(223, 'Homapon Legazpi City', '1', '1', 'SECOND FLOOR', 'pk-HOM-SF-209A', 'CTRL-HOM-SF-209A', 1, 'done', NULL, NULL, NULL, '2026-04-21 02:05:15', '2026-04-21 02:05:15', 'TIR-209A', NULL),
(224, 'Homapon Legazpi City', '1', '1', 'SECOND FLOOR', 'pk-HOM-SF-208A', 'CTRL-HOM-SF-208A', 1, 'done', NULL, NULL, NULL, '2026-04-21 02:05:15', '2026-04-21 02:05:15', 'TIR-208A', NULL),
(225, 'Homapon Legazpi City', '1', '1', 'SECOND FLOOR', 'pk-HOM-SF-208-TDX', 'CTRL-HOM-SF-208-TDX', 1, 'done', NULL, NULL, NULL, '2026-04-21 02:05:15', '2026-04-21 02:05:15', 'TDX-208A', NULL),
(226, 'Homapon Legazpi City', '1', '1', 'SECOND FLOOR', 'pk-HOM-SF-214A-TIR', 'CTRL-HOM-SF-214A-TIR', 1, 'done', NULL, NULL, NULL, '2026-04-21 02:05:15', '2026-04-21 02:05:15', 'TIR-214A', NULL),
(227, 'Homapon Legazpi City', '1', '1', 'SECOND FLOOR', 'pk-HOM-SF-211A', 'CTRL-HOM-SF-211A', 1, 'done', NULL, NULL, NULL, '2026-04-21 02:05:15', '2026-04-21 02:05:15', 'TDX-211A', NULL),
(228, 'Homapon Legazpi City', '1', '1', 'SECOND FLOOR', 'pk-HOM-SF-210A', 'CTRL-HOM-SF-210A', 1, 'done', NULL, NULL, NULL, '2026-04-21 02:05:15', '2026-04-21 02:05:15', 'TDX-210A', NULL),
(229, 'Homapon Legazpi City', '1', '1', 'SECOND FLOOR', 'pk-HOM-SF-218A', 'CTRL-HOM-SF-218A', 1, 'done', NULL, NULL, NULL, '2026-04-21 02:05:15', '2026-04-21 02:05:15', 'TDX-218A', NULL),
(230, 'Homapon Legazpi City', '1', '1', 'SECOND FLOOR', 'pk-HOM-SF-217A', 'CTRL-HOM-SF-217A', 1, 'done', NULL, NULL, NULL, '2026-04-21 02:05:15', '2026-04-21 02:05:15', 'TDX-217A', NULL),
(231, 'Imperial Meadows', '1', '1', 'GROUND FLOOR', 'pk-IM-001A', 'CTRL-IM-001A', 1, 'done', NULL, NULL, NULL, '2026-04-21 06:46:29', '2026-04-21 06:46:29', 'TDX-001A', NULL),
(232, 'Imperial Meadows', '1', '1', 'GROUND FLOOR', 'pk-IM-002A', 'CTRL-IM-002A', 1, 'done', NULL, NULL, NULL, '2026-04-21 06:46:29', '2026-04-21 06:46:29', 'TDX-002A', NULL),
(233, 'Imperial Meadows', '1', '1', 'GROUND FLOOR', 'pk-IM-003A', 'CTRL-IM-003A', 1, 'done', NULL, NULL, NULL, '2026-04-21 06:46:29', '2026-04-21 06:46:29', 'TDX-003A', NULL),
(234, 'Imperial Meadows', '1', '1', 'GROUND FLOOR', 'pk-IM-004A', 'CTRL-IM-004A', 1, 'done', NULL, NULL, NULL, '2026-04-21 06:46:29', '2026-04-21 06:46:29', 'TDX-004A', NULL),
(235, 'Imperial Meadows', '1', '1', 'GROUND FLOOR', 'pk-IM-214A', 'CTRL-IM-214A', 1, 'done', NULL, NULL, NULL, '2026-04-21 06:46:29', '2026-04-21 06:46:29', 'TIR-214A', NULL),
(236, 'Imperial Meadows', '1', '1', 'GROUND FLOOR', 'pk-IM-206A', 'CTRL-IM-206A', 1, 'done', NULL, NULL, NULL, '2026-04-21 06:46:29', '2026-04-21 06:46:29', 'TDX-206A', NULL),
(237, 'Imperial Meadows', '1', '1', 'GROUND FLOOR', 'pk-IM-205A', 'CTRL-IM-205A', 1, 'done', NULL, NULL, NULL, '2026-04-21 06:46:29', '2026-04-21 06:46:29', 'TDX-205A', NULL),
(238, 'Imperial Meadows', '1', '1', 'GROUND FLOOR', 'pk-IM-220A', 'CTRL-IM-220A', 1, 'done', NULL, NULL, NULL, '2026-04-21 06:46:29', '2026-04-21 06:46:29', 'TDX-220A', NULL),
(239, 'Imperial Meadows', '1', '1', 'GROUND FLOOR', 'pk-IM-219A', 'CTRL-IM-219A', 1, 'done', NULL, NULL, NULL, '2026-04-21 06:46:29', '2026-04-21 06:46:29', 'TDX-219A', NULL),
(240, 'Imperial Meadows', '1', '1', 'GROUND FLOOR', 'pk-IM-201A', 'CTRL-IM-201A', 1, 'done', NULL, NULL, NULL, '2026-04-21 06:46:29', '2026-04-21 06:46:29', 'TDX-201A', NULL),
(241, 'Imperial Meadows', '1', '1', 'GROUND FLOOR', 'pk-IM-TIR201', 'CTRL-IM-TIR201', 1, 'done', NULL, NULL, NULL, '2026-04-21 06:46:29', '2026-04-21 06:46:29', 'TIR-201A', NULL),
(242, 'Imperial Meadows', '1', '1', 'GROUND FLOOR', 'pk-IM-TIR207', 'CTRL-IM-TIR207', 1, 'done', NULL, NULL, NULL, '2026-04-21 06:46:29', '2026-04-21 06:46:29', 'TIR-207A', NULL),
(243, 'Imperial Meadows', '1', '1', 'GROUND FLOOR', 'pk-IM-204A', 'CTRL-IM-204A', 1, 'done', NULL, NULL, NULL, '2026-04-21 06:46:29', '2026-04-21 06:46:29', 'TDX-204A', NULL),
(244, 'Imperial Meadows', '1', '1', 'GROUND FLOOR', 'pk-IM-203A', 'CTRL-IM-203A', 1, 'done', NULL, NULL, NULL, '2026-04-21 06:46:29', '2026-04-21 06:46:29', 'TDX-203A', NULL),
(245, 'Imperial Meadows', '1', '1', 'GROUND FLOOR', 'pk-IM-216A', 'CTRL-IM-216A', 1, 'done', NULL, NULL, NULL, '2026-04-21 06:46:29', '2026-04-21 06:46:29', 'TDX-216A', NULL),
(246, 'Imperial Meadows', '1', '1', 'GROUND FLOOR', 'pk-IM-215A', 'CTRL-IM-215A', 1, 'done', NULL, NULL, NULL, '2026-04-21 06:46:29', '2026-04-21 06:46:29', 'TDX-215A', NULL),
(247, 'Imperial Meadows', '1', '1', 'SECOND FLOOR', 'pk-IM-SF-213A', 'CTRL-IM-SF-213A', 1, 'done', NULL, NULL, NULL, '2026-04-21 06:47:52', '2026-04-21 06:47:52', 'TDX-213A', NULL),
(248, 'Imperial Meadows', '1', '1', 'SECOND FLOOR', 'pk-IM-SF-212A', 'CTRL-IM-SF-212A', 1, 'done', NULL, NULL, NULL, '2026-04-21 06:47:52', '2026-04-21 06:47:52', 'TDX-212A', NULL),
(249, 'Imperial Meadows', '1', '1', 'SECOND FLOOR', 'pk-IM-SF-209A', 'CTRL-IM-SF-209A', 1, 'done', NULL, NULL, NULL, '2026-04-21 06:47:52', '2026-04-21 06:47:52', 'TIR-209A', NULL),
(250, 'Imperial Meadows', '1', '1', 'SECOND FLOOR', 'pk-IM-SF-208A', 'CTRL-IM-SF-208A', 1, 'done', NULL, NULL, NULL, '2026-04-21 06:47:52', '2026-04-21 06:47:52', 'TIR-208A', NULL),
(251, 'Imperial Meadows', '1', '1', 'SECOND FLOOR', 'pk-IM-SF-208-TDX', 'CTRL-IM-SF-208-TDX', 1, 'done', NULL, NULL, NULL, '2026-04-21 06:47:52', '2026-04-21 06:47:52', 'TDX-208A', NULL),
(252, 'Imperial Meadows', '1', '1', 'SECOND FLOOR', 'pk-IM-SF-214A-TIR', 'CTRL-IM-SF-214A-TIR', 1, 'done', NULL, NULL, NULL, '2026-04-21 06:47:52', '2026-04-21 06:47:52', 'TIR-214A', NULL),
(253, 'Imperial Meadows', '1', '1', 'SECOND FLOOR', 'pk-IM-SF-211A', 'CTRL-IM-SF-211A', 1, 'done', NULL, NULL, NULL, '2026-04-21 06:47:52', '2026-04-21 06:47:52', 'TDX-211A', NULL),
(254, 'Imperial Meadows', '1', '1', 'SECOND FLOOR', 'pk-IM-SF-210A', 'CTRL-IM-SF-210A', 1, 'done', NULL, NULL, NULL, '2026-04-21 06:47:52', '2026-04-21 06:47:52', 'TDX-210A', NULL),
(255, 'Imperial Meadows', '1', '1', 'SECOND FLOOR', 'pk-IM-SF-218A', 'CTRL-IM-SF-218A', 1, 'done', NULL, NULL, NULL, '2026-04-21 06:47:52', '2026-04-21 06:47:52', 'TDX-218A', NULL),
(256, 'Imperial Meadows', '1', '1', 'SECOND FLOOR', 'pk-IM-SF-217A', 'CTRL-IM-SF-217A', 1, 'done', NULL, NULL, NULL, '2026-04-21 06:47:52', '2026-04-21 06:47:52', 'TDX-217A', NULL),
(257, 'Iriga Phase 1', '1', '1', 'GROUND FLOOR', 'pk-IR1-001A', 'CTRL-IR1-001A', 1, 'done', NULL, NULL, NULL, '2026-04-21 06:51:21', '2026-04-21 06:51:21', 'TDX-001A', NULL),
(258, 'Iriga Phase 1', '1', '1', 'GROUND FLOOR', 'pk-IR1-002A', 'CTRL-IR1-002A', 1, 'done', NULL, NULL, NULL, '2026-04-21 06:51:21', '2026-04-21 06:51:21', 'TDX-002A', NULL),
(259, 'Iriga Phase 1', '1', '1', 'GROUND FLOOR', 'pk-IR1-003A', 'CTRL-IR1-003A', 1, 'done', NULL, NULL, NULL, '2026-04-21 06:51:21', '2026-04-21 06:51:21', 'TDX-003A', NULL),
(260, 'Iriga Phase 1', '1', '1', 'GROUND FLOOR', 'pk-IR1-004A', 'CTRL-IR1-004A', 1, 'done', NULL, NULL, NULL, '2026-04-21 06:51:21', '2026-04-21 06:51:21', 'TDX-004A', NULL),
(261, 'Iriga Phase 1', '1', '1', 'GROUND FLOOR', 'pk-IR1-214A', 'CTRL-IR1-214A', 1, 'done', NULL, NULL, NULL, '2026-04-21 06:51:21', '2026-04-21 06:51:21', 'TIR-214A', NULL),
(262, 'Iriga Phase 1', '1', '1', 'GROUND FLOOR', 'pk-IR1-206A', 'CTRL-IR1-206A', 1, 'done', NULL, NULL, NULL, '2026-04-21 06:51:21', '2026-04-21 06:51:21', 'TDX-206A', NULL),
(263, 'Iriga Phase 1', '1', '1', 'GROUND FLOOR', 'pk-IR1-205A', 'CTRL-IR1-205A', 1, 'done', NULL, NULL, NULL, '2026-04-21 06:51:21', '2026-04-21 06:51:21', 'TDX-205A', NULL),
(264, 'Iriga Phase 1', '1', '1', 'GROUND FLOOR', 'pk-IR1-220A', 'CTRL-IR1-220A', 1, 'done', NULL, NULL, NULL, '2026-04-21 06:51:21', '2026-04-21 06:51:21', 'TDX-220A', NULL),
(265, 'Iriga Phase 1', '1', '1', 'GROUND FLOOR', 'pk-IR1-219A', 'CTRL-IR1-219A', 1, 'done', NULL, NULL, NULL, '2026-04-21 06:51:21', '2026-04-21 06:51:21', 'TDX-219A', NULL),
(266, 'Iriga Phase 1', '1', '1', 'GROUND FLOOR', 'pk-IR1-201A', 'CTRL-IR1-201A', 1, 'done', NULL, NULL, NULL, '2026-04-21 06:51:21', '2026-04-21 06:51:21', 'TDX-201A', NULL),
(267, 'Iriga Phase 1', '1', '1', 'GROUND FLOOR', 'pk-IR1-TIR201', 'CTRL-IR1-TIR201', 1, 'done', NULL, NULL, NULL, '2026-04-21 06:51:21', '2026-04-21 06:51:21', 'TIR-201A', NULL),
(268, 'Iriga Phase 1', '1', '1', 'GROUND FLOOR', 'pk-IR1-TIR207', 'CTRL-IR1-TIR207', 1, 'done', NULL, NULL, NULL, '2026-04-21 06:51:21', '2026-04-21 06:51:21', 'TIR-207A', NULL),
(269, 'Iriga Phase 1', '1', '1', 'GROUND FLOOR', 'pk-IR1-204A', 'CTRL-IR1-204A', 1, 'done', NULL, NULL, NULL, '2026-04-21 06:51:21', '2026-04-21 06:51:21', 'TDX-204A', NULL),
(270, 'Iriga Phase 1', '1', '1', 'GROUND FLOOR', 'pk-IR1-203A', 'CTRL-IR1-203A', 1, 'done', NULL, NULL, NULL, '2026-04-21 06:51:21', '2026-04-21 06:51:21', 'TDX-203A', NULL),
(271, 'Iriga Phase 1', '1', '1', 'GROUND FLOOR', 'pk-IR1-216A', 'CTRL-IR1-216A', 1, 'done', NULL, NULL, NULL, '2026-04-21 06:51:21', '2026-04-21 06:51:21', 'TDX-216A', NULL),
(272, 'Iriga Phase 1', '1', '1', 'GROUND FLOOR', 'pk-IR1-215A', 'CTRL-IR1-215A', 1, 'done', NULL, NULL, NULL, '2026-04-21 06:51:21', '2026-04-21 06:51:21', 'TDX-215A', NULL),
(273, 'Iriga Phase 1', '1', '1', 'SECOND FLOOR', 'pk-IR1-SF-213A', 'CTRL-IR1-SF-213A', 1, 'done', NULL, NULL, NULL, '2026-04-21 06:52:48', '2026-04-21 06:52:48', 'TDX-213A', NULL),
(274, 'Iriga Phase 1', '1', '1', 'SECOND FLOOR', 'pk-IR1-SF-212A', 'CTRL-IR1-SF-212A', 1, 'done', NULL, NULL, NULL, '2026-04-21 06:52:48', '2026-04-21 06:52:48', 'TDX-212A', NULL),
(275, 'Iriga Phase 1', '1', '1', 'SECOND FLOOR', 'pk-IR1-SF-209A', 'CTRL-IR1-SF-209A', 1, 'done', NULL, NULL, NULL, '2026-04-21 06:52:48', '2026-04-21 06:52:48', 'TIR-209A', NULL),
(276, 'Iriga Phase 1', '1', '1', 'SECOND FLOOR', 'pk-IR1-SF-208A', 'CTRL-IR1-SF-208A', 1, 'done', NULL, NULL, NULL, '2026-04-21 06:52:48', '2026-04-21 06:52:48', 'TIR-208A', NULL),
(277, 'Iriga Phase 1', '1', '1', 'SECOND FLOOR', 'pk-IR1-SF-208-TDX', 'CTRL-IR1-SF-208-TDX', 1, 'done', NULL, NULL, NULL, '2026-04-21 06:52:48', '2026-04-21 06:52:48', 'TDX-208A', NULL),
(278, 'Iriga Phase 1', '1', '1', 'SECOND FLOOR', 'pk-IR1-SF-214A-TIR', 'CTRL-IR1-SF-214A-TIR', 1, 'done', NULL, NULL, NULL, '2026-04-21 06:52:48', '2026-04-21 06:52:48', 'TIR-214A', NULL),
(279, 'Iriga Phase 1', '1', '1', 'SECOND FLOOR', 'pk-IR1-SF-211A', 'CTRL-IR1-SF-211A', 1, 'done', NULL, NULL, NULL, '2026-04-21 06:52:48', '2026-04-21 06:52:48', 'TDX-211A', NULL),
(280, 'Iriga Phase 1', '1', '1', 'SECOND FLOOR', 'pk-IR1-SF-210A', 'CTRL-IR1-SF-210A', 1, 'done', NULL, NULL, NULL, '2026-04-21 06:52:48', '2026-04-21 06:52:48', 'TDX-210A', NULL),
(281, 'Iriga Phase 1', '1', '1', 'SECOND FLOOR', 'pk-IR1-SF-218A', 'CTRL-IR1-SF-218A', 1, 'done', NULL, NULL, NULL, '2026-04-21 06:52:48', '2026-04-21 06:52:48', 'TDX-218A', NULL),
(282, 'Iriga Phase 1', '1', '1', 'SECOND FLOOR', 'pk-IR1-SF-217A', 'CTRL-IR1-SF-217A', 1, 'done', NULL, NULL, NULL, '2026-04-21 06:52:48', '2026-04-21 06:52:48', 'TDX-217A', NULL),
(283, 'Labo', '1', '1', 'GROUND FLOOR', 'pk-LABO-001A', 'CTRL-LABO-001A', 1, 'done', NULL, NULL, NULL, '2026-04-21 06:55:59', '2026-04-21 06:55:59', 'TDX-001A', NULL),
(284, 'Labo', '1', '1', 'GROUND FLOOR', 'pk-LABO-002A', 'CTRL-LABO-002A', 1, 'done', NULL, NULL, NULL, '2026-04-21 06:55:59', '2026-04-21 06:55:59', 'TDX-002A', NULL),
(285, 'Labo', '1', '1', 'GROUND FLOOR', 'pk-LABO-003A', 'CTRL-LABO-003A', 1, 'done', NULL, NULL, NULL, '2026-04-21 06:55:59', '2026-04-21 06:55:59', 'TDX-003A', NULL),
(286, 'Labo', '1', '1', 'GROUND FLOOR', 'pk-LABO-004A', 'CTRL-LABO-004A', 1, 'done', NULL, NULL, NULL, '2026-04-21 06:55:59', '2026-04-21 06:55:59', 'TDX-004A', NULL),
(287, 'Labo', '1', '1', 'GROUND FLOOR', 'pk-LABO-214A', 'CTRL-LABO-214A', 1, 'done', NULL, NULL, NULL, '2026-04-21 06:55:59', '2026-04-21 06:55:59', 'TIR-214A', NULL),
(288, 'Labo', '1', '1', 'GROUND FLOOR', 'pk-LABO-206A', 'CTRL-LABO-206A', 1, 'done', NULL, NULL, NULL, '2026-04-21 06:55:59', '2026-04-21 06:55:59', 'TDX-206A', NULL),
(289, 'Labo', '1', '1', 'GROUND FLOOR', 'pk-LABO-205A', 'CTRL-LABO-205A', 1, 'done', NULL, NULL, NULL, '2026-04-21 06:55:59', '2026-04-21 06:55:59', 'TDX-205A', NULL),
(290, 'Labo', '1', '1', 'GROUND FLOOR', 'pk-LABO-220A', 'CTRL-LABO-220A', 1, 'done', NULL, NULL, NULL, '2026-04-21 06:55:59', '2026-04-21 06:55:59', 'TDX-220A', NULL),
(291, 'Labo', '1', '1', 'GROUND FLOOR', 'pk-LABO-219A', 'CTRL-LABO-219A', 1, 'done', NULL, NULL, NULL, '2026-04-21 06:55:59', '2026-04-21 06:55:59', 'TDX-219A', NULL),
(292, 'Labo', '1', '1', 'GROUND FLOOR', 'pk-LABO-201A', 'CTRL-LABO-201A', 1, 'done', NULL, NULL, NULL, '2026-04-21 06:55:59', '2026-04-21 06:55:59', 'TDX-201A', NULL),
(293, 'Labo', '1', '1', 'GROUND FLOOR', 'pk-LABO-TIR201', 'CTRL-LABO-TIR201', 1, 'done', NULL, NULL, NULL, '2026-04-21 06:55:59', '2026-04-21 06:55:59', 'TIR-201A', NULL),
(294, 'Labo', '1', '1', 'GROUND FLOOR', 'pk-LABO-TIR207', 'CTRL-LABO-TIR207', 1, 'done', NULL, NULL, NULL, '2026-04-21 06:55:59', '2026-04-21 06:55:59', 'TIR-207A', NULL),
(295, 'Labo', '1', '1', 'GROUND FLOOR', 'pk-LABO-204A', 'CTRL-LABO-204A', 1, 'done', NULL, NULL, NULL, '2026-04-21 06:55:59', '2026-04-21 06:55:59', 'TDX-204A', NULL),
(296, 'Labo', '1', '1', 'GROUND FLOOR', 'pk-LABO-203A', 'CTRL-LABO-203A', 1, 'done', NULL, NULL, NULL, '2026-04-21 06:55:59', '2026-04-21 06:55:59', 'TDX-203A', NULL),
(297, 'Labo', '1', '1', 'GROUND FLOOR', 'pk-LABO-216A', 'CTRL-LABO-216A', 1, 'done', NULL, NULL, NULL, '2026-04-21 06:55:59', '2026-04-21 06:55:59', 'TDX-216A', NULL),
(298, 'Labo', '1', '1', 'GROUND FLOOR', 'pk-LABO-215A', 'CTRL-LABO-215A', 1, 'done', NULL, NULL, NULL, '2026-04-21 06:55:59', '2026-04-21 06:55:59', 'TDX-215A', NULL),
(299, 'Labo', '1', '1', 'SECOND FLOOR', 'pk-LABO-SF-213A', 'CTRL-LABO-SF-213A', 1, 'done', NULL, NULL, NULL, '2026-04-21 06:58:08', '2026-04-21 06:58:08', 'TDX-213A', NULL),
(300, 'Labo', '1', '1', 'SECOND FLOOR', 'pk-LABO-SF-212A', 'CTRL-LABO-SF-212A', 1, 'done', NULL, NULL, NULL, '2026-04-21 06:58:08', '2026-04-21 06:58:08', 'TDX-212A', NULL),
(301, 'Labo', '1', '1', 'SECOND FLOOR', 'pk-LABO-SF-209A', 'CTRL-LABO-SF-209A', 1, 'done', NULL, NULL, NULL, '2026-04-21 06:58:08', '2026-04-21 06:58:08', 'TIR-209A', NULL),
(302, 'Labo', '1', '1', 'SECOND FLOOR', 'pk-LABO-SF-208A', 'CTRL-LABO-SF-208A', 1, 'done', NULL, NULL, NULL, '2026-04-21 06:58:08', '2026-04-21 06:58:08', 'TIR-208A', NULL),
(303, 'Labo', '1', '1', 'SECOND FLOOR', 'pk-LABO-SF-208-TDX', 'CTRL-LABO-SF-208-TDX', 1, 'done', NULL, NULL, NULL, '2026-04-21 06:58:08', '2026-04-21 06:58:08', 'TDX-208A', NULL),
(304, 'Labo', '1', '1', 'SECOND FLOOR', 'pk-LABO-SF-214A-TIR', 'CTRL-LABO-SF-214A-TIR', 1, 'done', NULL, NULL, NULL, '2026-04-21 06:58:08', '2026-04-21 06:58:08', 'TIR-214A', NULL);
INSERT INTO `connovate_panels` (`id`, `project_name`, `block_no`, `lot_no`, `floor_name`, `panel_key`, `control_number`, `quantity`, `status`, `completed_by_id`, `completed_by`, `completed_at`, `created_at`, `updated_at`, `connovate_part`, `started_at`) VALUES
(305, 'Labo', '1', '1', 'SECOND FLOOR', 'pk-LABO-SF-211A', 'CTRL-LABO-SF-211A', 1, 'done', NULL, NULL, NULL, '2026-04-21 06:58:08', '2026-04-21 06:58:08', 'TDX-211A', NULL),
(306, 'Labo', '1', '1', 'SECOND FLOOR', 'pk-LABO-SF-210A', 'CTRL-LABO-SF-210A', 1, 'done', NULL, NULL, NULL, '2026-04-21 06:58:08', '2026-04-21 06:58:08', 'TDX-210A', NULL),
(307, 'Labo', '1', '1', 'SECOND FLOOR', 'pk-LABO-SF-218A', 'CTRL-LABO-SF-218A', 1, 'done', NULL, NULL, NULL, '2026-04-21 06:58:08', '2026-04-21 06:58:08', 'TDX-218A', NULL),
(308, 'Labo', '1', '1', 'SECOND FLOOR', 'pk-LABO-SF-217A', 'CTRL-LABO-SF-217A', 1, 'done', NULL, NULL, NULL, '2026-04-21 06:58:08', '2026-04-21 06:58:08', 'TDX-217A', NULL),
(309, 'LeGrand 1 & 2', '1', '1', 'GROUND FLOOR', 'pk-LG12-001A', 'CTRL-LG12-001A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:01:30', '2026-04-21 07:01:30', 'TDX-001A', NULL),
(310, 'LeGrand 1 & 2', '1', '1', 'GROUND FLOOR', 'pk-LG12-002A', 'CTRL-LG12-002A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:01:30', '2026-04-21 07:01:30', 'TDX-002A', NULL),
(311, 'LeGrand 1 & 2', '1', '1', 'GROUND FLOOR', 'pk-LG12-003A', 'CTRL-LG12-003A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:01:30', '2026-04-21 07:01:30', 'TDX-003A', NULL),
(312, 'LeGrand 1 & 2', '1', '1', 'GROUND FLOOR', 'pk-LG12-004A', 'CTRL-LG12-004A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:01:30', '2026-04-21 07:01:30', 'TDX-004A', NULL),
(313, 'LeGrand 1 & 2', '1', '1', 'GROUND FLOOR', 'pk-LG12-214A', 'CTRL-LG12-214A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:01:30', '2026-04-21 07:01:30', 'TIR-214A', NULL),
(314, 'LeGrand 1 & 2', '1', '1', 'GROUND FLOOR', 'pk-LG12-206A', 'CTRL-LG12-206A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:01:30', '2026-04-21 07:01:30', 'TDX-206A', NULL),
(315, 'LeGrand 1 & 2', '1', '1', 'GROUND FLOOR', 'pk-LG12-205A', 'CTRL-LG12-205A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:01:30', '2026-04-21 07:01:30', 'TDX-205A', NULL),
(316, 'LeGrand 1 & 2', '1', '1', 'GROUND FLOOR', 'pk-LG12-220A', 'CTRL-LG12-220A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:01:30', '2026-04-21 07:01:30', 'TDX-220A', NULL),
(317, 'LeGrand 1 & 2', '1', '1', 'GROUND FLOOR', 'pk-LG12-219A', 'CTRL-LG12-219A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:01:30', '2026-04-21 07:01:30', 'TDX-219A', NULL),
(318, 'LeGrand 1 & 2', '1', '1', 'GROUND FLOOR', 'pk-LG12-201A', 'CTRL-LG12-201A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:01:30', '2026-04-21 07:01:30', 'TDX-201A', NULL),
(319, 'LeGrand 1 & 2', '1', '1', 'GROUND FLOOR', 'pk-LG12-TIR201', 'CTRL-LG12-TIR201', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:01:30', '2026-04-21 07:01:30', 'TIR-201A', NULL),
(320, 'LeGrand 1 & 2', '1', '1', 'GROUND FLOOR', 'pk-LG12-TIR207', 'CTRL-LG12-TIR207', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:01:30', '2026-04-21 07:01:30', 'TIR-207A', NULL),
(321, 'LeGrand 1 & 2', '1', '1', 'GROUND FLOOR', 'pk-LG12-204A', 'CTRL-LG12-204A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:01:30', '2026-04-21 07:01:30', 'TDX-204A', NULL),
(322, 'LeGrand 1 & 2', '1', '1', 'GROUND FLOOR', 'pk-LG12-203A', 'CTRL-LG12-203A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:01:30', '2026-04-21 07:01:30', 'TDX-203A', NULL),
(323, 'LeGrand 1 & 2', '1', '1', 'GROUND FLOOR', 'pk-LG12-216A', 'CTRL-LG12-216A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:01:30', '2026-04-21 07:01:30', 'TDX-216A', NULL),
(324, 'LeGrand 1 & 2', '1', '1', 'GROUND FLOOR', 'pk-LG12-215A', 'CTRL-LG12-215A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:01:30', '2026-04-21 07:01:30', 'TDX-215A', NULL),
(325, 'LeGrand 1 & 2', '1', '1', 'SECOND FLOOR', 'pk-LG12-SF-213A', 'CTRL-LG12-SF-213A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:02:50', '2026-04-21 07:02:50', 'TDX-213A', NULL),
(326, 'LeGrand 1 & 2', '1', '1', 'SECOND FLOOR', 'pk-LG12-SF-212A', 'CTRL-LG12-SF-212A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:02:50', '2026-04-21 07:02:50', 'TDX-212A', NULL),
(327, 'LeGrand 1 & 2', '1', '1', 'SECOND FLOOR', 'pk-LG12-SF-209A', 'CTRL-LG12-SF-209A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:02:50', '2026-04-21 07:02:50', 'TIR-209A', NULL),
(328, 'LeGrand 1 & 2', '1', '1', 'SECOND FLOOR', 'pk-LG12-SF-208A', 'CTRL-LG12-SF-208A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:02:50', '2026-04-21 07:02:50', 'TIR-208A', NULL),
(329, 'LeGrand 1 & 2', '1', '1', 'SECOND FLOOR', 'pk-LG12-SF-208-TDX', 'CTRL-LG12-SF-208-TDX', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:02:50', '2026-04-21 07:02:50', 'TDX-208A', NULL),
(330, 'LeGrand 1 & 2', '1', '1', 'SECOND FLOOR', 'pk-LG12-SF-214A-TIR', 'CTRL-LG12-SF-214A-TIR', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:02:50', '2026-04-21 07:02:50', 'TIR-214A', NULL),
(331, 'LeGrand 1 & 2', '1', '1', 'SECOND FLOOR', 'pk-LG12-SF-211A', 'CTRL-LG12-SF-211A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:02:50', '2026-04-21 07:02:50', 'TDX-211A', NULL),
(332, 'LeGrand 1 & 2', '1', '1', 'SECOND FLOOR', 'pk-LG12-SF-210A', 'CTRL-LG12-SF-210A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:02:50', '2026-04-21 07:02:50', 'TDX-210A', NULL),
(333, 'LeGrand 1 & 2', '1', '1', 'SECOND FLOOR', 'pk-LG12-SF-218A', 'CTRL-LG12-SF-218A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:02:50', '2026-04-21 07:02:50', 'TDX-218A', NULL),
(334, 'LeGrand 1 & 2', '1', '1', 'SECOND FLOOR', 'pk-LG12-SF-217A', 'CTRL-LG12-SF-217A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:02:50', '2026-04-21 07:02:50', 'TDX-217A', NULL),
(335, 'OLV Buragwis', '1', '1', 'GROUND FLOOR', 'pk-OLV-001A', 'CTRL-OLV-001A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:04:12', '2026-04-21 07:04:12', 'TDX-001A', NULL),
(336, 'OLV Buragwis', '1', '1', 'GROUND FLOOR', 'pk-OLV-002A', 'CTRL-OLV-002A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:04:12', '2026-04-21 07:04:12', 'TDX-002A', NULL),
(337, 'OLV Buragwis', '1', '1', 'GROUND FLOOR', 'pk-OLV-003A', 'CTRL-OLV-003A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:04:12', '2026-04-21 07:04:12', 'TDX-003A', NULL),
(338, 'OLV Buragwis', '1', '1', 'GROUND FLOOR', 'pk-OLV-004A', 'CTRL-OLV-004A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:04:12', '2026-04-21 07:04:12', 'TDX-004A', NULL),
(339, 'OLV Buragwis', '1', '1', 'GROUND FLOOR', 'pk-OLV-214A', 'CTRL-OLV-214A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:04:12', '2026-04-21 07:04:12', 'TIR-214A', NULL),
(340, 'OLV Buragwis', '1', '1', 'GROUND FLOOR', 'pk-OLV-206A', 'CTRL-OLV-206A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:04:12', '2026-04-21 07:04:12', 'TDX-206A', NULL),
(341, 'OLV Buragwis', '1', '1', 'GROUND FLOOR', 'pk-OLV-205A', 'CTRL-OLV-205A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:04:12', '2026-04-21 07:04:12', 'TDX-205A', NULL),
(342, 'OLV Buragwis', '1', '1', 'GROUND FLOOR', 'pk-OLV-220A', 'CTRL-OLV-220A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:04:12', '2026-04-21 07:04:12', 'TDX-220A', NULL),
(343, 'OLV Buragwis', '1', '1', 'GROUND FLOOR', 'pk-OLV-219A', 'CTRL-OLV-219A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:04:12', '2026-04-21 07:04:12', 'TDX-219A', NULL),
(344, 'OLV Buragwis', '1', '1', 'GROUND FLOOR', 'pk-OLV-201A', 'CTRL-OLV-201A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:04:12', '2026-04-21 07:04:12', 'TDX-201A', NULL),
(345, 'OLV Buragwis', '1', '1', 'GROUND FLOOR', 'pk-OLV-TIR201', 'CTRL-OLV-TIR201', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:04:12', '2026-04-21 07:04:12', 'TIR-201A', NULL),
(346, 'OLV Buragwis', '1', '1', 'GROUND FLOOR', 'pk-OLV-TIR207', 'CTRL-OLV-TIR207', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:04:12', '2026-04-21 07:04:12', 'TIR-207A', NULL),
(347, 'OLV Buragwis', '1', '1', 'GROUND FLOOR', 'pk-OLV-204A', 'CTRL-OLV-204A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:04:12', '2026-04-21 07:04:12', 'TDX-204A', NULL),
(348, 'OLV Buragwis', '1', '1', 'GROUND FLOOR', 'pk-OLV-203A', 'CTRL-OLV-203A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:04:12', '2026-04-21 07:04:12', 'TDX-203A', NULL),
(349, 'OLV Buragwis', '1', '1', 'GROUND FLOOR', 'pk-OLV-216A', 'CTRL-OLV-216A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:04:12', '2026-04-21 07:04:12', 'TDX-216A', NULL),
(350, 'OLV Buragwis', '1', '1', 'GROUND FLOOR', 'pk-OLV-215A', 'CTRL-OLV-215A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:04:12', '2026-04-21 07:04:12', 'TDX-215A', NULL),
(351, 'OLV Buragwis', '1', '1', 'SECOND FLOOR', 'pk-OLV-SF-213A', 'CTRL-OLV-SF-213A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:05:57', '2026-04-21 07:05:57', 'TDX-213A', NULL),
(352, 'OLV Buragwis', '1', '1', 'SECOND FLOOR', 'pk-OLV-SF-212A', 'CTRL-OLV-SF-212A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:05:57', '2026-04-21 07:05:57', 'TDX-212A', NULL),
(353, 'OLV Buragwis', '1', '1', 'SECOND FLOOR', 'pk-OLV-SF-209A', 'CTRL-OLV-SF-209A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:05:57', '2026-04-21 07:05:57', 'TIR-209A', NULL),
(354, 'OLV Buragwis', '1', '1', 'SECOND FLOOR', 'pk-OLV-SF-208A', 'CTRL-OLV-SF-208A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:05:57', '2026-04-21 07:05:57', 'TIR-208A', NULL),
(355, 'OLV Buragwis', '1', '1', 'SECOND FLOOR', 'pk-OLV-SF-208-TDX', 'CTRL-OLV-SF-208-TDX', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:05:57', '2026-04-21 07:05:57', 'TDX-208A', NULL),
(356, 'OLV Buragwis', '1', '1', 'SECOND FLOOR', 'pk-OLV-SF-214A-TIR', 'CTRL-OLV-SF-214A-TIR', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:05:57', '2026-04-21 07:05:57', 'TIR-214A', NULL),
(357, 'OLV Buragwis', '1', '1', 'SECOND FLOOR', 'pk-OLV-SF-211A', 'CTRL-OLV-SF-211A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:05:57', '2026-04-21 07:05:57', 'TDX-211A', NULL),
(358, 'OLV Buragwis', '1', '1', 'SECOND FLOOR', 'pk-OLV-SF-210A', 'CTRL-OLV-SF-210A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:05:57', '2026-04-21 07:05:57', 'TDX-210A', NULL),
(359, 'OLV Buragwis', '1', '1', 'SECOND FLOOR', 'pk-OLV-SF-218A', 'CTRL-OLV-SF-218A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:05:57', '2026-04-21 07:05:57', 'TDX-218A', NULL),
(360, 'OLV Buragwis', '1', '1', 'SECOND FLOOR', 'pk-OLV-SF-217A', 'CTRL-OLV-SF-217A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:05:57', '2026-04-21 07:05:57', 'TDX-217A', NULL),
(361, 'Polangui', '1', '1', 'GROUND FLOOR', 'pk-POL-001A', 'CTRL-POL-001A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:11:53', '2026-04-21 07:11:53', 'TDX-001A', NULL),
(362, 'Polangui', '1', '1', 'GROUND FLOOR', 'pk-POL-002A', 'CTRL-POL-002A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:11:53', '2026-04-21 07:11:53', 'TDX-002A', NULL),
(363, 'Polangui', '1', '1', 'GROUND FLOOR', 'pk-POL-003A', 'CTRL-POL-003A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:11:53', '2026-04-21 07:11:53', 'TDX-003A', NULL),
(364, 'Polangui', '1', '1', 'GROUND FLOOR', 'pk-POL-004A', 'CTRL-POL-004A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:11:53', '2026-04-21 07:11:53', 'TDX-004A', NULL),
(365, 'Polangui', '1', '1', 'GROUND FLOOR', 'pk-POL-214A', 'CTRL-POL-214A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:11:53', '2026-04-21 07:11:53', 'TIR-214A', NULL),
(366, 'Polangui', '1', '1', 'GROUND FLOOR', 'pk-POL-206A', 'CTRL-POL-206A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:11:53', '2026-04-21 07:11:53', 'TDX-206A', NULL),
(367, 'Polangui', '1', '1', 'GROUND FLOOR', 'pk-POL-205A', 'CTRL-POL-205A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:11:53', '2026-04-21 07:11:53', 'TDX-205A', NULL),
(368, 'Polangui', '1', '1', 'GROUND FLOOR', 'pk-POL-220A', 'CTRL-POL-220A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:11:53', '2026-04-21 07:11:53', 'TDX-220A', NULL),
(369, 'Polangui', '1', '1', 'GROUND FLOOR', 'pk-POL-219A', 'CTRL-POL-219A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:11:53', '2026-04-21 07:11:53', 'TDX-219A', NULL),
(370, 'Polangui', '1', '1', 'GROUND FLOOR', 'pk-POL-201A', 'CTRL-POL-201A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:11:53', '2026-04-21 07:11:53', 'TDX-201A', NULL),
(371, 'Polangui', '1', '1', 'GROUND FLOOR', 'pk-POL-TIR201', 'CTRL-POL-TIR201', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:11:53', '2026-04-21 07:11:53', 'TIR-201A', NULL),
(372, 'Polangui', '1', '1', 'GROUND FLOOR', 'pk-POL-TIR207', 'CTRL-POL-TIR207', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:11:53', '2026-04-21 07:11:53', 'TIR-207A', NULL),
(373, 'Polangui', '1', '1', 'GROUND FLOOR', 'pk-POL-204A', 'CTRL-POL-204A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:11:53', '2026-04-21 07:11:53', 'TDX-204A', NULL),
(374, 'Polangui', '1', '1', 'GROUND FLOOR', 'pk-POL-203A', 'CTRL-POL-203A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:11:53', '2026-04-21 07:11:53', 'TDX-203A', NULL),
(375, 'Polangui', '1', '1', 'GROUND FLOOR', 'pk-POL-216A', 'CTRL-POL-216A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:11:53', '2026-04-21 07:11:53', 'TDX-216A', NULL),
(376, 'Polangui', '1', '1', 'GROUND FLOOR', 'pk-POL-215A', 'CTRL-POL-215A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:11:53', '2026-04-21 07:11:53', 'TDX-215A', NULL),
(377, 'Polangui', '1', '1', 'SECOND FLOOR', 'pk-POL-SF-213A', 'CTRL-POL-SF-213A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:13:51', '2026-04-21 07:13:51', 'TDX-213A', NULL),
(378, 'Polangui', '1', '1', 'SECOND FLOOR', 'pk-POL-SF-212A', 'CTRL-POL-SF-212A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:13:51', '2026-04-21 07:13:51', 'TDX-212A', NULL),
(379, 'Polangui', '1', '1', 'SECOND FLOOR', 'pk-POL-SF-209A', 'CTRL-POL-SF-209A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:13:51', '2026-04-21 07:13:51', 'TIR-209A', NULL),
(380, 'Polangui', '1', '1', 'SECOND FLOOR', 'pk-POL-SF-208A', 'CTRL-POL-SF-208A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:13:51', '2026-04-21 07:13:51', 'TIR-208A', NULL),
(381, 'Polangui', '1', '1', 'SECOND FLOOR', 'pk-POL-SF-208-TDX', 'CTRL-POL-SF-208-TDX', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:13:51', '2026-04-21 07:13:51', 'TDX-208A', NULL),
(382, 'Polangui', '1', '1', 'SECOND FLOOR', 'pk-POL-SF-214A-TIR', 'CTRL-POL-SF-214A-TIR', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:13:51', '2026-04-21 07:13:51', 'TIR-214A', NULL),
(383, 'Polangui', '1', '1', 'SECOND FLOOR', 'pk-POL-SF-211A', 'CTRL-POL-SF-211A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:13:51', '2026-04-21 07:13:51', 'TDX-211A', NULL),
(384, 'Polangui', '1', '1', 'SECOND FLOOR', 'pk-POL-SF-210A', 'CTRL-POL-SF-210A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:13:51', '2026-04-21 07:13:51', 'TDX-210A', NULL),
(385, 'Polangui', '1', '1', 'SECOND FLOOR', 'pk-POL-SF-218A', 'CTRL-POL-SF-218A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:13:51', '2026-04-21 07:13:51', 'TDX-218A', NULL),
(386, 'Polangui', '1', '1', 'SECOND FLOOR', 'pk-POL-SF-217A', 'CTRL-POL-SF-217A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:13:51', '2026-04-21 07:13:51', 'TDX-217A', NULL),
(387, 'Priya Meridian', '1', '1', 'GROUND FLOOR', 'pk-PM-001A', 'CTRL-PM-001A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:17:20', '2026-04-21 07:17:20', 'TDX-001A', NULL),
(388, 'Priya Meridian', '1', '1', 'GROUND FLOOR', 'pk-PM-002A', 'CTRL-PM-002A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:17:20', '2026-04-21 07:17:20', 'TDX-002A', NULL),
(389, 'Priya Meridian', '1', '1', 'GROUND FLOOR', 'pk-PM-003A', 'CTRL-PM-003A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:17:20', '2026-04-21 07:17:20', 'TDX-003A', NULL),
(390, 'Priya Meridian', '1', '1', 'GROUND FLOOR', 'pk-PM-004A', 'CTRL-PM-004A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:17:20', '2026-04-21 07:17:20', 'TDX-004A', NULL),
(391, 'Priya Meridian', '1', '1', 'GROUND FLOOR', 'pk-PM-214A', 'CTRL-PM-214A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:17:20', '2026-04-21 07:17:20', 'TIR-214A', NULL),
(392, 'Priya Meridian', '1', '1', 'GROUND FLOOR', 'pk-PM-206A', 'CTRL-PM-206A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:17:20', '2026-04-21 07:17:20', 'TDX-206A', NULL),
(393, 'Priya Meridian', '1', '1', 'GROUND FLOOR', 'pk-PM-205A', 'CTRL-PM-205A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:17:20', '2026-04-21 07:17:20', 'TDX-205A', NULL),
(394, 'Priya Meridian', '1', '1', 'GROUND FLOOR', 'pk-PM-220A', 'CTRL-PM-220A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:17:20', '2026-04-21 07:17:20', 'TDX-220A', NULL),
(395, 'Priya Meridian', '1', '1', 'GROUND FLOOR', 'pk-PM-219A', 'CTRL-PM-219A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:17:20', '2026-04-21 07:17:20', 'TDX-219A', NULL),
(396, 'Priya Meridian', '1', '1', 'GROUND FLOOR', 'pk-PM-201A', 'CTRL-PM-201A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:17:20', '2026-04-21 07:17:20', 'TDX-201A', NULL),
(397, 'Priya Meridian', '1', '1', 'GROUND FLOOR', 'pk-PM-TIR201', 'CTRL-PM-TIR201', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:17:20', '2026-04-21 07:17:20', 'TIR-201A', NULL),
(398, 'Priya Meridian', '1', '1', 'GROUND FLOOR', 'pk-PM-TIR207', 'CTRL-PM-TIR207', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:17:20', '2026-04-21 07:17:20', 'TIR-207A', NULL),
(399, 'Priya Meridian', '1', '1', 'GROUND FLOOR', 'pk-PM-204A', 'CTRL-PM-204A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:17:20', '2026-04-21 07:17:20', 'TDX-204A', NULL),
(400, 'Priya Meridian', '1', '1', 'GROUND FLOOR', 'pk-PM-203A', 'CTRL-PM-203A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:17:20', '2026-04-21 07:17:20', 'TDX-203A', NULL),
(401, 'Priya Meridian', '1', '1', 'GROUND FLOOR', 'pk-PM-216A', 'CTRL-PM-216A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:17:20', '2026-04-21 07:17:20', 'TDX-216A', NULL),
(402, 'Priya Meridian', '1', '1', 'GROUND FLOOR', 'pk-PM-215A', 'CTRL-PM-215A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:17:20', '2026-04-21 07:17:20', 'TDX-215A', NULL),
(403, 'Priya Meridian', '1', '1', 'SECOND FLOOR', 'pk-PM-SF-213A', 'CTRL-PM-SF-213A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:19:13', '2026-04-21 07:19:13', 'TDX-213A', NULL),
(404, 'Priya Meridian', '1', '1', 'SECOND FLOOR', 'pk-PM-SF-212A', 'CTRL-PM-SF-212A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:19:13', '2026-04-21 07:19:13', 'TDX-212A', NULL),
(405, 'Priya Meridian', '1', '1', 'SECOND FLOOR', 'pk-PM-SF-209A', 'CTRL-PM-SF-209A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:19:13', '2026-04-21 07:19:13', 'TIR-209A', NULL),
(406, 'Priya Meridian', '1', '1', 'SECOND FLOOR', 'pk-PM-SF-208A', 'CTRL-PM-SF-208A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:19:13', '2026-04-21 07:19:13', 'TIR-208A', NULL),
(407, 'Priya Meridian', '1', '1', 'SECOND FLOOR', 'pk-PM-SF-208-TDX', 'CTRL-PM-SF-208-TDX', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:19:13', '2026-04-21 07:19:13', 'TDX-208A', NULL),
(408, 'Priya Meridian', '1', '1', 'SECOND FLOOR', 'pk-PM-SF-214A-TIR', 'CTRL-PM-SF-214A-TIR', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:19:13', '2026-04-21 07:19:13', 'TIR-214A', NULL),
(409, 'Priya Meridian', '1', '1', 'SECOND FLOOR', 'pk-PM-SF-211A', 'CTRL-PM-SF-211A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:19:13', '2026-04-21 07:19:13', 'TDX-211A', NULL),
(410, 'Priya Meridian', '1', '1', 'SECOND FLOOR', 'pk-PM-SF-210A', 'CTRL-PM-SF-210A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:19:13', '2026-04-21 07:19:13', 'TDX-210A', NULL),
(411, 'Priya Meridian', '1', '1', 'SECOND FLOOR', 'pk-PM-SF-218A', 'CTRL-PM-SF-218A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:19:13', '2026-04-21 07:19:13', 'TDX-218A', NULL),
(412, 'Priya Meridian', '1', '1', 'SECOND FLOOR', 'pk-PM-SF-217A', 'CTRL-PM-SF-217A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:19:13', '2026-04-21 07:19:13', 'TDX-217A', NULL),
(413, 'Rancho Imperial', '1', '1', 'GROUND FLOOR', 'pk-RI-001A', 'CTRL-RI-001A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:22:22', '2026-04-21 07:22:22', 'TDX-001A', NULL),
(414, 'Rancho Imperial', '1', '1', 'GROUND FLOOR', 'pk-RI-002A', 'CTRL-RI-002A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:22:22', '2026-04-21 07:22:22', 'TDX-002A', NULL),
(415, 'Rancho Imperial', '1', '1', 'GROUND FLOOR', 'pk-RI-003A', 'CTRL-RI-003A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:22:22', '2026-04-21 07:22:22', 'TDX-003A', NULL),
(416, 'Rancho Imperial', '1', '1', 'GROUND FLOOR', 'pk-RI-004A', 'CTRL-RI-004A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:22:22', '2026-04-21 07:22:22', 'TDX-004A', NULL),
(417, 'Rancho Imperial', '1', '1', 'GROUND FLOOR', 'pk-RI-214A', 'CTRL-RI-214A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:22:22', '2026-04-21 07:22:22', 'TIR-214A', NULL),
(418, 'Rancho Imperial', '1', '1', 'GROUND FLOOR', 'pk-RI-206A', 'CTRL-RI-206A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:22:22', '2026-04-21 07:22:22', 'TDX-206A', NULL),
(419, 'Rancho Imperial', '1', '1', 'GROUND FLOOR', 'pk-RI-205A', 'CTRL-RI-205A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:22:22', '2026-04-21 07:22:22', 'TDX-205A', NULL),
(420, 'Rancho Imperial', '1', '1', 'GROUND FLOOR', 'pk-RI-220A', 'CTRL-RI-220A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:22:22', '2026-04-21 07:22:22', 'TDX-220A', NULL),
(421, 'Rancho Imperial', '1', '1', 'GROUND FLOOR', 'pk-RI-219A', 'CTRL-RI-219A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:22:22', '2026-04-21 07:22:22', 'TDX-219A', NULL),
(422, 'Rancho Imperial', '1', '1', 'GROUND FLOOR', 'pk-RI-201A', 'CTRL-RI-201A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:22:22', '2026-04-21 07:22:22', 'TDX-201A', NULL),
(423, 'Rancho Imperial', '1', '1', 'GROUND FLOOR', 'pk-RI-TIR201', 'CTRL-RI-TIR201', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:22:22', '2026-04-21 07:22:22', 'TIR-201A', NULL),
(424, 'Rancho Imperial', '1', '1', 'GROUND FLOOR', 'pk-RI-TIR207', 'CTRL-RI-TIR207', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:22:22', '2026-04-21 07:22:22', 'TIR-207A', NULL),
(425, 'Rancho Imperial', '1', '1', 'GROUND FLOOR', 'pk-RI-204A', 'CTRL-RI-204A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:22:22', '2026-04-21 07:22:22', 'TDX-204A', NULL),
(426, 'Rancho Imperial', '1', '1', 'GROUND FLOOR', 'pk-RI-203A', 'CTRL-RI-203A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:22:22', '2026-04-21 07:22:22', 'TDX-203A', NULL),
(427, 'Rancho Imperial', '1', '1', 'GROUND FLOOR', 'pk-RI-216A', 'CTRL-RI-216A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:22:22', '2026-04-21 07:22:22', 'TDX-216A', NULL),
(428, 'Rancho Imperial', '1', '1', 'GROUND FLOOR', 'pk-RI-215A', 'CTRL-RI-215A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:22:22', '2026-04-21 07:22:22', 'TDX-215A', NULL),
(429, 'Rancho Imperial', '1', '1', 'SECOND FLOOR', 'pk-RI-SF-213A', 'CTRL-RI-SF-213A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:23:52', '2026-04-21 07:23:52', 'TDX-213A', NULL),
(430, 'Rancho Imperial', '1', '1', 'SECOND FLOOR', 'pk-RI-SF-212A', 'CTRL-RI-SF-212A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:23:52', '2026-04-21 07:23:52', 'TDX-212A', NULL),
(431, 'Rancho Imperial', '1', '1', 'SECOND FLOOR', 'pk-RI-SF-209A', 'CTRL-RI-SF-209A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:23:52', '2026-04-21 07:23:52', 'TIR-209A', NULL),
(432, 'Rancho Imperial', '1', '1', 'SECOND FLOOR', 'pk-RI-SF-208A', 'CTRL-RI-SF-208A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:23:52', '2026-04-21 07:23:52', 'TIR-208A', NULL),
(433, 'Rancho Imperial', '1', '1', 'SECOND FLOOR', 'pk-RI-SF-208-TDX', 'CTRL-RI-SF-208-TDX', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:23:52', '2026-04-21 07:23:52', 'TDX-208A', NULL),
(434, 'Rancho Imperial', '1', '1', 'SECOND FLOOR', 'pk-RI-SF-214A-TIR', 'CTRL-RI-SF-214A-TIR', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:23:52', '2026-04-21 07:23:52', 'TIR-214A', NULL),
(435, 'Rancho Imperial', '1', '1', 'SECOND FLOOR', 'pk-RI-SF-211A', 'CTRL-RI-SF-211A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:23:52', '2026-04-21 07:23:52', 'TDX-211A', NULL),
(436, 'Rancho Imperial', '1', '1', 'SECOND FLOOR', 'pk-RI-SF-210A', 'CTRL-RI-SF-210A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:23:52', '2026-04-21 07:23:52', 'TDX-210A', NULL),
(437, 'Rancho Imperial', '1', '1', 'SECOND FLOOR', 'pk-RI-SF-218A', 'CTRL-RI-SF-218A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:23:52', '2026-04-21 07:23:52', 'TDX-218A', NULL),
(438, 'Rancho Imperial', '1', '1', 'SECOND FLOOR', 'pk-RI-SF-217A', 'CTRL-RI-SF-217A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:23:52', '2026-04-21 07:23:52', 'TDX-217A', NULL),
(439, 'San Fernando', '1', '1', 'GROUND FLOOR', 'pk-SFN-001A', 'CTRL-SFN-001A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:26:14', '2026-04-21 07:26:14', 'TDX-001A', NULL),
(440, 'San Fernando', '1', '1', 'GROUND FLOOR', 'pk-SFN-002A', 'CTRL-SFN-002A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:26:14', '2026-04-21 07:26:14', 'TDX-002A', NULL),
(441, 'San Fernando', '1', '1', 'GROUND FLOOR', 'pk-SFN-003A', 'CTRL-SFN-003A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:26:14', '2026-04-21 07:26:14', 'TDX-003A', NULL),
(442, 'San Fernando', '1', '1', 'GROUND FLOOR', 'pk-SFN-004A', 'CTRL-SFN-004A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:26:14', '2026-04-21 07:26:14', 'TDX-004A', NULL),
(443, 'San Fernando', '1', '1', 'GROUND FLOOR', 'pk-SFN-214A', 'CTRL-SFN-214A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:26:14', '2026-04-21 07:26:14', 'TIR-214A', NULL),
(444, 'San Fernando', '1', '1', 'GROUND FLOOR', 'pk-SFN-206A', 'CTRL-SFN-206A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:26:14', '2026-04-21 07:26:14', 'TDX-206A', NULL),
(445, 'San Fernando', '1', '1', 'GROUND FLOOR', 'pk-SFN-205A', 'CTRL-SFN-205A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:26:14', '2026-04-21 07:26:14', 'TDX-205A', NULL),
(446, 'San Fernando', '1', '1', 'GROUND FLOOR', 'pk-SFN-220A', 'CTRL-SFN-220A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:26:14', '2026-04-21 07:26:14', 'TDX-220A', NULL),
(447, 'San Fernando', '1', '1', 'GROUND FLOOR', 'pk-SFN-219A', 'CTRL-SFN-219A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:26:14', '2026-04-21 07:26:14', 'TDX-219A', NULL),
(448, 'San Fernando', '1', '1', 'GROUND FLOOR', 'pk-SFN-201A', 'CTRL-SFN-201A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:26:14', '2026-04-21 07:26:14', 'TDX-201A', NULL),
(449, 'San Fernando', '1', '1', 'GROUND FLOOR', 'pk-SFN-TIR201', 'CTRL-SFN-TIR201', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:26:14', '2026-04-21 07:26:14', 'TIR-201A', NULL),
(450, 'San Fernando', '1', '1', 'GROUND FLOOR', 'pk-SFN-TIR207', 'CTRL-SFN-TIR207', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:26:14', '2026-04-21 07:26:14', 'TIR-207A', NULL),
(451, 'San Fernando', '1', '1', 'GROUND FLOOR', 'pk-SFN-204A', 'CTRL-SFN-204A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:26:14', '2026-04-21 07:26:14', 'TDX-204A', NULL),
(452, 'San Fernando', '1', '1', 'GROUND FLOOR', 'pk-SFN-203A', 'CTRL-SFN-203A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:26:14', '2026-04-21 07:26:14', 'TDX-203A', NULL),
(453, 'San Fernando', '1', '1', 'GROUND FLOOR', 'pk-SFN-216A', 'CTRL-SFN-216A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:26:14', '2026-04-21 07:26:14', 'TDX-216A', NULL),
(454, 'San Fernando', '1', '1', 'GROUND FLOOR', 'pk-SFN-215A', 'CTRL-SFN-215A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:26:14', '2026-04-21 07:26:14', 'TDX-215A', NULL),
(455, 'San Fernando', '1', '1', 'SECOND FLOOR', 'pk-SFN-SF-213A', 'CTRL-SFN-SF-213A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:28:36', '2026-04-21 07:28:36', 'TDX-213A', NULL),
(456, 'San Fernando', '1', '1', 'SECOND FLOOR', 'pk-SFN-SF-212A', 'CTRL-SFN-SF-212A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:28:36', '2026-04-21 07:28:36', 'TDX-212A', NULL),
(457, 'San Fernando', '1', '1', 'SECOND FLOOR', 'pk-SFN-SF-209A', 'CTRL-SFN-SF-209A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:28:36', '2026-04-21 07:28:36', 'TIR-209A', NULL),
(458, 'San Fernando', '1', '1', 'SECOND FLOOR', 'pk-SFN-SF-208A', 'CTRL-SFN-SF-208A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:28:36', '2026-04-21 07:28:36', 'TIR-208A', NULL),
(459, 'San Fernando', '1', '1', 'SECOND FLOOR', 'pk-SFN-SF-208-TDX', 'CTRL-SFN-SF-208-TDX', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:28:36', '2026-04-21 07:28:36', 'TDX-208A', NULL),
(460, 'San Fernando', '1', '1', 'SECOND FLOOR', 'pk-SFN-SF-214A-TIR', 'CTRL-SFN-SF-214A-TIR', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:28:36', '2026-04-21 07:28:36', 'TIR-214A', NULL),
(461, 'San Fernando', '1', '1', 'SECOND FLOOR', 'pk-SFN-SF-211A', 'CTRL-SFN-SF-211A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:28:36', '2026-04-21 07:28:36', 'TDX-211A', NULL),
(462, 'San Fernando', '1', '1', 'SECOND FLOOR', 'pk-SFN-SF-210A', 'CTRL-SFN-SF-210A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:28:36', '2026-04-21 07:28:36', 'TDX-210A', NULL),
(463, 'San Fernando', '1', '1', 'SECOND FLOOR', 'pk-SFN-SF-218A', 'CTRL-SFN-SF-218A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:28:36', '2026-04-21 07:28:36', 'TDX-218A', NULL),
(464, 'San Fernando', '1', '1', 'SECOND FLOOR', 'pk-SFN-SF-217A', 'CTRL-SFN-SF-217A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:28:36', '2026-04-21 07:28:36', 'TDX-217A', NULL),
(465, 'Sorsogon', '1', '1', 'GROUND FLOOR', 'pk-SOR-001A', 'CTRL-SOR-001A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:33:08', '2026-04-21 07:33:08', 'TDX-001A', NULL),
(466, 'Sorsogon', '1', '1', 'GROUND FLOOR', 'pk-SOR-002A', 'CTRL-SOR-002A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:33:08', '2026-04-21 07:33:08', 'TDX-002A', NULL),
(467, 'Sorsogon', '1', '1', 'GROUND FLOOR', 'pk-SOR-003A', 'CTRL-SOR-003A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:33:08', '2026-04-21 07:33:08', 'TDX-003A', NULL),
(468, 'Sorsogon', '1', '1', 'GROUND FLOOR', 'pk-SOR-004A', 'CTRL-SOR-004A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:33:08', '2026-04-21 07:33:08', 'TDX-004A', NULL),
(469, 'Sorsogon', '1', '1', 'GROUND FLOOR', 'pk-SOR-214A', 'CTRL-SOR-214A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:33:08', '2026-04-21 07:33:08', 'TIR-214A', NULL),
(470, 'Sorsogon', '1', '1', 'GROUND FLOOR', 'pk-SOR-206A', 'CTRL-SOR-206A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:33:08', '2026-04-21 07:33:08', 'TDX-206A', NULL),
(471, 'Sorsogon', '1', '1', 'GROUND FLOOR', 'pk-SOR-205A', 'CTRL-SOR-205A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:33:08', '2026-04-21 07:33:08', 'TDX-205A', NULL),
(472, 'Sorsogon', '1', '1', 'GROUND FLOOR', 'pk-SOR-220A', 'CTRL-SOR-220A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:33:08', '2026-04-21 07:33:08', 'TDX-220A', NULL),
(473, 'Sorsogon', '1', '1', 'GROUND FLOOR', 'pk-SOR-219A', 'CTRL-SOR-219A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:33:08', '2026-04-21 07:33:08', 'TDX-219A', NULL),
(474, 'Sorsogon', '1', '1', 'GROUND FLOOR', 'pk-SOR-201A', 'CTRL-SOR-201A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:33:08', '2026-04-21 07:33:08', 'TDX-201A', NULL),
(475, 'Sorsogon', '1', '1', 'GROUND FLOOR', 'pk-SOR-TIR201', 'CTRL-SOR-TIR201', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:33:08', '2026-04-21 07:33:08', 'TIR-201A', NULL),
(476, 'Sorsogon', '1', '1', 'GROUND FLOOR', 'pk-SOR-TIR207', 'CTRL-SOR-TIR207', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:33:08', '2026-04-21 07:33:08', 'TIR-207A', NULL),
(477, 'Sorsogon', '1', '1', 'GROUND FLOOR', 'pk-SOR-204A', 'CTRL-SOR-204A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:33:08', '2026-04-21 07:33:08', 'TDX-204A', NULL),
(478, 'Sorsogon', '1', '1', 'GROUND FLOOR', 'pk-SOR-203A', 'CTRL-SOR-203A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:33:08', '2026-04-21 07:33:08', 'TDX-203A', NULL),
(479, 'Sorsogon', '1', '1', 'GROUND FLOOR', 'pk-SOR-216A', 'CTRL-SOR-216A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:33:08', '2026-04-21 07:33:08', 'TDX-216A', NULL),
(480, 'Sorsogon', '1', '1', 'GROUND FLOOR', 'pk-SOR-215A', 'CTRL-SOR-215A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:33:08', '2026-04-21 07:33:08', 'TDX-215A', NULL),
(481, 'Sorsogon', '1', '1', 'SECOND FLOOR', 'pk-SOR-SF-213A', 'CTRL-SOR-SF-213A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:35:43', '2026-04-21 07:35:43', 'TDX-213A', NULL),
(482, 'Sorsogon', '1', '1', 'SECOND FLOOR', 'pk-SOR-SF-212A', 'CTRL-SOR-SF-212A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:35:43', '2026-04-21 07:35:43', 'TDX-212A', NULL),
(483, 'Sorsogon', '1', '1', 'SECOND FLOOR', 'pk-SOR-SF-209A', 'CTRL-SOR-SF-209A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:35:43', '2026-04-21 07:35:43', 'TIR-209A', NULL),
(484, 'Sorsogon', '1', '1', 'SECOND FLOOR', 'pk-SOR-SF-208A', 'CTRL-SOR-SF-208A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:35:43', '2026-04-21 07:35:43', 'TIR-208A', NULL),
(485, 'Sorsogon', '1', '1', 'SECOND FLOOR', 'pk-SOR-SF-208-TDX', 'CTRL-SOR-SF-208-TDX', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:35:43', '2026-04-21 07:35:43', 'TDX-208A', NULL),
(486, 'Sorsogon', '1', '1', 'SECOND FLOOR', 'pk-SOR-SF-214A-TIR', 'CTRL-SOR-SF-214A-TIR', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:35:43', '2026-04-21 07:35:43', 'TIR-214A', NULL),
(487, 'Sorsogon', '1', '1', 'SECOND FLOOR', 'pk-SOR-SF-211A', 'CTRL-SOR-SF-211A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:35:43', '2026-04-21 07:35:43', 'TDX-211A', NULL),
(488, 'Sorsogon', '1', '1', 'SECOND FLOOR', 'pk-SOR-SF-210A', 'CTRL-SOR-SF-210A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:35:43', '2026-04-21 07:35:43', 'TDX-210A', NULL),
(489, 'Sorsogon', '1', '1', 'SECOND FLOOR', 'pk-SOR-SF-218A', 'CTRL-SOR-SF-218A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:35:43', '2026-04-21 07:35:43', 'TDX-218A', NULL),
(490, 'Sorsogon', '1', '1', 'SECOND FLOOR', 'pk-SOR-SF-217A', 'CTRL-SOR-SF-217A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:35:43', '2026-04-21 07:35:43', 'TDX-217A', NULL),
(491, 'Tagaytay Meridien', '1', '1', 'GROUND FLOOR', 'pk-TM-001A', 'CTRL-TM-001A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:39:54', '2026-04-21 07:39:54', 'TDX-001A', NULL),
(492, 'Tagaytay Meridien', '1', '1', 'GROUND FLOOR', 'pk-TM-002A', 'CTRL-TM-002A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:39:54', '2026-04-21 07:39:54', 'TDX-002A', NULL),
(493, 'Tagaytay Meridien', '1', '1', 'GROUND FLOOR', 'pk-TM-003A', 'CTRL-TM-003A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:39:54', '2026-04-21 07:39:54', 'TDX-003A', NULL),
(494, 'Tagaytay Meridien', '1', '1', 'GROUND FLOOR', 'pk-TM-004A', 'CTRL-TM-004A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:39:54', '2026-04-21 07:39:54', 'TDX-004A', NULL),
(495, 'Tagaytay Meridien', '1', '1', 'GROUND FLOOR', 'pk-TM-214A', 'CTRL-TM-214A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:39:54', '2026-04-21 07:39:54', 'TIR-214A', NULL),
(496, 'Tagaytay Meridien', '1', '1', 'GROUND FLOOR', 'pk-TM-206A', 'CTRL-TM-206A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:39:54', '2026-04-21 07:39:54', 'TDX-206A', NULL),
(497, 'Tagaytay Meridien', '1', '1', 'GROUND FLOOR', 'pk-TM-205A', 'CTRL-TM-205A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:39:54', '2026-04-21 07:39:54', 'TDX-205A', NULL),
(498, 'Tagaytay Meridien', '1', '1', 'GROUND FLOOR', 'pk-TM-220A', 'CTRL-TM-220A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:39:54', '2026-04-21 07:39:54', 'TDX-220A', NULL),
(499, 'Tagaytay Meridien', '1', '1', 'GROUND FLOOR', 'pk-TM-219A', 'CTRL-TM-219A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:39:54', '2026-04-21 07:39:54', 'TDX-219A', NULL),
(500, 'Tagaytay Meridien', '1', '1', 'GROUND FLOOR', 'pk-TM-201A', 'CTRL-TM-201A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:39:54', '2026-04-21 07:39:54', 'TDX-201A', NULL),
(501, 'Tagaytay Meridien', '1', '1', 'GROUND FLOOR', 'pk-TM-TIR201', 'CTRL-TM-TIR201', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:39:54', '2026-04-21 07:39:54', 'TIR-201A', NULL),
(502, 'Tagaytay Meridien', '1', '1', 'GROUND FLOOR', 'pk-TM-TIR207', 'CTRL-TM-TIR207', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:39:54', '2026-04-21 07:39:54', 'TIR-207A', NULL),
(503, 'Tagaytay Meridien', '1', '1', 'GROUND FLOOR', 'pk-TM-204A', 'CTRL-TM-204A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:39:54', '2026-04-21 07:39:54', 'TDX-204A', NULL),
(504, 'Tagaytay Meridien', '1', '1', 'GROUND FLOOR', 'pk-TM-203A', 'CTRL-TM-203A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:39:54', '2026-04-21 07:39:54', 'TDX-203A', NULL),
(505, 'Tagaytay Meridien', '1', '1', 'GROUND FLOOR', 'pk-TM-216A', 'CTRL-TM-216A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:39:54', '2026-04-21 07:39:54', 'TDX-216A', NULL),
(506, 'Tagaytay Meridien', '1', '1', 'GROUND FLOOR', 'pk-TM-215A', 'CTRL-TM-215A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:39:54', '2026-04-21 07:39:54', 'TDX-215A', NULL),
(507, 'Tagaytay Meridien', '1', '1', 'SECOND FLOOR', 'pk-TM-SF-213A', 'CTRL-TM-SF-213A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:42:28', '2026-04-21 07:42:28', 'TDX-213A', NULL),
(508, 'Tagaytay Meridien', '1', '1', 'SECOND FLOOR', 'pk-TM-SF-212A', 'CTRL-TM-SF-212A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:42:28', '2026-04-21 07:42:28', 'TDX-212A', NULL),
(509, 'Tagaytay Meridien', '1', '1', 'SECOND FLOOR', 'pk-TM-SF-209A', 'CTRL-TM-SF-209A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:42:28', '2026-04-21 07:42:28', 'TIR-209A', NULL),
(510, 'Tagaytay Meridien', '1', '1', 'SECOND FLOOR', 'pk-TM-SF-208A', 'CTRL-TM-SF-208A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:42:28', '2026-04-21 07:42:28', 'TIR-208A', NULL),
(511, 'Tagaytay Meridien', '1', '1', 'SECOND FLOOR', 'pk-TM-SF-208-TDX', 'CTRL-TM-SF-208-TDX', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:42:28', '2026-04-21 07:42:28', 'TDX-208A', NULL),
(512, 'Tagaytay Meridien', '1', '1', 'SECOND FLOOR', 'pk-TM-SF-214A-TIR', 'CTRL-TM-SF-214A-TIR', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:42:28', '2026-04-21 07:42:28', 'TIR-214A', NULL),
(513, 'Tagaytay Meridien', '1', '1', 'SECOND FLOOR', 'pk-TM-SF-211A', 'CTRL-TM-SF-211A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:42:28', '2026-04-21 07:42:28', 'TDX-211A', NULL),
(514, 'Tagaytay Meridien', '1', '1', 'SECOND FLOOR', 'pk-TM-SF-210A', 'CTRL-TM-SF-210A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:42:28', '2026-04-21 07:42:28', 'TDX-210A', NULL),
(515, 'Tagaytay Meridien', '1', '1', 'SECOND FLOOR', 'pk-TM-SF-218A', 'CTRL-TM-SF-218A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:42:28', '2026-04-21 07:42:28', 'TDX-218A', NULL),
(516, 'Tagaytay Meridien', '1', '1', 'SECOND FLOOR', 'pk-TM-SF-217A', 'CTRL-TM-SF-217A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:42:28', '2026-04-21 07:42:28', 'TDX-217A', NULL),
(517, 'The Venetto Heights', '1', '1', 'GROUND FLOOR', 'pk-TVH-001A', 'CTRL-TVH-001A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:47:46', '2026-04-21 07:47:46', 'TDX-001A', NULL),
(518, 'The Venetto Heights', '1', '1', 'GROUND FLOOR', 'pk-TVH-002A', 'CTRL-TVH-002A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:47:46', '2026-04-21 07:47:46', 'TDX-002A', NULL),
(519, 'The Venetto Heights', '1', '1', 'GROUND FLOOR', 'pk-TVH-003A', 'CTRL-TVH-003A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:47:46', '2026-04-21 07:47:46', 'TDX-003A', NULL),
(520, 'The Venetto Heights', '1', '1', 'GROUND FLOOR', 'pk-TVH-004A', 'CTRL-TVH-004A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:47:46', '2026-04-21 07:47:46', 'TDX-004A', NULL),
(521, 'The Venetto Heights', '1', '1', 'GROUND FLOOR', 'pk-TVH-214A', 'CTRL-TVH-214A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:47:46', '2026-04-21 07:47:46', 'TIR-214A', NULL),
(522, 'The Venetto Heights', '1', '1', 'GROUND FLOOR', 'pk-TVH-206A', 'CTRL-TVH-206A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:47:46', '2026-04-21 07:47:46', 'TDX-206A', NULL),
(523, 'The Venetto Heights', '1', '1', 'GROUND FLOOR', 'pk-TVH-205A', 'CTRL-TVH-205A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:47:46', '2026-04-21 07:47:46', 'TDX-205A', NULL),
(524, 'The Venetto Heights', '1', '1', 'GROUND FLOOR', 'pk-TVH-220A', 'CTRL-TVH-220A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:47:46', '2026-04-21 07:47:46', 'TDX-220A', NULL),
(525, 'The Venetto Heights', '1', '1', 'GROUND FLOOR', 'pk-TVH-219A', 'CTRL-TVH-219A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:47:46', '2026-04-21 07:47:46', 'TDX-219A', NULL),
(526, 'The Venetto Heights', '1', '1', 'GROUND FLOOR', 'pk-TVH-201A', 'CTRL-TVH-201A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:47:46', '2026-04-21 07:47:46', 'TDX-201A', NULL),
(527, 'The Venetto Heights', '1', '1', 'GROUND FLOOR', 'pk-TVH-TIR201', 'CTRL-TVH-TIR201', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:47:46', '2026-04-21 07:47:46', 'TIR-201A', NULL),
(528, 'The Venetto Heights', '1', '1', 'GROUND FLOOR', 'pk-TVH-TIR207', 'CTRL-TVH-TIR207', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:47:46', '2026-04-21 07:47:46', 'TIR-207A', NULL),
(529, 'The Venetto Heights', '1', '1', 'GROUND FLOOR', 'pk-TVH-204A', 'CTRL-TVH-204A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:47:46', '2026-04-21 07:47:46', 'TDX-204A', NULL),
(530, 'The Venetto Heights', '1', '1', 'GROUND FLOOR', 'pk-TVH-203A', 'CTRL-TVH-203A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:47:46', '2026-04-21 07:47:46', 'TDX-203A', NULL),
(531, 'The Venetto Heights', '1', '1', 'GROUND FLOOR', 'pk-TVH-216A', 'CTRL-TVH-216A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:47:46', '2026-04-21 07:47:46', 'TDX-216A', NULL),
(532, 'The Venetto Heights', '1', '1', 'GROUND FLOOR', 'pk-TVH-215A', 'CTRL-TVH-215A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:47:46', '2026-04-21 07:47:46', 'TDX-215A', NULL),
(533, 'The Venetto Heights', '1', '1', 'SECOND FLOOR', 'pk-TVH-SF-213A', 'CTRL-TVH-SF-213A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:51:10', '2026-04-21 07:51:10', 'TDX-213A', NULL),
(534, 'The Venetto Heights', '1', '1', 'SECOND FLOOR', 'pk-TVH-SF-212A', 'CTRL-TVH-SF-212A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:51:10', '2026-04-21 07:51:10', 'TDX-212A', NULL),
(535, 'The Venetto Heights', '1', '1', 'SECOND FLOOR', 'pk-TVH-SF-209A', 'CTRL-TVH-SF-209A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:51:10', '2026-04-21 07:51:10', 'TIR-209A', NULL),
(536, 'The Venetto Heights', '1', '1', 'SECOND FLOOR', 'pk-TVH-SF-208A', 'CTRL-TVH-SF-208A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:51:10', '2026-04-21 07:51:10', 'TIR-208A', NULL),
(537, 'The Venetto Heights', '1', '1', 'SECOND FLOOR', 'pk-TVH-SF-208-TDX', 'CTRL-TVH-SF-208-TDX', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:51:10', '2026-04-21 07:51:10', 'TDX-208A', NULL),
(538, 'The Venetto Heights', '1', '1', 'SECOND FLOOR', 'pk-TVH-SF-214A-TIR', 'CTRL-TVH-SF-214A-TIR', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:51:10', '2026-04-21 07:51:10', 'TIR-214A', NULL),
(539, 'The Venetto Heights', '1', '1', 'SECOND FLOOR', 'pk-TVH-SF-211A', 'CTRL-TVH-SF-211A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:51:10', '2026-04-21 07:51:10', 'TDX-211A', NULL),
(540, 'The Venetto Heights', '1', '1', 'SECOND FLOOR', 'pk-TVH-SF-210A', 'CTRL-TVH-SF-210A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:51:10', '2026-04-21 07:51:10', 'TDX-210A', NULL),
(541, 'The Venetto Heights', '1', '1', 'SECOND FLOOR', 'pk-TVH-SF-218A', 'CTRL-TVH-SF-218A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:51:10', '2026-04-21 07:51:10', 'TDX-218A', NULL),
(542, 'The Venetto Heights', '1', '1', 'SECOND FLOOR', 'pk-TVH-SF-217A', 'CTRL-TVH-SF-217A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:51:10', '2026-04-21 07:51:10', 'TDX-217A', NULL),
(543, 'Trece Martires', '1', '1', 'GROUND FLOOR', 'pk-TMART-001A', 'CTRL-TMART-001A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:54:06', '2026-04-21 07:54:06', 'TDX-001A', NULL),
(544, 'Trece Martires', '1', '1', 'GROUND FLOOR', 'pk-TMART-002A', 'CTRL-TMART-002A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:54:06', '2026-04-21 07:54:06', 'TDX-002A', NULL),
(545, 'Trece Martires', '1', '1', 'GROUND FLOOR', 'pk-TMART-003A', 'CTRL-TMART-003A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:54:06', '2026-04-21 07:54:06', 'TDX-003A', NULL),
(546, 'Trece Martires', '1', '1', 'GROUND FLOOR', 'pk-TMART-004A', 'CTRL-TMART-004A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:54:06', '2026-04-21 07:54:06', 'TDX-004A', NULL),
(547, 'Trece Martires', '1', '1', 'GROUND FLOOR', 'pk-TMART-214A', 'CTRL-TMART-214A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:54:06', '2026-04-21 07:54:06', 'TIR-214A', NULL),
(548, 'Trece Martires', '1', '1', 'GROUND FLOOR', 'pk-TMART-206A', 'CTRL-TMART-206A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:54:06', '2026-04-21 07:54:06', 'TDX-206A', NULL),
(549, 'Trece Martires', '1', '1', 'GROUND FLOOR', 'pk-TMART-205A', 'CTRL-TMART-205A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:54:06', '2026-04-21 07:54:06', 'TDX-205A', NULL),
(550, 'Trece Martires', '1', '1', 'GROUND FLOOR', 'pk-TMART-220A', 'CTRL-TMART-220A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:54:06', '2026-04-21 07:54:06', 'TDX-220A', NULL),
(551, 'Trece Martires', '1', '1', 'GROUND FLOOR', 'pk-TMART-219A', 'CTRL-TMART-219A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:54:06', '2026-04-21 07:54:06', 'TDX-219A', NULL),
(552, 'Trece Martires', '1', '1', 'GROUND FLOOR', 'pk-TMART-201A', 'CTRL-TMART-201A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:54:06', '2026-04-21 07:54:06', 'TDX-201A', NULL),
(553, 'Trece Martires', '1', '1', 'GROUND FLOOR', 'pk-TMART-TIR201', 'CTRL-TMART-TIR201', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:54:06', '2026-04-21 07:54:06', 'TIR-201A', NULL),
(554, 'Trece Martires', '1', '1', 'GROUND FLOOR', 'pk-TMART-TIR207', 'CTRL-TMART-TIR207', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:54:06', '2026-04-21 07:54:06', 'TIR-207A', NULL),
(555, 'Trece Martires', '1', '1', 'GROUND FLOOR', 'pk-TMART-204A', 'CTRL-TMART-204A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:54:06', '2026-04-21 07:54:06', 'TDX-204A', NULL),
(556, 'Trece Martires', '1', '1', 'GROUND FLOOR', 'pk-TMART-203A', 'CTRL-TMART-203A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:54:06', '2026-04-21 07:54:06', 'TDX-203A', NULL),
(557, 'Trece Martires', '1', '1', 'GROUND FLOOR', 'pk-TMART-216A', 'CTRL-TMART-216A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:54:06', '2026-04-21 07:54:06', 'TDX-216A', NULL),
(558, 'Trece Martires', '1', '1', 'GROUND FLOOR', 'pk-TMART-215A', 'CTRL-TMART-215A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:54:06', '2026-04-21 07:54:06', 'TDX-215A', NULL),
(559, 'Trece Martires', '1', '1', 'SECOND FLOOR', 'pk-TMART-SF-213A', 'CTRL-TMART-SF-213A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:58:58', '2026-04-21 07:58:58', 'TDX-213A', NULL),
(560, 'Trece Martires', '1', '1', 'SECOND FLOOR', 'pk-TMART-SF-212A', 'CTRL-TMART-SF-212A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:58:58', '2026-04-21 07:58:58', 'TDX-212A', NULL),
(561, 'Trece Martires', '1', '1', 'SECOND FLOOR', 'pk-TMART-SF-209A', 'CTRL-TMART-SF-209A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:58:58', '2026-04-21 07:58:58', 'TIR-209A', NULL),
(562, 'Trece Martires', '1', '1', 'SECOND FLOOR', 'pk-TMART-SF-208A', 'CTRL-TMART-SF-208A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:58:58', '2026-04-21 07:58:58', 'TIR-208A', NULL),
(563, 'Trece Martires', '1', '1', 'SECOND FLOOR', 'pk-TMART-SF-208-TDX', 'CTRL-TMART-SF-208-TDX', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:58:58', '2026-04-21 07:58:58', 'TDX-208A', NULL),
(564, 'Trece Martires', '1', '1', 'SECOND FLOOR', 'pk-TMART-SF-214A-TIR', 'CTRL-TMART-SF-214A-TIR', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:58:58', '2026-04-21 07:58:58', 'TIR-214A', NULL),
(565, 'Trece Martires', '1', '1', 'SECOND FLOOR', 'pk-TMART-SF-211A', 'CTRL-TMART-SF-211A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:58:58', '2026-04-21 07:58:58', 'TDX-211A', NULL),
(566, 'Trece Martires', '1', '1', 'SECOND FLOOR', 'pk-TMART-SF-210A', 'CTRL-TMART-SF-210A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:58:58', '2026-04-21 07:58:58', 'TDX-210A', NULL),
(567, 'Trece Martires', '1', '1', 'SECOND FLOOR', 'pk-TMART-SF-218A', 'CTRL-TMART-SF-218A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:58:58', '2026-04-21 07:58:58', 'TDX-218A', NULL),
(568, 'Trece Martires', '1', '1', 'SECOND FLOOR', 'pk-TMART-SF-217A', 'CTRL-TMART-SF-217A', 1, 'done', NULL, NULL, NULL, '2026-04-21 07:58:58', '2026-04-21 07:58:58', 'TDX-217A', NULL),
(569, 'VHS PH 2', '1', '1', 'GROUND FLOOR', 'pk-VHS2-001A', 'CTRL-VHS2-001A', 1, 'done', NULL, NULL, NULL, '2026-04-21 08:02:27', '2026-04-21 08:02:27', 'TDX-001A', NULL),
(570, 'VHS PH 2', '1', '1', 'GROUND FLOOR', 'pk-VHS2-002A', 'CTRL-VHS2-002A', 1, 'done', NULL, NULL, NULL, '2026-04-21 08:02:27', '2026-04-21 08:02:27', 'TDX-002A', NULL),
(571, 'VHS PH 2', '1', '1', 'GROUND FLOOR', 'pk-VHS2-003A', 'CTRL-VHS2-003A', 1, 'done', NULL, NULL, NULL, '2026-04-21 08:02:27', '2026-04-21 08:02:27', 'TDX-003A', NULL),
(572, 'VHS PH 2', '1', '1', 'GROUND FLOOR', 'pk-VHS2-004A', 'CTRL-VHS2-004A', 1, 'done', NULL, NULL, NULL, '2026-04-21 08:02:27', '2026-04-21 08:02:27', 'TDX-004A', NULL),
(573, 'VHS PH 2', '1', '1', 'GROUND FLOOR', 'pk-VHS2-214A', 'CTRL-VHS2-214A', 1, 'done', NULL, NULL, NULL, '2026-04-21 08:02:27', '2026-04-21 08:02:27', 'TIR-214A', NULL),
(574, 'VHS PH 2', '1', '1', 'GROUND FLOOR', 'pk-VHS2-206A', 'CTRL-VHS2-206A', 1, 'done', NULL, NULL, NULL, '2026-04-21 08:02:27', '2026-04-21 08:02:27', 'TDX-206A', NULL),
(575, 'VHS PH 2', '1', '1', 'GROUND FLOOR', 'pk-VHS2-205A', 'CTRL-VHS2-205A', 1, 'done', NULL, NULL, NULL, '2026-04-21 08:02:27', '2026-04-21 08:02:27', 'TDX-205A', NULL),
(576, 'VHS PH 2', '1', '1', 'GROUND FLOOR', 'pk-VHS2-220A', 'CTRL-VHS2-220A', 1, 'done', NULL, NULL, NULL, '2026-04-21 08:02:27', '2026-04-21 08:02:27', 'TDX-220A', NULL),
(577, 'VHS PH 2', '1', '1', 'GROUND FLOOR', 'pk-VHS2-219A', 'CTRL-VHS2-219A', 1, 'done', NULL, NULL, NULL, '2026-04-21 08:02:27', '2026-04-21 08:02:27', 'TDX-219A', NULL),
(578, 'VHS PH 2', '1', '1', 'GROUND FLOOR', 'pk-VHS2-201A', 'CTRL-VHS2-201A', 1, 'done', NULL, NULL, NULL, '2026-04-21 08:02:27', '2026-04-21 08:02:27', 'TDX-201A', NULL),
(579, 'VHS PH 2', '1', '1', 'GROUND FLOOR', 'pk-VHS2-TIR201', 'CTRL-VHS2-TIR201', 1, 'done', NULL, NULL, NULL, '2026-04-21 08:02:27', '2026-04-21 08:02:27', 'TIR-201A', NULL),
(580, 'VHS PH 2', '1', '1', 'GROUND FLOOR', 'pk-VHS2-TIR207', 'CTRL-VHS2-TIR207', 1, 'done', NULL, NULL, NULL, '2026-04-21 08:02:27', '2026-04-21 08:02:27', 'TIR-207A', NULL),
(581, 'VHS PH 2', '1', '1', 'GROUND FLOOR', 'pk-VHS2-204A', 'CTRL-VHS2-204A', 1, 'done', NULL, NULL, NULL, '2026-04-21 08:02:27', '2026-04-21 08:02:27', 'TDX-204A', NULL),
(582, 'VHS PH 2', '1', '1', 'GROUND FLOOR', 'pk-VHS2-203A', 'CTRL-VHS2-203A', 1, 'done', NULL, NULL, NULL, '2026-04-21 08:02:27', '2026-04-21 08:02:27', 'TDX-203A', NULL),
(583, 'VHS PH 2', '1', '1', 'GROUND FLOOR', 'pk-VHS2-216A', 'CTRL-TVH-216A', 1, 'done', NULL, NULL, NULL, '2026-04-21 08:02:27', '2026-04-21 08:02:27', 'TDX-216A', NULL),
(584, 'VHS PH 2', '1', '1', 'GROUND FLOOR', 'pk-VHS2-215A', 'CTRL-VHS2-215A', 1, 'done', NULL, NULL, NULL, '2026-04-21 08:02:27', '2026-04-21 08:02:27', 'TDX-215A', NULL),
(585, 'VHS PH 2', '1', '1', 'SECOND FLOOR', 'pk-VHS2-SF-213A', 'CTRL-VHS2-SF-213A', 1, 'done', NULL, NULL, NULL, '2026-04-21 08:04:43', '2026-04-21 08:04:43', 'TDX-213A', NULL),
(586, 'VHS PH 2', '1', '1', 'SECOND FLOOR', 'pk-VHS2-SF-212A', 'CTRL-VHS2-SF-212A', 1, 'done', NULL, NULL, NULL, '2026-04-21 08:04:43', '2026-04-21 08:04:43', 'TDX-212A', NULL);
INSERT INTO `connovate_panels` (`id`, `project_name`, `block_no`, `lot_no`, `floor_name`, `panel_key`, `control_number`, `quantity`, `status`, `completed_by_id`, `completed_by`, `completed_at`, `created_at`, `updated_at`, `connovate_part`, `started_at`) VALUES
(587, 'VHS PH 2', '1', '1', 'SECOND FLOOR', 'pk-VHS2-SF-209A', 'CTRL-VHS2-SF-209A', 1, 'done', NULL, NULL, NULL, '2026-04-21 08:04:43', '2026-04-21 08:04:43', 'TIR-209A', NULL),
(588, 'VHS PH 2', '1', '1', 'SECOND FLOOR', 'pk-VHS2-SF-208A', 'CTRL-VHS2-SF-208A', 1, 'done', NULL, NULL, NULL, '2026-04-21 08:04:43', '2026-04-21 08:04:43', 'TIR-208A', NULL),
(589, 'VHS PH 2', '1', '1', 'SECOND FLOOR', 'pk-VHS2-SF-208-TDX', 'CTRL-VHS2-SF-208-TDX', 1, 'done', NULL, NULL, NULL, '2026-04-21 08:04:43', '2026-04-21 08:04:43', 'TDX-208A', NULL),
(590, 'VHS PH 2', '1', '1', 'SECOND FLOOR', 'pk-VHS2-SF-214A-TIR', 'CTRL-VHS2-SF-214A-TIR', 1, 'done', NULL, NULL, NULL, '2026-04-21 08:04:43', '2026-04-21 08:04:43', 'TIR-214A', NULL),
(591, 'VHS PH 2', '1', '1', 'SECOND FLOOR', 'pk-VHS2-SF-211A', 'CTRL-VHS2-SF-211A', 1, 'done', NULL, NULL, NULL, '2026-04-21 08:04:43', '2026-04-21 08:04:43', 'TDX-211A', NULL),
(592, 'VHS PH 2', '1', '1', 'SECOND FLOOR', 'pk-VHS2-SF-210A', 'CTRL-VHS2-SF-210A', 1, 'done', NULL, NULL, NULL, '2026-04-21 08:04:43', '2026-04-21 08:04:43', 'TDX-210A', NULL),
(593, 'VHS PH 2', '1', '1', 'SECOND FLOOR', 'pk-VHS2-SF-218A', 'CTRL-VHS2-SF-218A', 1, 'done', NULL, NULL, NULL, '2026-04-21 08:04:43', '2026-04-21 08:04:43', 'TDX-218A', NULL),
(594, 'VHS PH 2', '1', '1', 'SECOND FLOOR', 'pk-VHS2-SF-217A', 'CTRL-VHS2-SF-217A', 1, 'done', NULL, NULL, NULL, '2026-04-21 08:04:43', '2026-04-21 08:04:43', 'TDX-217A', NULL),
(595, 'VIA VERDE STO. TOMAS BATANGAS', '1', '1', 'GROUND FLOOR', 'pk-VVST-001A', 'CTRL-VVST-001A', 1, 'done', NULL, NULL, NULL, '2026-04-21 08:06:59', '2026-04-21 08:06:59', 'TDX-001A', NULL),
(596, 'VIA VERDE STO. TOMAS BATANGAS', '1', '1', 'GROUND FLOOR', 'pk-VVST-002A', 'CTRL-VVST-002A', 1, 'done', NULL, NULL, NULL, '2026-04-21 08:06:59', '2026-04-21 08:06:59', 'TDX-002A', NULL),
(597, 'VIA VERDE STO. TOMAS BATANGAS', '1', '1', 'GROUND FLOOR', 'pk-VVST-003A', 'CTRL-VVST-003A', 1, 'done', NULL, NULL, NULL, '2026-04-21 08:06:59', '2026-04-21 08:06:59', 'TDX-003A', NULL),
(598, 'VIA VERDE STO. TOMAS BATANGAS', '1', '1', 'GROUND FLOOR', 'pk-VVST-004A', 'CTRL-VVST-004A', 1, 'done', NULL, NULL, NULL, '2026-04-21 08:06:59', '2026-04-21 08:06:59', 'TDX-004A', NULL),
(599, 'VIA VERDE STO. TOMAS BATANGAS', '1', '1', 'GROUND FLOOR', 'pk-VVST-214A', 'CTRL-VVST-214A', 1, 'done', NULL, NULL, NULL, '2026-04-21 08:06:59', '2026-04-21 08:06:59', 'TIR-214A', NULL),
(600, 'VIA VERDE STO. TOMAS BATANGAS', '1', '1', 'GROUND FLOOR', 'pk-VVST-206A', 'CTRL-VVST-206A', 1, 'done', NULL, NULL, NULL, '2026-04-21 08:06:59', '2026-04-21 08:06:59', 'TDX-206A', NULL),
(601, 'VIA VERDE STO. TOMAS BATANGAS', '1', '1', 'GROUND FLOOR', 'pk-VVST-205A', 'CTRL-VVST-205A', 1, 'done', NULL, NULL, NULL, '2026-04-21 08:06:59', '2026-04-21 08:06:59', 'TDX-205A', NULL),
(602, 'VIA VERDE STO. TOMAS BATANGAS', '1', '1', 'GROUND FLOOR', 'pk-VVST-220A', 'CTRL-VVST-220A', 1, 'done', NULL, NULL, NULL, '2026-04-21 08:06:59', '2026-04-21 08:06:59', 'TDX-220A', NULL),
(603, 'VIA VERDE STO. TOMAS BATANGAS', '1', '1', 'GROUND FLOOR', 'pk-VVST-219A', 'CTRL-VVST-219A', 1, 'done', NULL, NULL, NULL, '2026-04-21 08:06:59', '2026-04-21 08:06:59', 'TDX-219A', NULL),
(604, 'VIA VERDE STO. TOMAS BATANGAS', '1', '1', 'GROUND FLOOR', 'pk-VVST-201A', 'CTRL-VVST-201A', 1, 'done', NULL, NULL, NULL, '2026-04-21 08:06:59', '2026-04-21 08:06:59', 'TDX-201A', NULL),
(605, 'VIA VERDE STO. TOMAS BATANGAS', '1', '1', 'GROUND FLOOR', 'pk-VVST-TIR201', 'CTRL-VVST-TIR201', 1, 'done', NULL, NULL, NULL, '2026-04-21 08:06:59', '2026-04-21 08:06:59', 'TIR-201A', NULL),
(606, 'VIA VERDE STO. TOMAS BATANGAS', '1', '1', 'GROUND FLOOR', 'pk-VVST-TIR207', 'CTRL-VVST-TIR207', 1, 'done', NULL, NULL, NULL, '2026-04-21 08:06:59', '2026-04-21 08:06:59', 'TIR-207A', NULL),
(607, 'VIA VERDE STO. TOMAS BATANGAS', '1', '1', 'GROUND FLOOR', 'pk-VVST-204A', 'CTRL-VVST-204A', 1, 'done', NULL, NULL, NULL, '2026-04-21 08:06:59', '2026-04-21 08:06:59', 'TDX-204A', NULL),
(608, 'VIA VERDE STO. TOMAS BATANGAS', '1', '1', 'GROUND FLOOR', 'pk-VVST-203A', 'CTRL-VVST-203A', 1, 'done', NULL, NULL, NULL, '2026-04-21 08:06:59', '2026-04-21 08:06:59', 'TDX-203A', NULL),
(609, 'VIA VERDE STO. TOMAS BATANGAS', '1', '1', 'GROUND FLOOR', 'pk-VVST-216A', 'CTRL-VVST-216A', 1, 'done', NULL, NULL, NULL, '2026-04-21 08:06:59', '2026-04-21 08:06:59', 'TDX-216A', NULL),
(610, 'VIA VERDE STO. TOMAS BATANGAS', '1', '1', 'GROUND FLOOR', 'pk-VVST-215A', 'CTRL-VVST-215A', 1, 'done', NULL, NULL, NULL, '2026-04-21 08:06:59', '2026-04-21 08:06:59', 'TDX-215A', NULL),
(611, 'VIA VERDE STO. TOMAS BATANGAS', '1', '1', 'SECOND FLOOR', 'pk-VVST-SF-213A', 'CTRL-VVST-SF-213A', 1, 'done', NULL, NULL, NULL, '2026-04-21 08:10:30', '2026-04-21 08:10:30', 'TDX-213A', NULL),
(612, 'VIA VERDE STO. TOMAS BATANGAS', '1', '1', 'SECOND FLOOR', 'pk-VVST-SF-212A', 'CTRL-VVST-SF-212A', 1, 'done', NULL, NULL, NULL, '2026-04-21 08:10:30', '2026-04-21 08:10:30', 'TDX-212A', NULL),
(613, 'VIA VERDE STO. TOMAS BATANGAS', '1', '1', 'SECOND FLOOR', 'pk-VVST-SF-209A', 'CTRL-VVST-SF-209A', 1, 'done', NULL, NULL, NULL, '2026-04-21 08:10:30', '2026-04-21 08:10:30', 'TIR-209A', NULL),
(614, 'VIA VERDE STO. TOMAS BATANGAS', '1', '1', 'SECOND FLOOR', 'pk-VVST-SF-208A', 'CTRL-VVST-SF-208A', 1, 'done', NULL, NULL, NULL, '2026-04-21 08:10:30', '2026-04-21 08:10:30', 'TIR-208A', NULL),
(615, 'VIA VERDE STO. TOMAS BATANGAS', '1', '1', 'SECOND FLOOR', 'pk-VVST-SF-208-TDX', 'CTRL-VVST-SF-208-TDX', 1, 'done', NULL, NULL, NULL, '2026-04-21 08:10:30', '2026-04-21 08:10:30', 'TDX-208A', NULL),
(616, 'VIA VERDE STO. TOMAS BATANGAS', '1', '1', 'SECOND FLOOR', 'pk-VVST-SF-214A-TIR', 'CTRL-VVST-SF-214A-TIR', 1, 'done', NULL, NULL, NULL, '2026-04-21 08:10:30', '2026-04-21 08:10:30', 'TIR-214A', NULL),
(617, 'VIA VERDE STO. TOMAS BATANGAS', '1', '1', 'SECOND FLOOR', 'pk-VVST-SF-211A', 'CTRL-VVST-SF-211A', 1, 'done', NULL, NULL, NULL, '2026-04-21 08:10:30', '2026-04-21 08:10:30', 'TDX-211A', NULL),
(618, 'VIA VERDE STO. TOMAS BATANGAS', '1', '1', 'SECOND FLOOR', 'pk-VVST-SF-210A', 'CTRL-VVST-SF-210A', 1, 'done', NULL, NULL, NULL, '2026-04-21 08:10:30', '2026-04-21 08:10:30', 'TDX-210A', NULL),
(619, 'VIA VERDE STO. TOMAS BATANGAS', '1', '1', 'SECOND FLOOR', 'pk-VVST-SF-218A', 'CTRL-VVST-SF-218A', 1, 'done', NULL, NULL, NULL, '2026-04-21 08:10:30', '2026-04-21 08:10:30', 'TDX-218A', NULL),
(620, 'VIA VERDE STO. TOMAS BATANGAS', '1', '1', 'SECOND FLOOR', 'pk-VVST-SF-217A', 'CTRL-VVST-SF-217A', 1, 'done', NULL, NULL, NULL, '2026-04-21 08:10:30', '2026-04-21 08:10:30', 'TDX-217A', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `residents`
--

CREATE TABLE `residents` (
  `resident_id` int(11) NOT NULL,
  `subdivision_id` int(11) DEFAULT NULL,
  `phase` varchar(50) DEFAULT NULL,
  `block_no` varchar(50) DEFAULT NULL,
  `lot_no` varchar(50) DEFAULT NULL,
  `tct_no` varchar(100) DEFAULT NULL,
  `buyer_name` varchar(255) DEFAULT NULL,
  `new_buyer_assumed` varchar(255) DEFAULT NULL,
  `buyer_representative` varchar(255) DEFAULT NULL,
  `contact_no` varchar(50) DEFAULT NULL,
  `social_media` varchar(255) DEFAULT NULL,
  `email_address` varchar(255) DEFAULT NULL,
  `account_number` varchar(100) DEFAULT NULL,
  `account_address` text DEFAULT NULL,
  `resident_status` enum('Active','Inactive','Moved Out') DEFAULT 'Active',
  `remarks` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `residents`
--

INSERT INTO `residents` (`resident_id`, `subdivision_id`, `phase`, `block_no`, `lot_no`, `tct_no`, `buyer_name`, `new_buyer_assumed`, `buyer_representative`, `contact_no`, `social_media`, `email_address`, `account_number`, `account_address`, `resident_status`, `remarks`, `created_at`) VALUES
(3, 1, 'phase 1', '18', '62', '', 'Andress Jose Bonifacio', '', '', '0917-123-4567', '', 'andressjose@example.com', 'ACC-IM-2026-001', '', 'Active', '', '2026-03-17 16:00:00'),
(15, 1, 'phase 1', '18', '61', '', 'Albert Poblacion', '', '', '0929-263-4567', '', 'AlbertPoblacion@example.com', 'ACC-IM-2026-005', '', 'Active', '', '2026-03-24 16:00:00'),
(18, 1, 'phase 1', '18', '63', '', 'Franz Matthew', '', '', '0917-148-4567', '', 'FranzMatt@example.com', 'ACC-IM-2026-003', '', 'Active', '', '2026-03-28 16:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `subdivisions`
--

CREATE TABLE `subdivisions` (
  `subdivision_id` int(11) NOT NULL,
  `project_name` varchar(100) NOT NULL,
  `map_path` varchar(255) DEFAULT NULL,
  `map_width` int(11) DEFAULT 2000,
  `map_height` int(11) DEFAULT 1500
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `subdivisions`
--

INSERT INTO `subdivisions` (`subdivision_id`, `project_name`, `map_path`, `map_width`, `map_height`) VALUES
(1, 'PADRE GARCIA', 'subdivision1.png', 2000, 1500),
(2, 'VIA VERDE STO. TOMAS BATANGAS', 'VVST3-SDP_page-0001.jpg', 2000, 1500),
(3, 'Imperial Meadows', 'ISM SITE MAP.jpg', 2000, 1500),
(4, 'Brgy. Tartaria', 'Silang Cavite.jpg', 2000, 1500),
(5, 'Rancho Imperial', 'Rancho imperial de Silang-Model with color.jpg', 2000, 1500),
(6, 'Tagaytay Meridien', 'Tagaytay Meridien map 1.jpg', 2000, 1500),
(7, 'The Venetto Heights', 'The-Venetto-Heights-Updated-2014-Model.jpg', 2000, 1500),
(8, 'Trece Martires', 'W-Trece Martires.jpg', 2000, 1500),
(10, 'Priya Meridian', 'Priya Meridian.jpg', 2000, 1500),
(11, 'Brgy. STO.Domingo', 'BrgySTO.Domingo,IrigaCity.jpg', 2000, 1500),
(12, 'Brgy. Estanza', 'BRGY. ESTANZA LEGAZPI CITY.jpg', 2000, 1500),
(13, 'Homapon Legazpi City', 'HOMAPON LEGAZPI CITY.jpg', 2000, 1500),
(14, 'VHS PH 2', 'VHS PH 2.JPG', 2000, 1500),
(15, 'Sorsogon', 'Sorsogon - with alteration_page-0001.jpg', 2000, 1500),
(16, 'Buragwis', 'Buragwis_page-0001.jpg', 2000, 1500),
(17, 'Estanza PH 1 & 2', 'Estanza ph 1 & 2_page-0001.jpg', 2000, 1500),
(18, 'Estanza Phase 1', 'Estanza Phase 1_page-0001.jpg', 2000, 1500),
(19, 'Iriga Phase 1', 'Iriga Phase 1_page-0001.jpg', 2000, 1500),
(20, 'Labo', 'Labo_page-0001.jpg', 2000, 1500),
(21, 'LeGrand 1 & 2', 'LeGrand 1 & 2_page-0001.jpg', 2000, 1500),
(22, 'OLV Buragwis', 'OLV Buragwis_page-0001.jpg', 2000, 1500),
(23, 'Polangui', 'Polangui_page-0001.jpg', 2000, 1500),
(24, 'San Fernando', 'San Fernando_page-0001.jpg', 2000, 1500);

-- --------------------------------------------------------

--
-- Table structure for table `utility_bills`
--

CREATE TABLE `utility_bills` (
  `bill_id` int(11) NOT NULL,
  `resident_id` int(11) DEFAULT NULL,
  `subdivision_id` int(11) DEFAULT NULL,
  `electric_provider` varchar(100) DEFAULT NULL,
  `water_provider` varchar(100) DEFAULT NULL,
  `bill_date` date DEFAULT NULL,
  `billing_period` varchar(100) DEFAULT NULL,
  `due_date` date DEFAULT NULL,
  `prev_reading` decimal(10,2) DEFAULT 0.00,
  `present_reading` decimal(10,2) DEFAULT 0.00,
  `consumption` decimal(10,2) DEFAULT 0.00,
  `cost_per_cubic_meter` decimal(10,2) DEFAULT 0.00,
  `current_bill` decimal(10,2) DEFAULT 0.00,
  `previous_bill_balance` decimal(10,2) DEFAULT 0.00,
  `total_bill` decimal(10,2) DEFAULT 0.00,
  `penalty_fee` decimal(10,2) DEFAULT 0.00,
  `amount_paid` decimal(10,2) DEFAULT 0.00,
  `remaining_balance` decimal(10,2) DEFAULT 0.00,
  `bill_status` enum('Paid','Unpaid','Overdue','Pending') DEFAULT 'Unpaid',
  `payment_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`admin_id`),
  ADD UNIQUE KEY `admin_id` (`admin_id`);

--
-- Indexes for table `admin_logs`
--
ALTER TABLE `admin_logs`
  ADD PRIMARY KEY (`log_id`);

--
-- Indexes for table `connovate_panels`
--
ALTER TABLE `connovate_panels`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_connovate_panel` (`project_name`,`block_no`,`lot_no`,`floor_name`,`panel_key`);

--
-- Indexes for table `residents`
--
ALTER TABLE `residents`
  ADD PRIMARY KEY (`resident_id`);

--
-- Indexes for table `subdivisions`
--
ALTER TABLE `subdivisions`
  ADD PRIMARY KEY (`subdivision_id`);

--
-- Indexes for table `utility_bills`
--
ALTER TABLE `utility_bills`
  ADD PRIMARY KEY (`bill_id`),
  ADD KEY `resident_id` (`resident_id`),
  ADD KEY `fk_bill_subdivision` (`subdivision_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `admin_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `admin_logs`
--
ALTER TABLE `admin_logs`
  MODIFY `log_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `connovate_panels`
--
ALTER TABLE `connovate_panels`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=621;

--
-- AUTO_INCREMENT for table `residents`
--
ALTER TABLE `residents`
  MODIFY `resident_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `subdivisions`
--
ALTER TABLE `subdivisions`
  MODIFY `subdivision_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `utility_bills`
--
ALTER TABLE `utility_bills`
  MODIFY `bill_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `utility_bills`
--
ALTER TABLE `utility_bills`
  ADD CONSTRAINT `fk_bill_subdivision` FOREIGN KEY (`subdivision_id`) REFERENCES `subdivisions` (`subdivision_id`),
  ADD CONSTRAINT `utility_bills_ibfk_1` FOREIGN KEY (`resident_id`) REFERENCES `residents` (`resident_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
