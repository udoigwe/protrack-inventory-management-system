const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const checkAuth = require("../middleware/checkAuth");

router.post(
  "/users",
  checkAuth.isAdminOrSuperAdminCheck,
  userController.create
);
router.get(
  "/users/data-table/fetch",
  checkAuth.isAdminOrSuperAdminCheck,
  userController.fetchForDataTable
);
router.get("/users/:id", userController.findOne);
router.put(
  "/users/:id",
  checkAuth.isAdminOrSuperAdminCheck,
  userController.update
);
router.delete(
  "/users/:id",
  checkAuth.isAdminOrSuperAdminCheck,
  userController.delete
);
router.get("/users", userController.findAll);
router.get(
  "/user-log/:id",
  checkAuth.isAdminOrSuperAdminCheck,
  userController.findOneActivity
);
router.get(
  "/user-log/datatable/load",
  checkAuth.isAdminOrSuperAdminCheck,
  userController.fetchUserActivitiesForDatatable
);

module.exports = router;
