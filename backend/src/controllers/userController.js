const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function getMyTransactions(req, res) {
  try {
    const member = await prisma.member.findUnique({ where: { userId: req.user.id } });
    if (!member) return res.status(404).json({ message: "Member not found" });

    const transactions = await prisma.transaction.findMany({
      where: { memberId: member.id },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return res.json({ transactions });
  } catch (err) {
    console.error("❌ GET MY TRANSACTIONS:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

async function getAllTransactions(req, res) {
  try {
    const transactions = await prisma.transaction.findMany({
      include: {
        member: {
          include: { user: { select: { fullName: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    return res.json({ transactions });
  } catch (err) {
    console.error("❌ GET ALL TRANSACTIONS:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

module.exports = { getMyTransactions, getAllTransactions };