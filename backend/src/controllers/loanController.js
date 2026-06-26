const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

//////////////////////////////////////////////////
// 📋 GET ALL LOANS
//////////////////////////////////////////////////
async function getAllLoans(req, res) {
  try {
    const loans = await prisma.loan.findMany({
      include: {
        member: {
          include: { user: { select: { fullName: true, email: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return res.json({ loans });
  } catch (err) {
    console.error("❌ GET ALL LOANS:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

//////////////////////////////////////////////////
// 👤 MEMBER'S OWN LOANS
//////////////////////////////////////////////////
async function getLoansByMember(req, res) {
  try {
    const member = await prisma.member.findUnique({ where: { userId: req.user.id } });
    if (!member) return res.status(404).json({ message: "Member not found" });

    const loans = await prisma.loan.findMany({
      where: { memberId: member.id },
      orderBy: { createdAt: "desc" },
    });
    return res.json({ loans });
  } catch (err) {
    console.error("❌ GET MEMBER LOANS:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

//////////////////////////////////////////////////
// 📝 APPLY FOR LOAN
//////////////////////////////////////////////////
async function applyLoan(req, res) {
  try {
    const { amount, interestRate } = req.body;

    const member = await prisma.member.findUnique({ where: { userId: req.user.id } });
    if (!member) return res.status(404).json({ message: "Member profile not found" });

    const loan = await prisma.loan.create({
      data: {
        memberId: member.id,
        amount,
        interestRate: interestRate || 12,
        balance: amount,
        status: "PENDING",
      },
    });

    return res.status(201).json({ loan });
  } catch (err) {
    console.error("❌ APPLY LOAN:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

//////////////////////////////////////////////////
// ✅ APPROVE LOAN
//////////////////////////////////////////////////
async function approveLoan(req, res) {
  try {
    const loan = await prisma.loan.update({
      where: { id: req.params.id },
      data: { status: "ACTIVE" },
    });
    return res.json({ loan });
  } catch (err) {
    console.error("❌ APPROVE LOAN:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

//////////////////////////////////////////////////
// ❌ REJECT LOAN
//////////////////////////////////////////////////
async function rejectLoan(req, res) {
  try {
    const loan = await prisma.loan.update({
      where: { id: req.params.id },
      data: { status: "REJECTED" },
    });
    return res.json({ loan });
  } catch (err) {
    console.error("❌ REJECT LOAN:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

//////////////////////////////////////////////////
// 💳 REPAY LOAN
//////////////////////////////////////////////////
async function repayLoan(req, res) {
  try {
    const { amount } = req.body;
    const loan = await prisma.loan.findUnique({ where: { id: req.params.id } });
    if (!loan) return res.status(404).json({ message: "Loan not found" });

    const newBalance = Math.max(0, loan.balance - amount);
    const newStatus = newBalance === 0 ? "PAID" : loan.status;

    const updated = await prisma.loan.update({
      where: { id: req.params.id },
      data: { balance: newBalance, status: newStatus },
    });

    // Record transaction
    await prisma.transaction.create({
      data: {
        memberId: loan.memberId,
        type: "LOAN_REPAYMENT",
        amount,
        reference: `REPAY-${Date.now()}`,
      },
    });

    return res.json({ loan: updated });
  } catch (err) {
    console.error("❌ REPAY LOAN:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  getAllLoans,
  getLoansByMember,
  applyLoan,
  approveLoan,
  rejectLoan,
  repayLoan,
};