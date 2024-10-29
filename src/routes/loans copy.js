const express = require("express");
const router = express.Router();
const loanController = require("../controllers/loanController");
const { authenticateToken, authorizeAdmin } = require("../middleware/auth");

router.get("/:id", authenticateToken, loanController.getLoanDetails);
router.post("/", authenticateToken, loanController.createLoan);
router.get("/", authenticateToken, loanController.getUserLoans);
router.delete("/:loanId", authenticateToken, loanController.deleteLoan);
router.get(
  "/all",
  authenticateToken,
  authorizeAdmin,
  loanController.getAllLoans
);
router.get("/count", authenticateToken, loanController.getLoanCount);
router.get("/monthly", authenticateToken, loanController.getMonthlyLoanData);
module.exports = router;
