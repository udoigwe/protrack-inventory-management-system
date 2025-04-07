const express = require("express");
const router = express.Router();
const viewController = require("../controllers/viewController");

router.get("/", viewController.home);
router.get("/login", viewController.login);

/* SUPER ADMIN */
router.get("/sa/dashboard", viewController.saHome);
router.get("/sa/stores", viewController.saStores);
router.get("/sa/users", viewController.saUsers);
router.get("/sa/activity-log", viewController.saActivityLog);
router.get("/sa/categories", viewController.saCategories);
router.get("/sa/brands", viewController.saBrands);
router.get("/sa/products", viewController.saProducts);
router.get("/sa/sales", viewController.saSales);
router.get("/sa/purchases", viewController.saPurchases);
router.get("/sa/transactions", viewController.saTransactions);
router.get("/sa/account", viewController.saAccount);

/* ADMIN */
router.get("/admin/dashboard", viewController.adminHome);
router.get("/admin/users", viewController.adminUsers);
router.get("/admin/activity-log", viewController.adminActivityLog);
router.get("/admin/products", viewController.adminProducts);
router.get("/admin/sales", viewController.adminSales);
router.get("/admin/purchases", viewController.adminPurchases);
router.get("/admin/transactions", viewController.adminTransactions);
router.get("/admin/account", viewController.adminAccount);

/* CASHIER */
router.get("/cashier/dashboard", viewController.cashierHome);
router.get("/cashier/products", viewController.cashierProducts);
router.get("/cashier/sales", viewController.cashierSales);
router.get("/cashier/account", viewController.cashierAccount);

module.exports = router;
