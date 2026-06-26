const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

//////////////////////////////////////////////////
// 📊 DASHBOARD STATS
//////////////////////////////////////////////////
async function getDashboardStats(req, res) {
  try {
    const [
      totalMembers,
      totalLoans,
      activeLoans,
      totalDeposits,
      totalSavings,
      recentTransactions,
    ] = await Promise.all([
      prisma.member.count(),
      prisma.loan.count(),
      prisma.loan.count({ where: { status: "ACTIVE" } }),
      prisma.deposit.aggregate({ _sum: { amount: true } }),
      prisma.saving.aggregate({ _sum: { balance: true } }),
      prisma.transaction.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: {
          member: { include: { user: { select: { fullName: true } } } },
        },
      }),
    ]);

    return res.json({
      stats: {
        totalMembers,
        totalLoans,
        activeLoans,
        totalDeposits: totalDeposits._sum.amount || 0,
        totalSavings: totalSavings._sum.balance || 0,
      },
      recentTransactions,
    });
  } catch (err) {
    console.error("❌ DASHBOARD STATS:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

module.exports = { getDashboardStats };