-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 25, 2026 at 10:50 AM
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
(4, 'Leyn', 'Master', 'leyn123', '2026-06-25 00:27:36', '$2b$12$mFmOGp8YTIR8hnMKLSCmBO7NWJBS9.M.WfAMxxZ9mny4VVD6SVE.W', 'active'),
(5, 'Catherine', 'Master', 'cath123', '2026-06-17 07:49:02', '$2b$12$EvBy28xjbS.f6WU9.e2FYu3QD8iXP6Dq.7y2Sixl6f33n/qhkwPjq', 'active'),
(6, 'hellnah', 'Master', '12345', '2026-06-19 00:30:38', '$2y$10$B4rS11up9hEOmvHGbYXsy.4KVsyCv0TjqACkKZwKq.QB5FwbScKNy', 'active'),
(7, 'JanaDulog', 'Master', 'jana123', '2026-06-22 01:19:19', '$2y$10$5a7yaJ7RuykjbdwBQziI8ejFaP4KQ1ypc5088vaEZvslBvcTPxCLC', 'active');

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
(18, 2, 'CREATED', 'Added: Franz Matthew', '2026-03-29 21:03:37'),
(19, 4, 'CREATED', 'Added admin: hellnah as Master', '2026-06-19 08:30:38'),
(20, 4, 'UPDATED', 'Modified: Franz Matthew', '2026-06-25 10:14:50'),
(21, 4, 'UPDATED', 'Modified: Franz Matthew', '2026-06-25 13:19:48'),
(22, 4, 'UPDATED', 'Modified: Andress Jose Bonifacio', '2026-06-25 13:20:18'),
(23, 4, 'UPDATED', 'Modified: Franz Matthew', '2026-06-25 13:20:48'),
(24, 4, 'UPDATED', 'Modified: Franz Matthew', '2026-06-25 13:21:26'),
(25, 4, 'UPDATED', 'Modified: Franz Matthew', '2026-06-25 13:21:43'),
(26, 4, 'UPDATED', 'Modified: Franz Matthew', '2026-06-25 13:24:30'),
(27, 4, 'UPDATED', 'Modified: Franz Matthew', '2026-06-25 13:25:16'),
(28, 4, 'UPDATED', 'Modified: Franz Matthew', '2026-06-25 13:25:48'),
(29, 4, 'UPDATED', 'Modified: Franz Matthew', '2026-06-25 13:47:43'),
(30, 4, 'UPDATED', 'Modified: Franz Matthew', '2026-06-25 13:48:13'),
(31, 4, 'UPDATED', 'Modified: Franz Matthew', '2026-06-25 13:50:00'),
(32, 4, 'UPDATED', 'Modified: Franz Matthew', '2026-06-25 13:50:16'),
(33, 4, 'UPDATED', 'Modified: Andress Jose Bonifacio', '2026-06-25 13:52:05'),
(34, 4, 'UPDATED', 'Modified: Franz Matthew', '2026-06-25 14:13:40'),
(35, 4, 'UPDATED', 'Modified: Franz Matthew', '2026-06-25 14:14:05'),
(36, 4, 'UPDATED', 'Modified: Franz Matthew', '2026-06-25 14:20:49'),
(37, 4, 'UPDATED', 'Modified: Franz Matthew', '2026-06-25 14:21:47'),
(38, 4, 'UPDATED', 'Modified: Franz Matthew', '2026-06-25 14:23:28'),
(39, 4, 'UPDATED', 'Modified: Franz Matthew', '2026-06-25 14:25:45');

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
(643, 'PADRE GARCIA', '18', '63', 'GROUND FLOOR', 'gf-top-beam', 'CTRLTDX-002A', 1, 'finished', 7, 'JanaDulog', '2026-06-22 13:21:48', '2026-06-22 05:21:48', '2026-06-22 05:21:48', 'TDX-002A', NULL),
(644, 'PADRE GARCIA', '18', '63', 'SECOND FLOOR', 'sf-left-top-green', 'CTRL-TESTSF-214', 1, 'finished', 7, 'JanaDulog', '2026-06-22 13:29:22', '2026-06-22 05:29:22', '2026-06-22 05:29:22', 'TIR-214A', NULL),
(645, 'PADRE GARCIA', '18', '63', 'GROUND FLOOR', 'gf-center-left-red', 'CTRL-TESTGF-004A', 1, 'finished', 7, 'JanaDulog', '2026-06-22 13:33:49', '2026-06-22 05:33:33', '2026-06-22 05:33:49', 'TDX-004A', NULL),
(646, 'PADRE GARCIA', '18', '63', 'GROUND FLOOR', 'gf-center-right-red', 'CTRL-TESTGF-003A', 1, 'finished', 7, 'JanaDulog', '2026-06-22 13:34:01', '2026-06-22 05:34:01', '2026-06-22 05:34:01', 'TDX-003A', NULL),
(647, 'PADRE GARCIA', '18', '63', 'GROUND FLOOR', 'gf-center-purple', 'CTRL-TESTGF-001A', 1, 'finished', 7, 'JanaDulog', '2026-06-22 13:34:15', '2026-06-22 05:34:15', '2026-06-22 05:34:15', 'TDX-001A', NULL),
(648, 'PADRE GARCIA', '18', '63', 'GROUND FLOOR', 'gf-center-green', 'CTRL-TESTGF-214A1', 1, 'finished', 7, 'JanaDulog', '2026-06-22 13:34:26', '2026-06-22 05:34:26', '2026-06-22 05:34:26', 'TIR-214A', NULL),
(649, 'PADRE GARCIA', '18', '63', 'GROUND FLOOR', 'gf-left-top-green', 'CTRL-TESTGF-207A', 1, 'finished', 7, 'JanaDulog', '2026-06-22 13:34:52', '2026-06-22 05:34:52', '2026-06-22 05:34:52', 'TIR-207A', NULL),
(650, 'PADRE GARCIA', '18', '63', 'GROUND FLOOR', 'gf-right-top-green', 'CTRL-TESTGF-207A2', 1, 'finished', 7, 'JanaDulog', '2026-06-22 13:35:05', '2026-06-22 05:35:05', '2026-06-22 05:35:05', 'TIR-207A', NULL),
(651, 'PADRE GARCIA', '18', '63', 'GROUND FLOOR', 'gf-mid-beam-left', 'CTRL-TESTGF-219A', 1, 'finished', 7, 'JanaDulog', '2026-06-22 13:35:27', '2026-06-22 05:35:12', '2026-06-22 05:35:27', 'TDX-219A', NULL),
(652, 'PADRE GARCIA', '18', '63', 'GROUND FLOOR', 'gf-mid-beam-right', 'CTRL-TESTGF-220A', 1, 'finished', 7, 'JanaDulog', '2026-06-22 13:35:21', '2026-06-22 05:35:21', '2026-06-22 05:35:21', 'TDX-220A', NULL),
(653, 'PADRE GARCIA', '18', '63', 'SECOND FLOOR', 'sf-right-top-green', 'CTRL-TESTSF-214-2', 1, 'finished', 7, 'JanaDulog', '2026-06-22 13:35:58', '2026-06-22 05:35:58', '2026-06-22 05:35:58', 'TIR-214A', NULL),
(654, 'PADRE GARCIA', '18', '63', 'SECOND FLOOR', 'sf-center-green', 'CTRL-TESTSF-214-2', 1, 'finished', 7, 'JanaDulog', '2026-06-22 13:36:08', '2026-06-22 05:36:08', '2026-06-22 05:36:08', 'TIR-214A', NULL),
(655, 'PADRE GARCIA', '18', '63', 'SECOND FLOOR', 'sf-mid-beam-left', 'CTRL-TESTSF-209-1', 1, 'finished', 7, 'JanaDulog', '2026-06-22 13:36:16', '2026-06-22 05:36:16', '2026-06-22 05:36:16', 'TIR-209A', NULL),
(656, 'PADRE GARCIA', '18', '63', 'SECOND FLOOR', 'sf-mid-beam-right', 'CTRL-TESTSF-209-2', 1, 'finished', 7, 'JanaDulog', '2026-06-22 13:36:22', '2026-06-22 05:36:22', '2026-06-22 05:36:22', 'TIR-209A', NULL),
(657, 'PADRE GARCIA', '18', '63', 'SECOND FLOOR', 'sf-left-red-1', 'CTRL-TESTSF-211', 1, 'finished', 7, 'JanaDulog', '2026-06-22 13:36:29', '2026-06-22 05:36:29', '2026-06-22 05:36:29', 'TDX-211A', NULL),
(658, 'PADRE GARCIA', '18', '63', 'SECOND FLOOR', 'sf-left-red-2', 'CTRL-TESTSF-210', 1, 'finished', 7, 'JanaDulog', '2026-06-22 13:36:37', '2026-06-22 05:36:37', '2026-06-22 05:36:37', 'TDX-210A', NULL),
(659, 'PADRE GARCIA', '18', '63', 'SECOND FLOOR', 'sf-left-bottom-green', 'CTRL-TESTSF-214-3', 1, 'finished', 7, 'JanaDulog', '2026-06-22 13:36:53', '2026-06-22 05:36:53', '2026-06-22 05:36:53', 'TIR-214A', NULL),
(660, 'PADRE GARCIA', '18', '63', 'SECOND FLOOR', 'sf-bottom-beam-left', 'CTRL-TESTSF-208-1', 1, 'finished', 7, 'JanaDulog', '2026-06-22 13:37:04', '2026-06-22 05:37:04', '2026-06-22 05:37:04', 'TIR-208A', NULL),
(661, 'Brgy. Estanza', '12', '37', 'GROUND FLOOR', 'gf-top-beam', 'STANZA TDX-002A', 1, 'finished', 7, 'JanaDulog', '2026-06-22 13:37:59', '2026-06-22 05:37:59', '2026-06-22 05:37:59', 'TDX-002A', NULL),
(662, 'PADRE GARCIA', '18', '63', 'GROUND FLOOR', 'gf-left-red-1', 'CTRL-TESTGF-204', 1, 'finished', 7, 'JanaDulog', '2026-06-22 13:42:43', '2026-06-22 05:42:07', '2026-06-22 05:42:43', 'TDX-204A', NULL),
(663, 'PADRE GARCIA', '18', '63', 'GROUND FLOOR', 'gf-left-red-2', 'CTRL-TESTGF-203', 1, 'finished', 7, 'JanaDulog', '2026-06-22 13:42:48', '2026-06-22 05:42:15', '2026-06-22 05:42:48', 'TDX-203A', NULL),
(664, 'PADRE GARCIA', '18', '63', 'GROUND FLOOR', 'gf-left-bottom-green', 'CTRL-TESTGF-207', 1, 'finished', 7, 'JanaDulog', '2026-06-22 13:42:56', '2026-06-22 05:42:56', '2026-06-22 05:42:56', 'TIR-207A', NULL),
(665, 'PADRE GARCIA', '18', '63', 'GROUND FLOOR', 'gf-center-bottom-green', 'CTRL-TESTGF-2072', 1, 'finished', 7, 'JanaDulog', '2026-06-22 13:43:06', '2026-06-22 05:43:06', '2026-06-22 05:43:06', 'TIR-207A', NULL),
(666, 'PADRE GARCIA', '18', '63', 'GROUND FLOOR', 'gf-right-bottom-green', 'CTRL-TESTGF-207 3', 1, 'finished', 7, 'JanaDulog', '2026-06-22 13:43:12', '2026-06-22 05:43:12', '2026-06-22 05:43:12', 'TIR-207A', NULL),
(667, 'PADRE GARCIA', '18', '63', 'GROUND FLOOR', 'gf-bottom-beam-left', 'CTRL-TESTGF-201', 1, 'finished', 7, 'JanaDulog', '2026-06-22 13:43:21', '2026-06-22 05:43:21', '2026-06-22 05:43:21', 'TDX-201A', NULL),
(668, 'PADRE GARCIA', '18', '63', 'GROUND FLOOR', 'gf-bottom-beam-right', 'CTRL-TESTGF-201', 1, 'finished', 7, 'JanaDulog', '2026-06-22 13:43:29', '2026-06-22 05:43:29', '2026-06-22 05:43:29', 'TDX-201A', NULL),
(669, 'PADRE GARCIA', '18', '63', 'GROUND FLOOR', 'gf-center-blue-1', 'CTRL-TESTGF-206', 1, 'finished', 7, 'JanaDulog', '2026-06-22 13:43:45', '2026-06-22 05:43:45', '2026-06-22 05:43:45', 'TDX-206A', NULL),
(670, 'PADRE GARCIA', '18', '63', 'GROUND FLOOR', 'gf-center-blue-2', 'CTRL-TESTGF-205', 1, 'finished', 7, 'JanaDulog', '2026-06-22 13:43:53', '2026-06-22 05:43:53', '2026-06-22 05:43:53', 'TDX-205A', NULL),
(671, 'PADRE GARCIA', '18', '63', 'GROUND FLOOR', 'gf-right-red-1', 'CTRL-TESTGF-216', 1, 'finished', 7, 'JanaDulog', '2026-06-22 13:43:59', '2026-06-22 05:43:59', '2026-06-22 05:43:59', 'TDX-216A', NULL),
(672, 'PADRE GARCIA', '18', '63', 'GROUND FLOOR', 'gf-right-red-2', 'CTRL-TESTGF-215', 1, 'finished', 7, 'JanaDulog', '2026-06-22 13:44:05', '2026-06-22 05:44:05', '2026-06-22 05:44:05', 'TDX-215A', NULL),
(673, 'PADRE GARCIA', '18', '63', 'SECOND FLOOR', 'sf-right-red-1', 'CTRL-TESTSF-218', 1, 'finished', 7, 'JanaDulog', '2026-06-22 13:44:19', '2026-06-22 05:44:19', '2026-06-22 05:44:19', 'TDX-218A', NULL),
(674, 'PADRE GARCIA', '18', '63', 'SECOND FLOOR', 'sf-right-red-2', 'CTRL-TESTSF-217', 1, 'finished', 7, 'JanaDulog', '2026-06-22 13:44:30', '2026-06-22 05:44:30', '2026-06-22 05:44:30', 'TDX-217A', NULL),
(675, 'PADRE GARCIA', '18', '63', 'SECOND FLOOR', 'sf-center-blue-1', 'CTRL-TESTSF-213', 1, 'finished', 7, 'JanaDulog', '2026-06-22 13:44:41', '2026-06-22 05:44:41', '2026-06-22 05:44:41', 'TDX-213A', NULL),
(676, 'PADRE GARCIA', '18', '63', 'SECOND FLOOR', 'sf-center-blue-2', 'CTRL-TESTSF-212', 1, 'finished', 7, 'JanaDulog', '2026-06-22 13:44:47', '2026-06-22 05:44:47', '2026-06-22 05:44:47', 'TDX-212A', NULL),
(677, 'PADRE GARCIA', '18', '63', 'SECOND FLOOR', 'sf-center-bottom-green', 'CTRL-TESTSF-214-5', 1, 'finished', 7, 'JanaDulog', '2026-06-22 13:45:02', '2026-06-22 05:45:02', '2026-06-22 05:45:02', 'TIR-214A', NULL),
(678, 'PADRE GARCIA', '18', '63', 'SECOND FLOOR', 'sf-right-bottom-green', 'CTRL-TESTSF-214-4', 1, 'finished', 7, 'JanaDulog', '2026-06-22 13:45:13', '2026-06-22 05:45:13', '2026-06-22 05:45:13', 'TIR-214A', NULL),
(679, 'PADRE GARCIA', '18', '63', 'SECOND FLOOR', 'sf-bottom-beam-right', 'CTRL-TESTSF-208-2', 1, 'finished', 7, 'JanaDulog', '2026-06-22 13:45:23', '2026-06-22 05:45:23', '2026-06-22 05:45:23', 'TIR-208A', NULL);

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
  `tct_file` varchar(255) DEFAULT NULL,
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

INSERT INTO `residents` (`resident_id`, `subdivision_id`, `phase`, `block_no`, `lot_no`, `tct_no`, `tct_file`, `buyer_name`, `new_buyer_assumed`, `buyer_representative`, `contact_no`, `social_media`, `email_address`, `account_number`, `account_address`, `resident_status`, `remarks`, `created_at`) VALUES
(3, 1, 'phase 1', '18', '62', '', '', 'Andress Jose Bonifacio', '', '', '0917-123-4567', '', 'andressjose@example.com', 'ACC-IM-2026-001', '', 'Active', '', '2026-03-17 16:00:00'),
(15, 1, 'phase 1', '18', '61', '', NULL, 'Albert Poblacion', '', '', '0929-263-4567', '', 'AlbertPoblacion@example.com', 'ACC-IM-2026-005', '', 'Active', '', '2026-03-24 16:00:00'),
(18, 1, 'phase 1', '18', '63', '', '', 'Franz Matthew', '', '', '0917-148-4567', '', 'FranzMatt@example.com', 'ACC-IM-2026-003', '', 'Active', '', '2026-03-28 16:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `solar_panels`
--

CREATE TABLE `solar_panels` (
  `id` int(11) NOT NULL,
  `resident_id` int(11) DEFAULT NULL,
  `project_name` varchar(100) DEFAULT NULL,
  `block_no` varchar(50) DEFAULT NULL,
  `lot_no` varchar(50) DEFAULT NULL,
  `solar_status` varchar(30) DEFAULT 'Not Installed',
  `installation_date` date DEFAULT NULL,
  `provider` varchar(150) DEFAULT NULL,
  `capacity_details` varchar(255) DEFAULT NULL,
  `proof_file` varchar(255) DEFAULT NULL,
  `remarks` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
-- Indexes for table `solar_panels`
--
ALTER TABLE `solar_panels`
  ADD PRIMARY KEY (`id`);

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
  MODIFY `admin_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `admin_logs`
--
ALTER TABLE `admin_logs`
  MODIFY `log_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT for table `connovate_panels`
--
ALTER TABLE `connovate_panels`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=626;

--
-- AUTO_INCREMENT for table `residents`
--
ALTER TABLE `residents`
  MODIFY `resident_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `solar_panels`
--
ALTER TABLE `solar_panels`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

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
