const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");
const { authenticateToken, authorizeAdmin } = require("../middleware/auth");
const upload = require("../middleware/upload");

router.post(
  "/",
  authenticateToken,
  authorizeAdmin,
  upload.single("coverImage"),
  bookController.createBook
);
router.get("/", authenticateToken, bookController.getAllBooks);
router.get("/:id", authenticateToken, bookController.getBookById);
router.put(
  "/:id",
  authenticateToken,
  authorizeAdmin,
  upload.single("coverImage"),
  bookController.updateBook
);
router.delete(
  "/:id",
  authenticateToken,
  authorizeAdmin,
  bookController.deleteBook
);

module.exports = router;
