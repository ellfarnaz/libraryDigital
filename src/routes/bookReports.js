const express = require("express");
const router = express.Router();
const bookReportController = require("../controllers/bookReportController");
const { authenticateToken } = require("../middleware/auth");

router.post("/", authenticateToken, bookReportController.createReport);
router.post("/", bookReportController.createReport);
router.get("/", bookReportController.getAllReports);
router.get("/:id", bookReportController.getReportById);
router.get("/user/:userId", bookReportController.getReportsByUser);
router.get("/type/:reportType", bookReportController.getReportsByType);
router.put("/:id", bookReportController.updateReport);
router.delete("/:id", bookReportController.deleteReport);
router.put("/:id/process", bookReportController.processReport);

module.exports = router;
