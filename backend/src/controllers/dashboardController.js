const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

//////////////////////////////////////////////////
// 📊 DASHBOARD STATS
//////////////////////////////////////////////////
const getStats = async (req, res) => {
  try {
    const totalMembers = await prisma.member.count();

    const totalSavings = await prisma.deposit.aggregate({
      _sum: { amount: true },
    });

    const activeLoans = await prisma.loan.count({
      where: { status: "ACTIVE" },
    });

    const pendingLoans = await prisma.loan.count({
      where: { status: "PENDING" },
    });

    const totalDeposits = await prisma.deposit.aggregate({
      _sum: { amount: true },
    });

    const totalLoansIssued = await prisma.loan.aggregate({
      _sum: { amount: true },
    });

    res.json({
      totalMembers,
      totalSavings: totalSavings._sum.amount || 0,
      activeLoans,
      pendingLoans,
      totalDeposits: totalDeposits._sum.amount || 0,
      totalLoansIssued: totalLoansIssued._sum.amount || 0,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch dashboard stats" });
  }
};

//////////////////////////////////////////////////
// 👥 RECENT MEMBERS
//////////////////////////////////////////////////
const getRecentMembers = async (req, res) => {
  try {
    const members = await prisma.member.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      include: {
        user: true,
        branch: true,
      },
    });

    const formatted = members.map((m) => ({
      id: m.memberNumber,
      name: m.user.fullName,
      branch: m.branch?.name || "Unassigned",
      joined: m.createdAt,
      status: m.user.isActive ? "Active" : "Inactive",
    }));

    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch recent members" });
  }
};

//////////////////////////////////////////////////
// 💳 PENDING LOANS
//////////////////////////////////////////////////
const getPendingLoans = async (req, res) => {
  try {
    const loans = await prisma.loan.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: "desc" },
      include: {
        member: {
          include: {
            user: true,
          },
        },
      },
    });

    const formatted = loans.map((l) => ({
      id: `L-${l.id}`,
      member: l.member.user.fullName,
      amount: `KES ${Number(l.amount).toLocaleString()}`,
      interestRate: l.interestRate,
      balance: l.balance,
      type: "Loan Application",
      applied: l.createdAt,
    }));

    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch pending loans" });
  }
};

//////////////////////////////////////////////////
// 📦 EXPORTS
//////////////////////////////////////////////////
module.exports = {
  getStats,
  getRecentMembers,
  getPendingLoans,
};