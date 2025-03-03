const express = require("express");
const router = express.Router();
const storeController = require("../controllers/storeController");
const checkAuth = require("../middleware/checkAuth");

router.post("/stores", checkAuth.isSuperAdminCheck, storeController.create);
router.get("/stores", checkAuth.verifyToken, storeController.findAll);
router.get("/stores/:id", checkAuth.verifyToken, storeController.findOne);
router.get("/stores/data-table/fetch", storeController.fetchForDataTable);
router.put("/stores/:id", checkAuth.isSuperAdminCheck, storeController.update);
router.delete(
  "/stores/:id",
  checkAuth.isSuperAdminCheck,
  storeController.delete
);

module.exports = router;
