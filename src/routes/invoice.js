const express = require("express");
const router = express.Router();
const invoiceController = require("../controllers/invoiceController");
const checkAuth = require("../middleware/checkAuth");

/* Invoices */
router.post("/invoices", checkAuth.verifyToken, invoiceController.create);
router.get("/invoices", checkAuth.verifyToken, invoiceController.findAll);
router.get("/invoices/:id", checkAuth.verifyToken, invoiceController.findOne);
router.get(
	"/invoices/data-table/fetch",
	checkAuth.verifyToken,
	invoiceController.fetchForDataTable
);
router.delete("/invoices/:id", checkAuth.verifyToken, invoiceController.delete);

module.exports = router;
