const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const bookController = require("../controllers/bookController");
const { authenticateToken, authorizeAdmin } = require("../middleware/auth");
const upload = require("../middleware/upload");

// User management routes
router.get(
  "/users",
  authenticateToken,
  authorizeAdmin,
  adminController.getAllUsers
);
router.get(
  "/users/:id",
  authenticateToken,
  authorizeAdmin,
  adminController.getUserById
);
router.put(
  "/users/:id",
  authenticateToken,
  authorizeAdmin,
  adminController.updateUser
);
router.delete(
  "/users/:id",
  authenticateToken,
  authorizeAdmin,
  adminController.deleteUser
);

// Book management routes
router.post(
  "/books",
  authenticateToken,
  authorizeAdmin,
  upload.single("coverImage"),
  bookController.createBook
);
router.put(
  "/books/:id",
  authenticateToken,
  authorizeAdmin,
  upload.single("coverImage"),
  bookController.updateBook
);
router.delete(
  "/books/:id",
  authenticateToken,
  authorizeAdmin,
  bookController.deleteBook
);

module.exports = router;
