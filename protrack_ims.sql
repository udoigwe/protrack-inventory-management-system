-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 27, 2025 at 08:23 PM
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
  `invoice_product_timestamp` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

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
  `price_reduced` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

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
(1, 'Main Shop', 'main-shop', '#1 Agulu Street Umuahia Abia State', '1664198178.jpg', '1728950400', 'Active');

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
(1, NULL, 'Uchechukwu', 'Udo', 'Male', 'udoigweuchechukwu@gmail.com', '08065198300', NULL, 'Super Admin', 'inventora2022', 'U2FsdGVkX19YeGjZstfSQRjHdCPM69B9mAgvEIHm4zQ=', '1730449999', 'Granted', 'Granted', 'Granted', 'Granted', NULL, NULL, '1732121163');

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
  MODIFY `activity_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=457;

--
-- AUTO_INCREMENT for table `invoices`
--
ALTER TABLE `invoices`
  MODIFY `invoice_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=56;

--
-- AUTO_INCREMENT for table `invoice_items`
--
ALTER TABLE `invoice_items`
  MODIFY `invoice_item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=67;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `product_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `product_brands`
--
ALTER TABLE `product_brands`
  MODIFY `product_brand_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `product_categories`
--
ALTER TABLE `product_categories`
  MODIFY `product_category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

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
  MODIFY `transaction_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=72;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

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
