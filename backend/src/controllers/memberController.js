const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const MEMBER_INCLUDE = {
  user: {
    select: {
      fullName: true,
      email: true,
      role: true,
    },
  },
  branch: {
    select: {
      name: true,
    },
  },
  savings: true,
  loans: true,
};

//////////////////////////////////////////////////
// 📋 GET ALL MEMBERS
//////////////////////////////////////////////////
async function getAllMembers(req, res) {
  try {
    const members = await prisma.member.findMany({
      include: MEMBER_INCLUDE,
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json({ members });
  } catch (err) {
    console.error("❌ GET ALL MEMBERS:", err);
    return res.status(500).json({
      message: "Server error",
    });
  }
}

//////////////////////////////////////////////////
// 🔍 GET SINGLE MEMBER
//////////////////////////////////////////////////
async function getMemberById(req, res) {
  try {
    const member = await prisma.member.findUnique({
      where: {
        id: req.params.id,
      },
      include: MEMBER_INCLUDE,
    });

    if (!member) {
      return res.status(404).json({
        message: "Member not found",
      });
    }

    return res.json({ member });
  } catch (err) {
    console.error("❌ GET MEMBER BY ID:", err);
    return res.status(500).json({
      message: "Server error",
    });
  }
}

//////////////////////////////////////////////////
// 👤 MEMBER PROFILE
//////////////////////////////////////////////////
async function getMemberProfile(req, res) {
  try {
    const member = await prisma.member.findUnique({
      where: {
        userId: req.user.id,
      },
      include: {
        ...MEMBER_INCLUDE,
        transactions: {
          orderBy: {
            createdAt: "desc",
          },
          take: 10,
        },
      },
    });

    if (!member) {
      return res.status(404).json({
        message: "Member profile not found",
      });
    }

    return res.json({ member });
  } catch (err) {
    console.error("❌ GET MEMBER PROFILE:", err);
    return res.status(500).json({
      message: "Server error",
    });
  }
}

//////////////////////////////////////////////////
// 📊 MEMBER SUMMARY
//////////////////////////////////////////////////
async function getMemberSummary(req, res) {
  try {
    const member = await prisma.member.findUnique({
      where: {
        userId: req.user.id,
      },
      include: {
        savings: true,
        loans: true,
        transactions: {
          orderBy: {
            createdAt: "desc",
          },
          take: 10,
        },
      },
    });

    if (!member) {
      return res.status(404).json({
        message: "Member not found",
      });
    }

    const savingsBalance = member.savings?.balance || 0;

    const activeLoans = member.loans.filter(
      (loan) => loan.status === "ACTIVE"
    );

    const loanBalance = activeLoans.reduce(
      (sum, loan) => sum + Number(loan.balance || 0),
      0
    );

    return res.json({
      memberNumber: member.memberNumber,
      savingsBalance,
      loanBalance,
      shareCapital: member.shareCapital,
      activeLoans: activeLoans.length,
      recentTransactions: member.transactions,
    });
  } catch (err) {
    console.error("❌ MEMBER SUMMARY:", err);
    return res.status(500).json({
      message: "Server error",
    });
  }
}

//////////////////////////////////////////////////
// 💰 MEMBER SAVINGS
//////////////////////////////////////////////////
async function getMemberSavings(req, res) {
  try {
    const member = await prisma.member.findUnique({
      where: {
        userId: req.user.id,
      },
      include: {
        savings: true,
      },
    });

    if (!member) {
      return res.status(404).json({
        message: "Member not found",
      });
    }

    return res.json(member.savings);
  } catch (err) {
    console.error("❌ MEMBER SAVINGS:", err);
    return res.status(500).json({
      message: "Server error",
    });
  }
}

//////////////////////////////////////////////////
// 💵 MEMBER DEPOSITS
//////////////////////////////////////////////////
async function getMemberDeposits(req, res) {
  try {
    const member = await prisma.member.findUnique({
      where: {
        userId: req.user.id,
      },
    });

    if (!member) {
      return res.status(404).json({
        message: "Member not found",
      });
    }

    const deposits = await prisma.deposit.findMany({
      where: {
        memberId: member.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json(deposits);
  } catch (err) {
    console.error("❌ MEMBER DEPOSITS:", err);
    return res.status(500).json({
      message: "Server error",
    });
  }
}

//////////////////////////////////////////////////
// 🏦 MEMBER LOANS
//////////////////////////////////////////////////
async function getMemberLoans(req, res) {
  try {
    const member = await prisma.member.findUnique({
      where: {
        userId: req.user.id,
      },
    });

    if (!member) {
      return res.status(404).json({
        message: "Member not found",
      });
    }

    const loans = await prisma.loan.findMany({
      where: {
        memberId: member.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json(loans);
  } catch (err) {
    console.error("❌ MEMBER LOANS:", err);
    return res.status(500).json({
      message: "Server error",
    });
  }
}

//////////////////////////////////////////////////
// 💳 MEMBER TRANSACTIONS
//////////////////////////////////////////////////
async function getMemberTransactions(req, res) {
  try {
    const member = await prisma.member.findUnique({
      where: {
        userId: req.user.id,
      },
    });

    if (!member) {
      return res.status(404).json({
        message: "Member not found",
      });
    }

    const transactions = await prisma.transaction.findMany({
      where: {
        memberId: member.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json(transactions);
  } catch (err) {
    console.error("❌ MEMBER TRANSACTIONS:", err);
    return res.status(500).json({
      message: "Server error",
    });
  }
}

//////////////////////////////////////////////////
// ➕ CREATE MEMBER
//////////////////////////////////////////////////
async function createMember(req, res) {
  try {
    const {
      fullName,
      email,
      password,
      nationalId,
      phone,
      address,
      shareCapital,
      branchId,
    } = req.body;

    const hashedPwd = await bcrypt.hash(password || "1234", 10);

    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        password: hashedPwd,
        role: "MEMBER",
      },
    });

    const count = await prisma.member.count();

    const memberNumber = `M-${String(count + 1).padStart(4, "0")}`;

    const member = await prisma.member.create({
      data: {
        memberNumber,
        nationalId,
        phone,
        address,
        shareCapital: shareCapital || 0,
        userId: user.id,
        branchId,
      },
      include: MEMBER_INCLUDE,
    });

    await prisma.saving.create({
      data: {
        memberId: member.id,
        balance: 0,
      },
    });

    return res.status(201).json({ member });
  } catch (err) {
    console.error("❌ CREATE MEMBER:", err);

    if (err.code === "P2002") {
      return res.status(409).json({
        message: "Email or National ID already exists",
      });
    }

    return res.status(500).json({
      message: "Server error",
    });
  }
}

//////////////////////////////////////////////////
// ✏️ UPDATE MEMBER
//////////////////////////////////////////////////
async function updateMember(req, res) {
  try {
    const {
      phone,
      address,
      branchId,
      shareCapital,
    } = req.body;

    const member = await prisma.member.update({
      where: {
        id: req.params.id,
      },
      data: {
        phone,
        address,
        branchId,
        shareCapital,
      },
      include: MEMBER_INCLUDE,
    });

    return res.json({ member });
  } catch (err) {
    console.error("❌ UPDATE MEMBER:", err);
    return res.status(500).json({
      message: "Server error",
    });
  }
}

module.exports = {
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
};