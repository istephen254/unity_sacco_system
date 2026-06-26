const express = require("express");
const router = express.Router();
const { verifyToken, requireRole } = require("../middleware/authMiddleware");
const { makeDeposit, getMemberDeposits, getAllDeposits } = require("../controllers/depositController");

// Teller / Admin — make deposit for a member
router.post("/", verifyToken, requireRole("ADMIN", "MANAGER", "TELLER"), makeDeposit);

// Admin — see all deposits
router.get("/", verifyToken, requireRole("ADMIN", "MANAGER"), getAllDeposits);

// Member sees own deposits
router.get("/my", verifyToken, requireRole("MEMBER"), getMemberDeposits);

module.exports = router;