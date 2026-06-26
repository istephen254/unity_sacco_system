const express = require("express");
const router = express.Router();

const managerController = require("../controllers/managerController");

//////////////////////////////////////////////////
// 👥 MEMBERS
//////////////////////////////////////////////////

router.get("/members", managerController.getMembers);
router.get("/members/pending", managerController.getPendingMembers);
router.post("/members", managerController.createMember);
router.put("/members/:id/approve", managerController.approveMember);
router.put("/members/:id/decline", managerController.declineMember);

//////////////////////////////////////////////////
// 💳 LOANS
//////////////////////////////////////////////////

router.get("/loans", managerController.getLoans);
router.put("/loans/:id/approve", managerController.approveLoan);
router.put("/loans/:id/decline", managerController.declineLoan);

//////////////////////////////////////////////////
// 💰 SAVINGS
//////////////////////////////////////////////////

router.get("/savings", managerController.getSavings);

//////////////////////////////////////////////////
// 📊 REPORTS
//////////////////////////////////////////////////

router.get("/reports", managerController.getReports);

//////////////////////////////////////////////////
// ⚙️ SETTINGS
//////////////////////////////////////////////////

router.get("/settings", managerController.getSettings);
router.put("/settings", managerController.updateSettings);

module.exports = router;