const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authenticateToken } = require("../middleware/auth");
const uploadProfile = require("../middleware/uploadProfile");

router.get("/profile", authenticateToken, userController.getProfileInfo);
router.put(
  "/profile",
  authenticateToken,
  uploadProfile.single("profilePicture"),
  userController.updateProfile
);

module.exports = router;
