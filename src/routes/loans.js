const express = require("express");
const router = express.Router();
const loanController = require("../controllers/loanController");
const { authenticateToken } = require("../middleware/auth");

router.post("/", authenticateToken, loanController.createLoan);
router.get("/", authenticateToken, loanController.getUserLoans);
router.delete("/:loanId", authenticateToken, loanController.deleteLoan);

module.exports = router;
