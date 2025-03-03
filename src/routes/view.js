const express = require("express");
const router = express.Router();
const viewController = require("../controllers/viewController");

router.get("/", viewController.home);
router.get("/login", viewController.login);

/* SUPER ADMIN */
router.get("/sa/dashboard", viewController.saHome);
router.get("/sa/stores", viewController.saStores);
router.get("/sa/users", viewController.saUsers);

/* ADMIN */

/* CASHIER */

module.exports = router;
