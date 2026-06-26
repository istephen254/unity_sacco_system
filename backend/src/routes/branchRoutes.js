const express = require("express");
const router = express.Router();
const { verifyToken, requireRole } = require("../middleware/authMiddleware");
const { getAllBranches, createBranch } = require("../controllers/branchController");

router.get("/", verifyToken, getAllBranches);
router.post("/", verifyToken, requireRole("ADMIN"), createBranch);

module.exports = router;