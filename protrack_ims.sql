-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 02, 2025 at 08:47 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `protrack_ims`
--

-- --------------------------------------------------------

--
-- Table structure for table `activity_log`
--

CREATE TABLE `activity_log` (
  `activity_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `role` varchar(255) NOT NULL,
  `activity` varchar(255) NOT NULL,
  `action` varchar(255) NOT NULL,
  `activity_details` text NOT NULL,
  `ip_address` varchar(255) NOT NULL,
  `user_agent` varchar(255) NOT NULL,
  `created_at` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `activity_log`
--

INSERT INTO `activity_log` (`activity_id`, `user_id`, `role`, `activity`, `action`, `activity_details`, `ip_address`, `user_agent`, `created_at`) VALUES
(457, 1, 'Super Admin', 'Logged In', 'LOGIN', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36 Edg/133.0.0.0', '1740689235'),
(458, 1, 'Super Admin', 'Logged Out', 'LOG OUT', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36 Edg/133.0.0.0', '1740689475'),
(459, 1, 'Super Admin', 'Logged In', 'LOGIN', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36 Edg/133.0.0.0', '1740690805'),
(460, 1, 'Super Admin', 'Logged Out', 'LOG OUT', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36 Edg/133.0.0.0', '1740691534'),
(461, 1, 'Super Admin', 'Logged In', 'LOGIN', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36 Edg/133.0.0.0', '1740695950'),
(462, 1, 'Super Admin', 'Logged Out', 'LOG OUT', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36 Edg/133.0.0.0', '1740696020'),
(463, 1, 'Super Admin', 'Logged In', 'LOGIN', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36 Edg/133.0.0.0', '1740696161'),
(464, 1, 'Super Admin', 'Logged Out', 'LOG OUT', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36 Edg/133.0.0.0', '1740696180'),
(465, 1, 'Super Admin', 'Logged In', 'LOGIN', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36 Edg/133.0.0.0', '1740696202'),
(466, 1, 'Super Admin', 'Logged Out', 'LOG OUT', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36 Edg/133.0.0.0', '1740696225'),
(467, 1, 'Super Admin', 'Logged In', 'LOGIN', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36 Edg/133.0.0.0', '1740696602'),
(468, 1, 'Super Admin', 'Logged Out', 'LOG OUT', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36 Edg/133.0.0.0', '1740696888'),
(469, 1, 'Super Admin', 'Logged In', 'LOGIN', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36 Edg/133.0.0.0', '1740696890'),
(470, 1, 'Super Admin', 'Logged In', 'LOGIN', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36 Edg/133.0.0.0', '1741401437'),
(471, 1, 'Super Admin', 'Created a new product category', 'CREATE', '{\"product_category_name\":\"Stationary\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36 Edg/133.0.0.0', '1741402425'),
(472, 1, 'Super Admin', 'Deleted a product category', 'DELETE', '{\"product_category_id\":6,\"product_category_name\":\"Stationary\",\"product_category_slug\":\"stationary\",\"product_category_created_at\":\"1741402425\",\"product_category_status\":\"Active\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36 Edg/133.0.0.0', '1741402432'),
(473, 1, 'Super Admin', 'Created a new product brand', 'CREATE', '{\"product_brand_name\":\"HB\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36 Edg/133.0.0.0', '1741402486'),
(474, 1, 'Super Admin', 'Deleted a product brand', 'DELETE', '{\"product_brand_id\":10,\"product_brand_name\":\"HB\",\"product_brand_slug\":\"hb\",\"product_brand_created_at\":\"1741402486\",\"product_brand_status\":\"Active\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36 Edg/133.0.0.0', '1741402491'),
(475, 1, 'Super Admin', 'Created a new User', 'CREATE', '{\"user_firstname\":\"John\",\"user_lastname\":\"Wayne\",\"user_gender\":\"Male\",\"user_email\":\"wayne@gmail.com\",\"user_phone\":\"09089098909\",\"store_id\":\"1\",\"user_role\":\"Admin\",\"password\":\"protrack2025\",\"re-password\":\"protrack2025\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36 Edg/133.0.0.0', '1741402783'),
(476, 1, 'Super Admin', 'Logged Out', 'LOG OUT', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36 Edg/133.0.0.0', '1741402792'),
(477, 13, 'Admin', 'Logged In', 'LOGIN', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36 Edg/133.0.0.0', '1741402799'),
(478, 13, 'Admin', 'Updated my account', 'UPDATE', '{\"current_firstname\":\"John\",\"current_lastname\":\"Wayne\",\"current_phone\":\"09089098909\",\"current_email\":\"wayne@gmail.com\",\"current_gender\":\"Male\",\"user_firstname\":\"John\",\"user_lastname\":\"Wayne\",\"user_gender\":\"Male\",\"user_phone\":\"09089098909\",\"user_email\":\"wayne@gmail.com\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36 Edg/133.0.0.0', '1741402908'),
(479, 13, 'Admin', 'Logged Out', 'LOG OUT', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36 Edg/133.0.0.0', '1741402918'),
(480, 1, 'Super Admin', 'Logged In', 'LOGIN', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36 Edg/133.0.0.0', '1741402921'),
(481, 1, 'Super Admin', 'Updated an existing store', 'UPDATE', '{\"previous_store_name\":\"Main Shop\",\"previous_store_address\":\"#1 Agulu Street Umuahia Abia State\",\"previous_store_status\":\"Active\",\"store_name\":\"Main Shop\",\"store_address\":\"#1 Agulu Street Umuahia Abia State\",\"store_status\":\"Active\"}', '::1', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Mobile Safari/537.36 Edg/133.0.0.0', '1741403334'),
(482, 1, 'Super Admin', 'Logged Out', 'LOG OUT', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36 Edg/133.0.0.0', '1741403388'),
(483, 13, 'Admin', 'Logged In', 'LOGIN', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36 Edg/133.0.0.0', '1741403392'),
(484, 13, 'Admin', 'Logged Out', 'LOG OUT', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36 Edg/133.0.0.0', '1741404541'),
(485, 1, 'Super Admin', 'Logged In', 'LOGIN', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36 Edg/133.0.0.0', '1741404544'),
(486, 1, 'Super Admin', 'Logged Out', 'LOG OUT', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36 Edg/133.0.0.0', '1741404569'),
(487, 13, 'Admin', 'Logged In', 'LOGIN', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36 Edg/133.0.0.0', '1741404572'),
(488, 13, 'Admin', 'Logged In', 'LOGIN', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36 Edg/134.0.0.0', '1742116099'),
(489, 13, 'Admin', 'Logged Out', 'LOG OUT', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36 Edg/134.0.0.0', '1742120253'),
(490, 1, 'Super Admin', 'Logged In', 'LOGIN', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36 Edg/134.0.0.0', '1742120256'),
(491, 1, 'Super Admin', 'Created a new product category', 'CREATE', '{\"product_category_name\":\"Electronics\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36 Edg/134.0.0.0', '1742120282'),
(492, 1, 'Super Admin', 'Created a new product brand', 'CREATE', '{\"product_brand_name\":\"Hisense\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36 Edg/134.0.0.0', '1742120292'),
(493, 1, 'Super Admin', 'Created a new product category', 'CREATE', '{\"product_category_name\":\"Groceries\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36 Edg/134.0.0.0', '1742120328'),
(494, 1, 'Super Admin', 'Created a new product brand', 'CREATE', '{\"product_brand_name\":\"German Pumpkins\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36 Edg/134.0.0.0', '1742120336'),
(495, 1, 'Super Admin', 'Created a new product', 'CREATE', '{\"store_id\":\"1\",\"product_category_id\":\"8\",\"product_brand_id\":\"12\",\"product_name\":\"German Flutted Pumpkins\",\"product_cost_price\":\"15.99\",\"product_price\":\"17.99\",\"product_stock\":\"30\",\"product_reorder_level\":\"3\",\"product_measuring_units\":\"kg\",\"product_expiry_date\":\"2025-03-16\",\"product_expiry_time\":\"11:24\",\"product_expiry_discount_rate\":\"50\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36 Edg/134.0.0.0', '1742120434'),
(496, 1, 'Super Admin', 'Updated an existing product', 'UPDATE', '{\"previous_product_name\":\"German Flutted Pumpkins\",\"previous_product_cost_price\":15.99,\"previous_product_price\":17.99,\"previous_product_stock\":30,\"previous_product_measuring_units\":\"kg\",\"previous_product_reorder_level\":3,\"previous_product_vat_rate\":0,\"previous_product_discount_rate\":0,\"previous_product_status\":\"Active\",\"previous_product_store_name\":\"Main Shop\",\"previous_product_category_name\":\"Groceries\",\"previous_product_brand_name\":\"German Pumpkins\",\"previous_product_expiry_date\":\"2025-03-16T10:24:00.000Z\",\"previous_product_expiry_discount_rate\":50,\"store_id\":\"1\",\"product_category_id\":\"8\",\"product_brand_id\":\"12\",\"product_name\":\"German Flutted Pumpkins\",\"product_cost_price\":\"15.99\",\"product_price\":\"17.99\",\"product_stock\":\"30\",\"product_measuring_units\":\"kg\",\"product_reorder_level\":\"3\",\"product_vat_rate\":\"0\",\"product_discount_rate\":\"0\",\"product_status\":\"Active\",\"productExpiryDate\":\"2025-03-16 12:00:00\",\"product_expiry_discount_rate\":\"50\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36 Edg/134.0.0.0', '1742122344'),
(497, 1, 'Super Admin', 'Logged In', 'LOGIN', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36 Edg/134.0.0.0', '1743289697'),
(498, 1, 'Super Admin', 'Created a new User', 'CREATE', '{\"user_firstname\":\"John\",\"user_lastname\":\"Enwere\",\"user_gender\":\"Male\",\"user_email\":\"enwere@gmail.com\",\"user_phone\":\"09089099098\",\"store_id\":\"1\",\"user_role\":\"Cashier\",\"password\":\"protrack2025\",\"re-password\":\"protrack2025\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36 Edg/134.0.0.0', '1743289751'),
(499, 1, 'Super Admin', 'Logged Out', 'LOG OUT', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36 Edg/134.0.0.0', '1743289772'),
(500, 14, 'Cashier', 'Logged In', 'LOGIN', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36 Edg/134.0.0.0', '1743289777'),
(501, 14, 'Cashier', 'Logged Out', 'LOG OUT', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36 Edg/134.0.0.0', '1743290419'),
(502, 14, 'Cashier', 'Logged In', 'LOGIN', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36 Edg/134.0.0.0', '1743977615'),
(503, 14, 'Cashier', 'Logged Out', 'LOG OUT', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36 Edg/134.0.0.0', '1743984722'),
(504, 1, 'Super Admin', 'Logged In', 'LOGIN', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36 Edg/134.0.0.0', '1743984726'),
(505, 1, 'Super Admin', 'Created a new product', 'CREATE', '{\"store_id\":\"1\",\"product_category_id\":\"8\",\"product_brand_id\":\"12\",\"product_name\":\"Flutted Pumpkins\",\"product_cost_price\":\"12\",\"product_price\":\"14\",\"product_stock\":\"13\",\"product_reorder_level\":\"2\",\"product_measuring_units\":\"Bunch\",\"product_expiry_date\":\"\",\"product_expiry_time\":\"\",\"product_expiry_discount_rate\":\"\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36 Edg/134.0.0.0', '1743988688'),
(506, 1, 'Super Admin', 'Logged Out', 'LOG OUT', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36 Edg/134.0.0.0', '1743989997'),
(507, 14, 'Cashier', 'Logged In', 'LOGIN', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36 Edg/134.0.0.0', '1743990000'),
(508, 14, 'Cashier', 'Logged Out', 'LOG OUT', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36 Edg/134.0.0.0', '1743990190'),
(509, 1, 'Super Admin', 'Logged In', 'LOGIN', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36 Edg/134.0.0.0', '1743990193'),
(510, 1, 'Super Admin', 'Logged Out', 'LOG OUT', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36 Edg/134.0.0.0', '1743990797'),
(511, 14, 'Cashier', 'Logged In', 'LOGIN', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36 Edg/134.0.0.0', '1743990800'),
(512, 14, 'Cashier', 'Logged Out', 'LOG OUT', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36 Edg/134.0.0.0', '1743991247'),
(513, 1, 'Super Admin', 'Logged In', 'LOGIN', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36 Edg/134.0.0.0', '1743991250'),
(514, 1, 'Super Admin', 'Logged In', 'LOGIN', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 Edg/135.0.0.0', '1744676979'),
(515, 1, 'Super Admin', 'Logged Out', 'LOG OUT', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 Edg/135.0.0.0', '1744679393'),
(516, 14, 'Cashier', 'Logged In', 'LOGIN', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 Edg/135.0.0.0', '1744679397'),
(517, 14, 'Cashier', 'Logged In', 'LOGIN', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 Edg/135.0.0.0', '1744964707'),
(518, 14, 'Cashier', 'Logged Out', 'LOG OUT', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 Edg/135.0.0.0', '1744981634'),
(519, 1, 'Super Admin', 'Logged In', 'LOGIN', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 Edg/135.0.0.0', '1744981638'),
(520, 1, 'Super Admin', 'Created a new product', 'CREATE', '{\"store_id\":\"1\",\"product_category_id\":\"8\",\"product_brand_id\":\"12\",\"product_name\":\"Sherman Pumpkins\",\"product_cost_price\":\"13.56\",\"product_price\":\"16.98\",\"product_stock\":\"12\",\"product_reorder_level\":\"4\",\"product_measuring_units\":\"Bunch\",\"product_expiry_date\":\"2025-04-18\",\"product_expiry_time\":\"14:15\",\"product_expiry_discount_rate\":\"50\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 Edg/135.0.0.0', '1744981748'),
(521, 1, 'Super Admin', 'Updated an existing product', 'UPDATE', '{\"previous_product_name\":\"Sherman Pumpkins\",\"previous_product_cost_price\":13.56,\"previous_product_price\":16.98,\"previous_product_stock\":12,\"previous_product_measuring_units\":\"Bunch\",\"previous_product_reorder_level\":4,\"previous_product_vat_rate\":0,\"previous_product_discount_rate\":0,\"previous_product_status\":\"Active\",\"previous_product_store_name\":\"Main Shop\",\"previous_product_category_name\":\"Groceries\",\"previous_product_brand_name\":\"German Pumpkins\",\"previous_product_expiry_date\":\"2025-04-18T13:15:00.000Z\",\"previous_product_expiry_discount_rate\":50,\"store_id\":\"1\",\"product_category_id\":\"8\",\"product_brand_id\":\"12\",\"product_name\":\"Sherman Pumpkins\",\"product_cost_price\":\"13.56\",\"product_price\":\"16.98\",\"product_stock\":\"12\",\"product_measuring_units\":\"Bunch\",\"product_reorder_level\":\"4\",\"product_vat_rate\":\"0\",\"product_discount_rate\":\"0\",\"product_status\":\"Active\",\"productExpiryDate\":\"2025-04-18 02:24:00\",\"product_expiry_discount_rate\":\"50\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 Edg/135.0.0.0', '1744981964'),
(522, 1, 'Super Admin', 'Updated an existing product', 'UPDATE', '{\"previous_product_name\":\"Sherman Pumpkins\",\"previous_product_cost_price\":13.56,\"previous_product_price\":16.98,\"previous_product_stock\":12,\"previous_product_measuring_units\":\"Bunch\",\"previous_product_reorder_level\":4,\"previous_product_vat_rate\":0,\"previous_product_discount_rate\":0,\"previous_product_status\":\"Active\",\"previous_product_store_name\":\"Main Shop\",\"previous_product_category_name\":\"Groceries\",\"previous_product_brand_name\":\"German Pumpkins\",\"previous_product_expiry_date\":\"2025-04-18T01:24:00.000Z\",\"previous_product_expiry_discount_rate\":50,\"store_id\":\"1\",\"product_category_id\":\"8\",\"product_brand_id\":\"12\",\"product_name\":\"Sherman Pumpkins\",\"product_cost_price\":\"13.56\",\"product_price\":\"16.98\",\"product_stock\":\"12\",\"product_measuring_units\":\"Bunch\",\"product_reorder_level\":\"4\",\"product_vat_rate\":\"0\",\"product_discount_rate\":\"0\",\"product_status\":\"Active\",\"productExpiryDate\":\"2025-04-18 14:25:00\",\"product_expiry_discount_rate\":\"50\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 Edg/135.0.0.0', '1744981988'),
(523, 1, 'Super Admin', 'Created a new product', 'CREATE', '{\"store_id\":\"1\",\"product_category_id\":\"8\",\"product_brand_id\":\"12\",\"product_name\":\"Sheheev Pumpkins\",\"product_cost_price\":\"12.34\",\"product_price\":\"14.56\",\"product_stock\":\"13\",\"product_reorder_level\":\"2\",\"product_measuring_units\":\"Bunch\",\"product_expiry_date\":\"2025-04-18\",\"product_expiry_time\":\"16:05\",\"product_expiry_discount_rate\":\"50\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 Edg/135.0.0.0', '1744988411'),
(524, 1, 'Super Admin', 'Updated an existing product', 'UPDATE', '{\"previous_product_name\":\"Sheheev Pumpkins\",\"previous_product_cost_price\":12.34,\"previous_product_price\":14.56,\"previous_product_stock\":13,\"previous_product_measuring_units\":\"Bunch\",\"previous_product_reorder_level\":2,\"previous_product_vat_rate\":0,\"previous_product_discount_rate\":0,\"previous_product_status\":\"Active\",\"previous_product_store_name\":\"Main Shop\",\"previous_product_category_name\":\"Groceries\",\"previous_product_brand_name\":\"German Pumpkins\",\"previous_product_expiry_date\":\"2025-04-18T15:05:00.000Z\",\"previous_product_expiry_discount_rate\":50,\"store_id\":\"1\",\"product_category_id\":\"8\",\"product_brand_id\":\"12\",\"product_name\":\"Sheheev Pumpkins\",\"product_cost_price\":\"12.34\",\"product_price\":\"14.56\",\"product_stock\":\"12\",\"product_measuring_units\":\"Bunch\",\"product_reorder_level\":\"2\",\"product_vat_rate\":\"0\",\"product_discount_rate\":\"0\",\"product_status\":\"Active\",\"productExpiryDate\":\"2025-04-18 16:45:00\",\"product_expiry_discount_rate\":\"50\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 Edg/135.0.0.0', '1744990904'),
(525, 1, 'Super Admin', 'Updated an existing product', 'UPDATE', '{\"previous_product_name\":\"Sheheev Pumpkins\",\"previous_product_cost_price\":12.34,\"previous_product_price\":14.56,\"previous_product_stock\":0,\"previous_product_measuring_units\":\"Bunch\",\"previous_product_reorder_level\":2,\"previous_product_vat_rate\":0,\"previous_product_discount_rate\":0,\"previous_product_status\":\"Inactive\",\"previous_product_store_name\":\"Main Shop\",\"previous_product_category_name\":\"Groceries\",\"previous_product_brand_name\":\"German Pumpkins\",\"previous_product_expiry_date\":\"2025-04-18T15:45:00.000Z\",\"previous_product_expiry_discount_rate\":50,\"store_id\":\"1\",\"product_category_id\":\"8\",\"product_brand_id\":\"12\",\"product_name\":\"Sheheev Pumpkins\",\"product_cost_price\":\"12.34\",\"product_price\":\"14.56\",\"product_stock\":\"13\",\"product_measuring_units\":\"Bunch\",\"product_reorder_level\":\"2\",\"product_vat_rate\":\"0\",\"product_discount_rate\":\"0\",\"product_status\":\"Active\",\"productExpiryDate\":\"2025-04-18 17:25:00\",\"product_expiry_discount_rate\":\"50\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 Edg/135.0.0.0', '1744993322'),
(526, 1, 'Super Admin', 'Created a new invoice', 'CREATE', '{\"customer_name\":\"\",\"invoice_paid_amount\":\"3.64\",\"invoice_payment_method\":\"Cash Payment\",\"invoice_gross_total\":\"3.64\",\"invoice_net_total\":\"3.64\",\"cashier\":\"Uchechukwu Udo\",\"invoice_due\":\"0.00\",\"invoice_total_vat_rate\":0,\"invoice_total_vat_amount\":0,\"invoice_total_discount_rate\":50,\"invoice_total_discount_amount\":3.64}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 Edg/135.0.0.0', '1744993430'),
(527, 1, 'Super Admin', 'Logged In', 'LOGIN', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 Edg/135.0.0.0', '1744997062'),
(528, 1, 'Super Admin', 'Updated an existing product', 'UPDATE', '{\"previous_product_name\":\"Flutted Pumpkins\",\"previous_product_cost_price\":12,\"previous_product_price\":14,\"previous_product_stock\":13,\"previous_product_measuring_units\":\"Bunch\",\"previous_product_reorder_level\":2,\"previous_product_vat_rate\":0,\"previous_product_discount_rate\":0,\"previous_product_status\":\"Active\",\"previous_product_store_name\":\"Main Shop\",\"previous_product_category_name\":\"Groceries\",\"previous_product_brand_name\":\"German Pumpkins\",\"previous_product_expiry_date\":null,\"previous_product_expiry_discount_rate\":null,\"store_id\":\"1\",\"product_category_id\":\"8\",\"product_brand_id\":\"12\",\"product_name\":\"Flutted Pumpkins\",\"product_cost_price\":\"12\",\"product_price\":\"14\",\"product_stock\":\"13\",\"product_measuring_units\":\"Bunch\",\"product_reorder_level\":\"2\",\"product_vat_rate\":\"0\",\"product_discount_rate\":\"0\",\"product_status\":\"Active\",\"productExpiryDate\":\"2025-04-18 18:30:00\",\"product_expiry_discount_rate\":\"50\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 Edg/135.0.0.0', '1744997132'),
(529, 1, 'Super Admin', 'Created a new invoice', 'CREATE', '{\"customer_name\":\"James earl\",\"invoice_paid_amount\":\"3.5\",\"invoice_payment_method\":\"Cash Payment\",\"invoice_gross_total\":\"3.5\",\"invoice_net_total\":\"3.5\",\"cashier\":\"Uchechukwu Udo\",\"invoice_due\":\"0.00\",\"invoice_total_vat_rate\":0,\"invoice_total_vat_amount\":0,\"invoice_total_discount_rate\":50,\"invoice_total_discount_amount\":3.5}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 Edg/135.0.0.0', '1744997406'),
(530, 1, 'Super Admin', 'Updated an existing product', 'UPDATE', '{\"previous_product_name\":\"Sheheev Pumpkins\",\"previous_product_cost_price\":12.34,\"previous_product_price\":7.28,\"previous_product_stock\":12,\"previous_product_measuring_units\":\"Bunch\",\"previous_product_reorder_level\":2,\"previous_product_vat_rate\":0,\"previous_product_discount_rate\":0,\"previous_product_status\":\"Active\",\"previous_product_store_name\":\"Main Shop\",\"previous_product_category_name\":\"Groceries\",\"previous_product_brand_name\":\"German Pumpkins\",\"previous_product_expiry_date\":\"2025-04-18T16:25:00.000Z\",\"previous_product_expiry_discount_rate\":50,\"store_id\":\"1\",\"product_category_id\":\"8\",\"product_brand_id\":\"12\",\"product_name\":\"Sheheev Pumpkins\",\"product_cost_price\":\"12.34\",\"product_price\":\"7.28\",\"product_stock\":\"12\",\"product_measuring_units\":\"Bunch\",\"product_reorder_level\":\"2\",\"product_vat_rate\":\"0\",\"product_discount_rate\":\"0\",\"product_status\":\"Active\",\"productExpiryDate\":\"2025-04-19 04:58:00\",\"product_expiry_discount_rate\":\"50\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 Edg/135.0.0.0', '1745034279'),
(531, 1, 'Super Admin', 'Updated an existing product', 'UPDATE', '{\"previous_product_name\":\"Sheheev Pumpkins\",\"previous_product_cost_price\":12.34,\"previous_product_price\":3.64,\"previous_product_stock\":12,\"previous_product_measuring_units\":\"Bunch\",\"previous_product_reorder_level\":2,\"previous_product_vat_rate\":0,\"previous_product_discount_rate\":0,\"previous_product_status\":\"Active\",\"previous_product_store_name\":\"Main Shop\",\"previous_product_category_name\":\"Groceries\",\"previous_product_brand_name\":\"German Pumpkins\",\"previous_product_expiry_date\":\"2025-04-19T03:58:00.000Z\",\"previous_product_expiry_discount_rate\":50,\"store_id\":\"1\",\"product_category_id\":\"8\",\"product_brand_id\":\"12\",\"product_name\":\"Sheheev Pumpkins\",\"product_cost_price\":\"12.34\",\"product_price\":\"3.64\",\"product_stock\":\"12\",\"product_measuring_units\":\"Bunch\",\"product_reorder_level\":\"2\",\"product_vat_rate\":\"0\",\"product_discount_rate\":\"0\",\"product_status\":\"Active\",\"productExpiryDate\":\"2025-04-19 05:10:00\",\"product_expiry_discount_rate\":\"50\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 Edg/135.0.0.0', '1745035592'),
(532, 1, 'Super Admin', 'Updated an existing product', 'UPDATE', '{\"previous_product_name\":\"Sheheev Pumpkins\",\"previous_product_cost_price\":12.34,\"previous_product_price\":1.82,\"previous_product_stock\":12,\"previous_product_measuring_units\":\"Bunch\",\"previous_product_reorder_level\":2,\"previous_product_vat_rate\":0,\"previous_product_discount_rate\":0,\"previous_product_status\":\"Active\",\"previous_product_store_name\":\"Main Shop\",\"previous_product_category_name\":\"Groceries\",\"previous_product_brand_name\":\"German Pumpkins\",\"previous_product_expiry_date\":\"2025-04-19T04:10:00.000Z\",\"previous_product_expiry_discount_rate\":50,\"store_id\":\"1\",\"product_category_id\":\"8\",\"product_brand_id\":\"12\",\"product_name\":\"Sheheev Pumpkins\",\"product_cost_price\":\"12.34\",\"product_price\":\"15.78\",\"product_stock\":\"12\",\"product_measuring_units\":\"Bunch\",\"product_reorder_level\":\"2\",\"product_vat_rate\":\"0\",\"product_discount_rate\":\"0\",\"product_status\":\"Active\",\"productExpiryDate\":\"2025-04-19 05:15:00\",\"product_expiry_discount_rate\":\"50\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 Edg/135.0.0.0', '1745035834'),
(533, 1, 'Super Admin', 'Updated an existing product', 'UPDATE', '{\"previous_product_name\":\"Sheheev Pumpkins\",\"previous_product_cost_price\":12.34,\"previous_product_price\":7.890000000000001,\"previous_product_stock\":12,\"previous_product_measuring_units\":\"Bunch\",\"previous_product_reorder_level\":2,\"previous_product_vat_rate\":0,\"previous_product_discount_rate\":0,\"previous_product_status\":\"Active\",\"previous_product_store_name\":\"Main Shop\",\"previous_product_category_name\":\"Groceries\",\"previous_product_brand_name\":\"German Pumpkins\",\"previous_product_expiry_date\":\"2025-04-19T04:15:00.000Z\",\"previous_product_expiry_discount_rate\":50,\"store_id\":\"1\",\"product_category_id\":\"8\",\"product_brand_id\":\"12\",\"product_name\":\"Sheheev Pumpkins\",\"product_cost_price\":\"12.34\",\"product_price\":\"15.44\",\"product_stock\":\"12\",\"product_measuring_units\":\"Bunch\",\"product_reorder_level\":\"2\",\"product_vat_rate\":\"0\",\"product_discount_rate\":\"0\",\"product_status\":\"Active\",\"productExpiryDate\":\"2025-04-19 05:25:00\",\"product_expiry_discount_rate\":\"50\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 Edg/135.0.0.0', '1745036392'),
(534, 1, 'Super Admin', 'Logged In', 'LOGIN', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 Edg/135.0.0.0', '1745044897'),
(535, 1, 'Super Admin', 'Updated an existing product', 'UPDATE', '{\"previous_product_name\":\"Sheheev Pumpkins\",\"previous_product_cost_price\":12.34,\"previous_product_price\":7.72,\"previous_product_stock\":12,\"previous_product_measuring_units\":\"Bunch\",\"previous_product_reorder_level\":2,\"previous_product_vat_rate\":0,\"previous_product_discount_rate\":0,\"previous_product_status\":\"Active\",\"previous_product_store_name\":\"Main Shop\",\"previous_product_category_name\":\"Groceries\",\"previous_product_brand_name\":\"German Pumpkins\",\"previous_product_expiry_date\":\"2025-04-19T04:25:00.000Z\",\"previous_product_expiry_discount_rate\":50,\"store_id\":\"1\",\"product_category_id\":\"8\",\"product_brand_id\":\"12\",\"product_name\":\"Sheheev Pumpkins\",\"product_cost_price\":\"12.34\",\"product_price\":\"15.98\",\"product_stock\":\"12\",\"product_measuring_units\":\"Bunch\",\"product_reorder_level\":\"2\",\"product_vat_rate\":\"0\",\"product_discount_rate\":\"0\",\"product_status\":\"Active\",\"productExpiryDate\":\"2025-04-19 07:47:00\",\"product_expiry_discount_rate\":\"50\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 Edg/135.0.0.0', '1745044932'),
(536, 1, 'Super Admin', 'Created a new invoice', 'CREATE', '{\"customer_name\":\"\",\"invoice_paid_amount\":\"15.98\",\"invoice_payment_method\":\"Cash Payment\",\"invoice_gross_total\":\"15.98\",\"invoice_net_total\":\"15.98\",\"cashier\":\"Uchechukwu Udo\",\"invoice_due\":\"0.00\",\"invoice_total_vat_rate\":0,\"invoice_total_vat_amount\":0,\"invoice_total_discount_rate\":0,\"invoice_total_discount_amount\":0}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 Edg/135.0.0.0', '1745045144'),
(537, 1, 'Super Admin', 'Logged Out', 'LOG OUT', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 Edg/135.0.0.0', '1745045859'),
(538, 1, 'Super Admin', 'Logged In', 'LOGIN', '{}', '::ffff:192.168.202.247', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Mobile Safari/537.36', '1745045889'),
(539, 1, 'Super Admin', 'Logged In', 'LOGIN', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 Edg/135.0.0.0', '1746144707'),
(540, 1, 'Super Admin', 'Created a new product', 'CREATE', '{\"store_id\":\"1\",\"product_category_id\":\"8\",\"product_brand_id\":\"12\",\"product_name\":\"Sherman Pumpkins\",\"product_cost_price\":\"12.36\",\"product_price\":\"15.67\",\"product_stock\":\"24\",\"product_reorder_level\":\"12\",\"product_measuring_units\":\"Bunch\",\"batch_no\":\"A0091\",\"product_expiry_date\":\"2025-05-23\",\"product_expiry_time\":\"12:15\",\"product_expiry_discount_rate\":\"20\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 Edg/135.0.0.0', '1746144807'),
(541, 1, 'Super Admin', 'Updated an existing product', 'UPDATE', '{\"previous_product_name\":\"Sheheev Pumpkins\",\"previous_product_cost_price\":12.34,\"previous_product_price\":7.99,\"previous_product_stock\":10,\"previous_product_measuring_units\":\"Bunch\",\"previous_product_reorder_level\":2,\"previous_product_vat_rate\":0,\"previous_product_discount_rate\":0,\"previous_product_status\":\"Active\",\"previous_product_store_name\":\"Main Shop\",\"previous_product_category_name\":\"Groceries\",\"previous_product_brand_name\":\"German Pumpkins\",\"previous_product_expiry_date\":\"2025-04-19T06:47:00.000Z\",\"previous_product_expiry_discount_rate\":50,\"previous_batch_no\":null,\"store_id\":\"1\",\"product_category_id\":\"8\",\"product_brand_id\":\"12\",\"product_name\":\"Sheheev Pumpkins\",\"product_cost_price\":\"12.34\",\"product_price\":\"7.99\",\"product_stock\":\"10\",\"product_measuring_units\":\"Bunch\",\"product_reorder_level\":\"2\",\"product_vat_rate\":\"0\",\"product_discount_rate\":\"0\",\"product_status\":\"Active\",\"productExpiryDate\":\"2025-04-19 7:47:00\",\"product_expiry_discount_rate\":\"50\",\"batch_no\":\"A00190\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 Edg/135.0.0.0', '1746145084'),
(542, 1, 'Super Admin', 'Updated an existing product', 'UPDATE', '{\"previous_product_name\":\"Sherman Pumpkins\",\"previous_product_cost_price\":13.56,\"previous_product_price\":16.98,\"previous_product_stock\":0,\"previous_product_measuring_units\":\"Bunch\",\"previous_product_reorder_level\":4,\"previous_product_vat_rate\":0,\"previous_product_discount_rate\":0,\"previous_product_status\":\"Inactive\",\"previous_product_store_name\":\"Main Shop\",\"previous_product_category_name\":\"Groceries\",\"previous_product_brand_name\":\"German Pumpkins\",\"previous_product_expiry_date\":\"2025-04-18T13:25:00.000Z\",\"previous_product_expiry_discount_rate\":50,\"previous_batch_no\":null,\"store_id\":\"1\",\"product_category_id\":\"8\",\"product_brand_id\":\"12\",\"product_name\":\"Sherman Pumpkins\",\"product_cost_price\":\"13.56\",\"product_price\":\"16.98\",\"product_stock\":\"0\",\"product_measuring_units\":\"Bunch\",\"product_reorder_level\":\"4\",\"product_vat_rate\":\"0\",\"product_discount_rate\":\"0\",\"product_status\":\"Inactive\",\"productExpiryDate\":\"2025-04-18 2:25:00\",\"product_expiry_discount_rate\":\"50\",\"batch_no\":\"A00189\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 Edg/135.0.0.0', '1746145170'),
(543, 1, 'Super Admin', 'Logged Out', 'LOG OUT', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 Edg/135.0.0.0', '1746147703'),
(544, 14, 'Cashier', 'Logged In', 'LOGIN', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 Edg/135.0.0.0', '1746147706'),
(545, 14, 'Cashier', 'Logged Out', 'LOG OUT', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 Edg/135.0.0.0', '1746147881'),
(546, 1, 'Super Admin', 'Logged In', 'LOGIN', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 Edg/135.0.0.0', '1746147885'),
(547, 1, 'Super Admin', 'Logged Out', 'LOG OUT', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 Edg/135.0.0.0', '1746148147');

-- --------------------------------------------------------

--
-- Table structure for table `invoices`
--

CREATE TABLE `invoices` (
  `invoice_id` int(11) NOT NULL,
  `store_id` int(11) NOT NULL,
  `cashier_id` int(11) NOT NULL,
  `invoice_uuid` varchar(255) NOT NULL,
  `invoice_customer_name` varchar(255) DEFAULT NULL,
  `invoice_gross_total` double NOT NULL,
  `total_invoice_vat_rate` double NOT NULL,
  `total_invoice_vat` double NOT NULL,
  `total_invoice_discount_rate` double NOT NULL,
  `total_invoice_discount` double NOT NULL,
  `invoice_net_total` double NOT NULL,
  `invoice_paid_amount` double NOT NULL,
  `invoice_due` double NOT NULL,
  `invoice_payment_method` enum('Cash Payment','Card Payment','Bank Transfer','Others') NOT NULL,
  `invoice_order_timestamp` varchar(255) NOT NULL,
  `invoice_status` enum('Paid','Unpaid','Incomplete Payment') NOT NULL DEFAULT 'Paid'
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `invoices`
--

INSERT INTO `invoices` (`invoice_id`, `store_id`, `cashier_id`, `invoice_uuid`, `invoice_customer_name`, `invoice_gross_total`, `total_invoice_vat_rate`, `total_invoice_vat`, `total_invoice_discount_rate`, `total_invoice_discount`, `invoice_net_total`, `invoice_paid_amount`, `invoice_due`, `invoice_payment_method`, `invoice_order_timestamp`, `invoice_status`) VALUES
(56, 1, 1, 'SfJ3tt', '', 7.28, 0, 0, 50, 3.64, 3.64, 3.64, 0, 'Cash Payment', '1744993430', 'Paid'),
(57, 1, 1, 'DQF1vH', 'James earl', 7, 0, 0, 50, 3.5, 3.5, 3.5, 0, 'Cash Payment', '1744997406', 'Paid'),
(58, 1, 1, '3GkAu5', '', 15.98, 0, 0, 0, 0, 15.98, 15.98, 0, 'Cash Payment', '1745045144', 'Paid');

-- --------------------------------------------------------

--
-- Table structure for table `invoice_items`
--

CREATE TABLE `invoice_items` (
  `invoice_item_id` int(11) NOT NULL,
  `invoice_id` int(11) NOT NULL,
  `invoice_product_id` int(11) NOT NULL,
  `invoice_product_unit_cost_price` double NOT NULL,
  `invoice_product_unit_price` double NOT NULL,
  `invoice_product_qty` double NOT NULL,
  `invoice_product_vat` double NOT NULL,
  `invoice_product_discount` double NOT NULL,
  `invoice_remark` text DEFAULT NULL,
  `invoice_product_timestamp` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `invoice_items`
--

INSERT INTO `invoice_items` (`invoice_item_id`, `invoice_id`, `invoice_product_id`, `invoice_product_unit_cost_price`, `invoice_product_unit_price`, `invoice_product_qty`, `invoice_product_vat`, `invoice_product_discount`, `invoice_remark`, `invoice_product_timestamp`) VALUES
(67, 56, 19, 12.34, 7.28, 1, 0, 0, NULL, '1744993430'),
(68, 57, 17, 12, 7, 1, 0, 3.5, NULL, '1744997406'),
(69, 58, 19, 12.34, 7.99, 2, 0, 0, '50% discount applied on original price $15.98 due to near-expiry', '1745045144');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `product_id` int(11) NOT NULL,
  `store_id` int(11) NOT NULL,
  `product_category_id` int(11) NOT NULL,
  `product_brand_id` int(11) DEFAULT NULL,
  `product_name` varchar(255) NOT NULL,
  `product_slug` varchar(255) NOT NULL,
  `product_cost_price` double NOT NULL,
  `product_price` double NOT NULL,
  `product_stock` double NOT NULL,
  `product_measuring_units` varchar(255) NOT NULL,
  `product_reorder_level` double NOT NULL,
  `product_vat_rate` double NOT NULL,
  `product_expiry_discount_rate` float DEFAULT NULL,
  `product_expiry_date` timestamp NULL DEFAULT NULL,
  `product_discount_rate` double NOT NULL,
  `product_created_at` varchar(255) NOT NULL,
  `product_status` enum('Active','Inactive') NOT NULL,
  `price_reduced` tinyint(1) NOT NULL DEFAULT 0,
  `batch_no` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`product_id`, `store_id`, `product_category_id`, `product_brand_id`, `product_name`, `product_slug`, `product_cost_price`, `product_price`, `product_stock`, `product_measuring_units`, `product_reorder_level`, `product_vat_rate`, `product_expiry_discount_rate`, `product_expiry_date`, `product_discount_rate`, `product_created_at`, `product_status`, `price_reduced`, `batch_no`) VALUES
(16, 1, 8, 12, 'German Flutted Pumpkins', 'german-flutted-pumpkins', 15.99, 17.99, 0, 'kg', 3, 0, 50, '2025-03-16 11:00:00', 0, '1742120434', 'Inactive', 0, NULL),
(17, 1, 8, 12, 'Flutted Pumpkins', 'flutted-pumpkins', 12, 7, 12, 'Bunch', 2, 0, 50, '2025-04-18 17:30:00', 0, '1743988688', 'Active', 1, NULL),
(18, 1, 8, 12, 'Sherman Pumpkins', 'sherman-pumpkins', 13.56, 16.98, 0, 'Bunch', 4, 0, 50, '2025-04-18 01:25:00', 0, '1744981748', 'Inactive', 0, 'A00189'),
(19, 1, 8, 12, 'Sheheev Pumpkins', 'sheheev-pumpkins', 12.34, 7.99, 10, 'Bunch', 2, 0, 50, '2025-04-19 06:47:00', 0, '1744988411', 'Active', 1, 'A00190'),
(20, 1, 8, 12, 'Sherman Pumpkins', 'sherman-pumpkins', 12.36, 15.67, 24, 'Bunch', 12, 0, 20, '2025-05-23 11:15:00', 0, '1746144807', 'Active', 0, 'A0091');

-- --------------------------------------------------------

--
-- Table structure for table `product_brands`
--

CREATE TABLE `product_brands` (
  `product_brand_id` int(11) NOT NULL,
  `product_brand_name` varchar(255) NOT NULL,
  `product_brand_slug` varchar(255) NOT NULL,
  `product_brand_created_at` varchar(255) NOT NULL,
  `product_brand_status` enum('Active','Inactive') NOT NULL DEFAULT 'Active'
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `product_brands`
--

INSERT INTO `product_brands` (`product_brand_id`, `product_brand_name`, `product_brand_slug`, `product_brand_created_at`, `product_brand_status`) VALUES
(11, 'Hisense', 'hisense', '1742120292', 'Active'),
(12, 'German Pumpkins', 'german-pumpkins', '1742120336', 'Active');

-- --------------------------------------------------------

--
-- Table structure for table `product_categories`
--

CREATE TABLE `product_categories` (
  `product_category_id` int(11) NOT NULL,
  `product_category_name` varchar(255) NOT NULL,
  `product_category_slug` varchar(255) NOT NULL,
  `product_category_created_at` varchar(255) NOT NULL,
  `product_category_status` enum('Active','Inactive') NOT NULL DEFAULT 'Active'
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `product_categories`
--

INSERT INTO `product_categories` (`product_category_id`, `product_category_name`, `product_category_slug`, `product_category_created_at`, `product_category_status`) VALUES
(7, 'Electronics', 'electronics', '1742120282', 'Active'),
(8, 'Groceries', 'groceries', '1742120328', 'Active');

-- --------------------------------------------------------

--
-- Table structure for table `purchase_orders`
--

CREATE TABLE `purchase_orders` (
  `purchase_order_id` int(11) NOT NULL,
  `store_id` int(11) NOT NULL,
  `ordered_by` int(11) NOT NULL,
  `purchase_order_uuid` varchar(255) NOT NULL,
  `company_name` varchar(255) NOT NULL,
  `purchase_order_total_amount` double NOT NULL,
  `purchase_order_timestamp` varchar(255) NOT NULL,
  `purchase_order_status` enum('Paid','Unpaid','Incomplete Payment') NOT NULL DEFAULT 'Unpaid'
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `purchase_order_items`
--

CREATE TABLE `purchase_order_items` (
  `purchase_order_item_id` int(11) NOT NULL,
  `purchase_order_id` int(11) NOT NULL,
  `purchase_order_item` varchar(255) NOT NULL,
  `purchase_order_item_unit_price` double NOT NULL,
  `purchase_order_item_qty` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `stores`
--

CREATE TABLE `stores` (
  `store_id` int(11) NOT NULL,
  `store_name` varchar(255) NOT NULL,
  `store_slug` varchar(255) NOT NULL,
  `store_address` varchar(255) NOT NULL,
  `store_logo` varchar(255) NOT NULL,
  `store_created_at` varchar(255) NOT NULL,
  `store_status` enum('Active','Inactive') NOT NULL DEFAULT 'Active'
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `stores`
--

INSERT INTO `stores` (`store_id`, `store_name`, `store_slug`, `store_address`, `store_logo`, `store_created_at`, `store_status`) VALUES
(1, 'Main Shop', 'main-shop', '#1 Agulu Street Umuahia Abia State', '1741403334.jpg', '1728950400', 'Active');

-- --------------------------------------------------------

--
-- Table structure for table `store_settings`
--

CREATE TABLE `store_settings` (
  `setting_id` int(11) NOT NULL,
  `store_id` int(11) NOT NULL,
  `vat_rate` int(11) NOT NULL,
  `discount_rate` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `store_settings`
--

INSERT INTO `store_settings` (`setting_id`, `store_id`, `vat_rate`, `discount_rate`) VALUES
(1, 1, 0, 0),
(2, 1, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `transaction_id` int(11) NOT NULL,
  `store_id` int(11) NOT NULL,
  `entered_by` int(11) DEFAULT NULL COMMENT 'user id of staff who entered this record',
  `transaction_type` enum('Income','Expenditure') NOT NULL,
  `transaction_mode` enum('Cash Payment','Card Payment','Bank Transfer','Others') NOT NULL COMMENT 'Mode of entry',
  `transaction_title` varchar(255) NOT NULL,
  `transacted_by` varchar(255) NOT NULL,
  `transaction_recipient` varchar(255) NOT NULL,
  `transaction_remarks` text NOT NULL,
  `transaction_uuid` varchar(255) DEFAULT NULL,
  `transaction_timestamp` varchar(255) NOT NULL,
  `teller_no` varchar(255) DEFAULT NULL COMMENT 'Bank teller no if transaction was recorded manually',
  `bank` varchar(255) DEFAULT NULL,
  `expected_amount` int(11) NOT NULL,
  `transacted_amount` int(11) NOT NULL,
  `balance` int(11) NOT NULL,
  `transaction_status` enum('Completed','Uncompleted') NOT NULL DEFAULT 'Uncompleted'
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`transaction_id`, `store_id`, `entered_by`, `transaction_type`, `transaction_mode`, `transaction_title`, `transacted_by`, `transaction_recipient`, `transaction_remarks`, `transaction_uuid`, `transaction_timestamp`, `teller_no`, `bank`, `expected_amount`, `transacted_amount`, `balance`, `transaction_status`) VALUES
(72, 1, 1, 'Income', 'Cash Payment', 'Sales', 'Udo Uchechukwu', 'Protrack Integrated Systems', 'Income From Sales', 'SfJ3tt', '1744993430', NULL, NULL, 4, 4, 0, 'Completed'),
(73, 1, 1, 'Income', 'Cash Payment', 'Sales', 'Udo Uchechukwu', 'Protrack Integrated Systems', 'Income From Sales', 'DQF1vH', '1744997406', NULL, NULL, 4, 4, 0, 'Completed'),
(74, 1, 1, 'Income', 'Cash Payment', 'Sales', 'Udo Uchechukwu', 'Protrack Integrated Systems', 'Income From Sales', '3GkAu5', '1745045144', NULL, NULL, 16, 16, 0, 'Completed');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `store_id` int(11) DEFAULT NULL,
  `user_firstname` varchar(255) NOT NULL,
  `user_lastname` varchar(255) NOT NULL,
  `user_gender` enum('Male','Female') NOT NULL,
  `user_email` varchar(255) NOT NULL,
  `user_phone` varchar(255) NOT NULL,
  `user_image_filename` varchar(255) DEFAULT NULL,
  `user_role` enum('Admin','Cashier','Super Admin') NOT NULL DEFAULT 'Cashier',
  `plain_password` varchar(255) NOT NULL,
  `enc_password` varchar(255) NOT NULL,
  `user_created_at` varchar(255) NOT NULL,
  `write_rights` enum('Granted','Denied') NOT NULL DEFAULT 'Granted',
  `update_rights` enum('Granted','Denied') NOT NULL DEFAULT 'Granted',
  `delete_rights` enum('Granted','Denied') NOT NULL DEFAULT 'Granted',
  `login_rights` enum('Granted','Denied') NOT NULL DEFAULT 'Granted',
  `last_salt` varchar(255) DEFAULT NULL,
  `last_salt_timestamp` varchar(255) DEFAULT NULL,
  `last_login_timestamp` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `store_id`, `user_firstname`, `user_lastname`, `user_gender`, `user_email`, `user_phone`, `user_image_filename`, `user_role`, `plain_password`, `enc_password`, `user_created_at`, `write_rights`, `update_rights`, `delete_rights`, `login_rights`, `last_salt`, `last_salt_timestamp`, `last_login_timestamp`) VALUES
(1, NULL, 'Uchechukwu', 'Udo', 'Male', 'superadmin@gmail.com', '08065198300', NULL, 'Super Admin', 'protrack2025', 'U2FsdGVkX1+RA3eXb3lLfTBE2I3KRL+Wh5AQG3NgyBI=', '1730449999', 'Granted', 'Granted', 'Granted', 'Granted', NULL, NULL, '1746147884'),
(13, 1, 'John', 'Wayne', 'Male', 'wayne@gmail.com', '09089098909', NULL, 'Admin', 'protrack2025', 'U2FsdGVkX19HTJeh4J7kad4DwUXTIPfUeyDjyB29gy0=', '1741402783', 'Granted', 'Granted', 'Granted', 'Granted', NULL, NULL, '1742116098'),
(14, 1, 'John', 'Enwere', 'Male', 'enwere@gmail.com', '09089099098', NULL, 'Cashier', 'protrack2025', 'U2FsdGVkX18KOZiKZBLzCKETTH4FDB+/gK0rkZyELUs=', '1743289751', 'Granted', 'Granted', 'Granted', 'Granted', NULL, NULL, '1746147706');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activity_log`
--
ALTER TABLE `activity_log`
  ADD PRIMARY KEY (`activity_id`),
  ADD KEY `staff_id` (`user_id`);

--
-- Indexes for table `invoices`
--
ALTER TABLE `invoices`
  ADD PRIMARY KEY (`invoice_id`),
  ADD KEY `shop_id` (`store_id`),
  ADD KEY `cashier_id` (`cashier_id`);

--
-- Indexes for table `invoice_items`
--
ALTER TABLE `invoice_items`
  ADD PRIMARY KEY (`invoice_item_id`),
  ADD KEY `invoice_id` (`invoice_id`),
  ADD KEY `invoice_product_id` (`invoice_product_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`product_id`),
  ADD KEY `product_category_id` (`product_category_id`),
  ADD KEY `product_brand_id` (`product_brand_id`),
  ADD KEY `shop_id` (`store_id`);

--
-- Indexes for table `product_brands`
--
ALTER TABLE `product_brands`
  ADD PRIMARY KEY (`product_brand_id`);

--
-- Indexes for table `product_categories`
--
ALTER TABLE `product_categories`
  ADD PRIMARY KEY (`product_category_id`),
  ADD UNIQUE KEY `slug` (`product_category_slug`),
  ADD UNIQUE KEY `name` (`product_category_name`);

--
-- Indexes for table `purchase_orders`
--
ALTER TABLE `purchase_orders`
  ADD PRIMARY KEY (`purchase_order_id`),
  ADD KEY `shopi_id` (`store_id`),
  ADD KEY `ordered_by` (`ordered_by`);

--
-- Indexes for table `purchase_order_items`
--
ALTER TABLE `purchase_order_items`
  ADD PRIMARY KEY (`purchase_order_item_id`),
  ADD KEY `purchase_order_id` (`purchase_order_id`);

--
-- Indexes for table `stores`
--
ALTER TABLE `stores`
  ADD PRIMARY KEY (`store_id`),
  ADD UNIQUE KEY `shop_slug` (`store_slug`);

--
-- Indexes for table `store_settings`
--
ALTER TABLE `store_settings`
  ADD PRIMARY KEY (`setting_id`),
  ADD KEY `store_id` (`store_id`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`transaction_id`),
  ADD UNIQUE KEY `transaction_uuid` (`transaction_uuid`),
  ADD KEY `entered_by` (`entered_by`),
  ADD KEY `shop_id` (`store_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD KEY `shop_id` (`store_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activity_log`
--
ALTER TABLE `activity_log`
  MODIFY `activity_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=548;

--
-- AUTO_INCREMENT for table `invoices`
--
ALTER TABLE `invoices`
  MODIFY `invoice_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=59;

--
-- AUTO_INCREMENT for table `invoice_items`
--
ALTER TABLE `invoice_items`
  MODIFY `invoice_item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=70;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `product_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `product_brands`
--
ALTER TABLE `product_brands`
  MODIFY `product_brand_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `product_categories`
--
ALTER TABLE `product_categories`
  MODIFY `product_category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `purchase_orders`
--
ALTER TABLE `purchase_orders`
  MODIFY `purchase_order_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `purchase_order_items`
--
ALTER TABLE `purchase_order_items`
  MODIFY `purchase_order_item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `stores`
--
ALTER TABLE `stores`
  MODIFY `store_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `store_settings`
--
ALTER TABLE `store_settings`
  MODIFY `setting_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `transaction_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=75;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `invoices`
--
ALTER TABLE `invoices`
  ADD CONSTRAINT `invoices_ibfk_1` FOREIGN KEY (`store_id`) REFERENCES `stores` (`store_id`),
  ADD CONSTRAINT `invoices_ibfk_2` FOREIGN KEY (`cashier_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `invoice_items`
--
ALTER TABLE `invoice_items`
  ADD CONSTRAINT `invoice_items_ibfk_1` FOREIGN KEY (`invoice_id`) REFERENCES `invoices` (`invoice_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `invoice_items_ibfk_2` FOREIGN KEY (`invoice_product_id`) REFERENCES `products` (`product_id`);

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`product_category_id`) REFERENCES `product_categories` (`product_category_id`),
  ADD CONSTRAINT `products_ibfk_2` FOREIGN KEY (`product_brand_id`) REFERENCES `product_brands` (`product_brand_id`),
  ADD CONSTRAINT `products_ibfk_3` FOREIGN KEY (`store_id`) REFERENCES `stores` (`store_id`);

--
-- Constraints for table `purchase_orders`
--
ALTER TABLE `purchase_orders`
  ADD CONSTRAINT `purchase_orders_ibfk_1` FOREIGN KEY (`ordered_by`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `purchase_order_items`
--
ALTER TABLE `purchase_order_items`
  ADD CONSTRAINT `purchase_order_items_ibfk_1` FOREIGN KEY (`purchase_order_id`) REFERENCES `purchase_orders` (`purchase_order_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `store_settings`
--
ALTER TABLE `store_settings`
  ADD CONSTRAINT `store_settings_ibfk_1` FOREIGN KEY (`store_id`) REFERENCES `stores` (`store_id`);

--
-- Constraints for table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_ibfk_2` FOREIGN KEY (`entered_by`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`store_id`) REFERENCES `stores` (`store_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
