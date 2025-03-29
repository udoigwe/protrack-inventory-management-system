const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController");
const checkAuth = require("../middleware/checkAuth");

/* transcations */
router.post(
	"/transactions",
	checkAuth.isAdminOrSuperAdminCheck,
	transactionController.create
);
router.get(
	"/transactions",
	checkAuth.isAdminOrSuperAdminCheck,
	transactionController.findAll
);
router.get(
	"/transactions/:id",
	checkAuth.isAdminOrSuperAdminCheck,
	transactionController.findOne
);
router.get(
	"/transactions/data-table/fetch",
	checkAuth.isAdminOrSuperAdminCheck,
	transactionController.fetchForDataTable
);
router.put(
	"/transactions/:id",
	checkAuth.isAdminOrSuperAdminCheck,
	transactionController.update
);
router.delete(
	"/transactions/:id",
	checkAuth.isAdminOrSuperAdminCheck,
	transactionController.delete
);

module.exports = router;
