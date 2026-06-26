const express = require("express");
const router = express.Router();

const {
  getStats,
  getRecentMembers,
  getPendingLoans,
} = require("../controllers/dashboardController");

//////////////////////////////////////////////////
// 📊 DASHBOARD ENDPOINTS
//////////////////////////////////////////////////

// GET dashboard statistics
router.get("/stats", getStats);

// GET recent members
router.get("/recent-members", getRecentMembers);

// GET pending loans
router.get("/pending-loans", getPendingLoans);

module.exports = router;