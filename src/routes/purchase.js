const express = require("express");
const router = express.Router();
const purchaseController = require("../controllers/purchaseController");
const checkAuth = require("../middleware/checkAuth");

/* purchases */
router.post(
	"/purchases",
	checkAuth.isAdminOrSuperAdminCheck,
	purchaseController.create
);
router.get(
	"/purchases",
	checkAuth.isAdminOrSuperAdminCheck,
	purchaseController.findAll
);
router.get(
	"/purchases/:id",
	checkAuth.isAdminOrSuperAdminCheck,
	purchaseController.findOne
);
router.get(
	"/purchases/data-table/fetch",
	checkAuth.isAdminOrSuperAdminCheck,
	purchaseController.fetchForDataTable
);
router.put(
	"/purchases/:id",
	checkAuth.isAdminOrSuperAdminCheck,
	purchaseController.update
);
router.delete(
	"/purchases/:id",
	checkAuth.isAdminOrSuperAdminCheck,
	purchaseController.delete
);

module.exports = router;
