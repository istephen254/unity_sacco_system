const express = require("express");
const router = express.Router();
const { verifyToken, requireRole } = require("../middleware/authMiddleware");
const {
  getAllLoans,
  getLoansByMember,
  applyLoan,
  approveLoan,
  rejectLoan,
  repayLoan,
} = require("../controllers/loanController");

// Admin / Manager — see all loans
router.get("/", verifyToken, requireRole("ADMIN", "MANAGER", "TELLER"), getAllLoans);

// Member sees own loans
router.get("/my", verifyToken, requireRole("MEMBER"), getLoansByMember);

// Member applies
router.post("/apply", verifyToken, requireRole("MEMBER"), applyLoan);

// Manager / Admin approve
router.patch("/:id/approve", verifyToken, requireRole("ADMIN", "MANAGER"), approveLoan);

// Manager / Admin reject
router.patch("/:id/reject", verifyToken, requireRole("ADMIN", "MANAGER"), rejectLoan);

// Teller / Admin repay
router.post("/:id/repay", verifyToken, requireRole("ADMIN", "MANAGER", "TELLER"), repayLoan);

module.exports = router;