const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function getMySavings(req, res) {
  try {
    const member = await prisma.member.findUnique({ where: { userId: req.user.id } });
    if (!member) return res.status(404).json({ message: "Member not found" });

    const savings = await prisma.saving.findMany({ where: { memberId: member.id } });
    return res.json({ savings });
  } catch (err) {
    console.error("❌ GET MY SAVINGS:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

async function getAllSavings(req, res) {
  try {
    const savings = await prisma.saving.findMany({
      include: {
        member: {
          include: { user: { select: { fullName: true } } },
        },
      },
      orderBy: { updatedAt: "desc" },
    });
    return res.json({ savings });
  } catch (err) {
    console.error("❌ GET ALL SAVINGS:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

module.exports = { getMySavings, getAllSavings };