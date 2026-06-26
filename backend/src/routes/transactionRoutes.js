const express = require("express");
const router = express.Router();
const { verifyToken, requireRole } = require("../middleware/authMiddleware");
const { getMyTransactions, getAllTransactions } = require("../controllers/transactionController");

router.get("/my", verifyToken, requireRole("MEMBER"), getMyTransactions);
router.get("/", verifyToken, requireRole("ADMIN", "MANAGER", "TELLER"), getAllTransactions);

module.exports = router;