const express = require("express");
const router = express.Router();
const { verifyToken, requireRole } = require("../middleware/authMiddleware");
const { getDashboardStats } = require("../controllers/adminController");

router.get("/stats", verifyToken, requireRole("ADMIN", "MANAGER"), getDashboardStats);

module.exports = router;