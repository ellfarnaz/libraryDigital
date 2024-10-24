const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const {
  validateRegistration,
  validateLogin,
  validateAdminLogin,
} = require("../middleware/validation");

router.post("/register", validateRegistration, authController.register);
router.post("/login", validateLogin, authController.login);
router.post("/admin/login", validateAdminLogin, authController.adminLogin);

module.exports = router;
