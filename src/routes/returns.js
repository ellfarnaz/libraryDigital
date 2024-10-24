const express = require("express");
const router = express.Router();
const returnController = require("../controllers/returnController");
const { authenticateToken } = require("../middleware/auth");

router.post("/", authenticateToken, returnController.createReturn);

module.exports = router;
