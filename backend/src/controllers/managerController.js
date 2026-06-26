const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

//////////////////////////////////////////////////
// 👥 MEMBERS
//////////////////////////////////////////////////

// Get all ACTIVE members
exports.getMembers = async (req, res) => {
  try {
    const members = await prisma.member.findMany({
      where: { status: "ACTIVE" },
      orderBy: { createdAt: "desc" },
    });

    res.json({ success: true, data: members });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get PENDING members
exports.getPendingMembers = async (req, res) => {
  try {
    const members = await prisma.member.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: "desc" },
    });

    res.json({ success: true, data: members });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

//////////////////////////////////////////////////
// CREATE MEMBER (FIXED)
//////////////////////////////////////////////////

exports.createMember = async (req, res) => {
  try {
    const { memberNumber, nationalId, phone, address, userId, branchId } = req.body;

    // Validation (important)
    if (!memberNumber || !nationalId || !phone || !userId) {
      return res.status(400).json({
        success: false,
        message: "memberNumber, nationalId, phone, and userId are required",
      });
    }

    const member = await prisma.member.create({
      data: {
        memberNumber,
        nationalId,
        phone,
        address,
        userId: Number(userId),
        branchId: branchId ? Number(branchId) : null,
        status: "PENDING",
      },
    });

    res.json({ success: true, data: member });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

//////////////////////////////////////////////////
// APPROVE MEMBER
//////////////////////////////////////////////////

exports.approveMember = async (req, res) => {
  try {
    const { id } = req.params;

    const member = await prisma.member.update({
      where: { id: Number(id) },
      data: { status: "ACTIVE" },
    });

    res.json({ success: true, data: member });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

//////////////////////////////////////////////////
// DECLINE MEMBER
//////////////////////////////////////////////////

exports.declineMember = async (req, res) => {
  try {
    const { id } = req.params;

    const member = await prisma.member.update({
      where: { id: Number(id) },
      data: { status: "DECLINED" },
    });

    res.json({ success: true, data: member });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

//////////////////////////////////////////////////
// 💳 LOANS
//////////////////////////////////////////////////

exports.getLoans = async (req, res) => {
  try {
    const loans = await prisma.loan.findMany({
      include: { member: true },
      orderBy: { createdAt: "desc" },
    });

    res.json({ success: true, data: loans });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.approveLoan = async (req, res) => {
  try {
    const { id } = req.params;

    const loan = await prisma.loan.update({
      where: { id: Number(id) },
      data: { status: "APPROVED" },
    });

    res.json({ success: true, data: loan });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.declineLoan = async (req, res) => {
  try {
    const { id } = req.params;

    const loan = await prisma.loan.update({
      where: { id: Number(id) },
      data: { status: "DECLINED" },
    });

    res.json({ success: true, data: loan });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

//////////////////////////////////////////////////
// 💰 SAVINGS
//////////////////////////////////////////////////

exports.getSavings = async (req, res) => {
  try {
    const savings = await prisma.saving.findMany({
      include: { member: true },
      orderBy: { createdAt: "desc" },
    });

    const total = await prisma.saving.aggregate({
      _sum: { balance: true },
    });

    res.json({
      success: true,
      data: savings,
      total: total._sum.balance || 0,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

//////////////////////////////////////////////////
// 📊 REPORTS
//////////////////////////////////////////////////

exports.getReports = async (req, res) => {
  try {
    const members = await prisma.member.count();
    const loans = await prisma.loan.count();

    const savings = await prisma.saving.aggregate({
      _sum: { balance: true },
    });

    const activeLoans = await prisma.loan.count({
      where: { status: "APPROVED" },
    });

    res.json({
      success: true,
      data: {
        members,
        loans,
        savings: savings._sum.balance || 0,
        activeLoans,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

//////////////////////////////////////////////////
// ⚙️ SETTINGS (TEMP)
//////////////////////////////////////////////////

let systemSettings = {
  interestRate: 10,
  loanLimit: 50000,
};

exports.getSettings = async (req, res) => {
  res.json({ success: true, data: systemSettings });
};

exports.updateSettings = async (req, res) => {
  try {
    systemSettings = {
      ...systemSettings,
      ...req.body,
    };

    res.json({ success: true, data: systemSettings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};