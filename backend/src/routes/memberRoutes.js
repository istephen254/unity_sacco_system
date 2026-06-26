const express = require("express");
const router = express.Router();

const {
  verifyToken,
  requireRole,
} = require("../middleware/authMiddleware");

const {
  getAllMembers,
  getMemberById,
  getMemberProfile,
  getMemberSummary,
  getMemberSavings,
  getMemberDeposits,
  getMemberLoans,
  getMemberTransactions,
  createMember,
  updateMember,
} = require("../controllers/memberController");

//////////////////////////////////////////////////
// MEMBER SELF SERVICE
//////////////////////////////////////////////////

router.get(
  "/me/summary",
  verifyToken,
  requireRole("MEMBER"),
  getMemberSummary
);

router.get(
  "/me/savings",
  verifyToken,
  requireRole("MEMBER"),
  getMemberSavings
);

router.get(
  "/me/deposits",
  verifyToken,
  requireRole("MEMBER"),
  getMemberDeposits
);

router.get(
  "/me/loans",
  verifyToken,
  requireRole("MEMBER"),
  getMemberLoans
);

router.get(
  "/me/transactions",
  verifyToken,
  requireRole("MEMBER"),
  getMemberTransactions
);

//////////////////////////////////////////////////
// MEMBER PROFILE
//////////////////////////////////////////////////

router.get(
  "/profile",
  verifyToken,
  requireRole("MEMBER"),
  getMemberProfile
);

//////////////////////////////////////////////////
// STAFF ROUTES
//////////////////////////////////////////////////

router.get(
  "/",
  verifyToken,
  requireRole("ADMIN", "MANAGER", "TELLER"),
  getAllMembers
);

router.get(
  "/:id",
  verifyToken,
  requireRole("ADMIN", "MANAGER", "TELLER"),
  getMemberById
);

router.post(
  "/",
  verifyToken,
  requireRole("ADMIN", "MANAGER"),
  createMember
);

router.put(
  "/:id",
  verifyToken,
  requireRole("ADMIN", "MANAGER"),
  updateMember
);

module.exports = router;