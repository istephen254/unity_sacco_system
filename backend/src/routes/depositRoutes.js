const express = require("express");
const router = express.Router();

const { verifyToken, requireRole } = require("../middleware/authMiddleware");

const {
  makeDeposit,
  getMemberDeposits,
  getAllDeposits,
  getTellerDeposits,
} = require("../controllers/depositController");

//////////////////////////////////////////////////
// 💰 CREATE DEPOSIT (TELLER / ADMIN / MANAGER)
//////////////////////////////////////////////////
router.post(
  "/",
  verifyToken,
  requireRole("ADMIN", "MANAGER", "TELLER"),
  makeDeposit
);

//////////////////////////////////////////////////
// 📋 GET ALL DEPOSITS (ADMIN / MANAGER ONLY)
//////////////////////////////////////////////////
router.get(
  "/",
  verifyToken,
  requireRole("ADMIN", "MANAGER"),
  getAllDeposits
);

//////////////////////////////////////////////////
// 👨‍💼 TELLER DEPOSITS
//////////////////////////////////////////////////
router.get(
  "/teller",
  verifyToken,
  requireRole("TELLER"),
  getTellerDeposits
);

//////////////////////////////////////////////////
// 👤 MEMBER DEPOSITS
//////////////////////////////////////////////////
router.get(
  "/my",
  verifyToken,
  requireRole("MEMBER"),
  getMemberDeposits
);

module.exports = router;