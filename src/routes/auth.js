const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const checkAuth = require("../middleware/checkAuth");

router.post("/sign-up", authController.signUp);
router.post("/login", authController.login);
router.get("/logout", checkAuth.verifyToken, authController.logout);
router.put(
	"/account-update",
	checkAuth.verifyToken,
	authController.updateAccount
);
router.post(
	"/change-password",
	checkAuth.verifyToken,
	authController.updatePassword
);
router.post("/password-recovery", authController.sendResetLink);
router.get("/validate-reset-link", authController.validateResetSalt);
router.get("/verify-email", authController.verifyEmail);
router.post("/reset-password", authController.resetPassword);
router.get("/dashboard", checkAuth.verifyToken, authController.dashboard);

module.exports = router;
