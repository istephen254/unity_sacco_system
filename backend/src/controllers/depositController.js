const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

//////////////////////////////////////////////////
// 💰 MAKE DEPOSIT (TELLER / ADMIN / MANAGER)
//////////////////////////////////////////////////
exports.makeDeposit = async (req, res) => {
  try {
    const { memberNumber, amount } = req.body;

    if (!memberNumber || !amount) {
      return res.status(400).json({
        success: false,
        message: "memberNumber and amount are required",
      });
    }

    const depositAmount = Number(amount);

    if (!Number.isFinite(depositAmount) || depositAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid deposit amount",
      });
    }

    // 🔍 FIND MEMBER (SAFE + CLEAN)
    const member = await prisma.member.findFirst({
      where: {
        memberNumber: memberNumber.trim(),
      },
    });

    if (!member) {
      return res.status(404).json({
        success: false,
        message: `Member not found: ${memberNumber}`,
      });
    }

    // 💰 CREATE DEPOSIT
    const deposit = await prisma.deposit.create({
      data: {
        memberId: member.id,
        amount: depositAmount,
        tellerId: req.user.id,
      },
      include: {
        member: {
          include: {
            user: true,
          },
        },
        teller: {
          select: {
            id: true,
            fullName: true,
          },
        },
      },
    });

    // 📈 UPDATE SAVINGS
    await prisma.saving.updateMany({
      where: { memberId: member.id },
      data: {
        balance: {
          increment: depositAmount,
        },
      },
    });

    return res.status(201).json({
      success: true,
      message: "Deposit created successfully",
      deposit,
    });

  } catch (error) {
    console.error("Deposit error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//////////////////////////////////////////////////
// 👤 MEMBER OWN DEPOSITS
//////////////////////////////////////////////////
exports.getMemberDeposits = async (req, res) => {
  try {
    const member = await prisma.member.findFirst({
      where: { userId: req.user.id },
    });

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    const deposits = await prisma.deposit.findMany({
      where: { memberId: member.id },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({
      success: true,
      deposits,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//////////////////////////////////////////////////
// 📋 ALL DEPOSITS (ADMIN / MANAGER)
//////////////////////////////////////////////////
exports.getAllDeposits = async (req, res) => {
  try {
    const deposits = await prisma.deposit.findMany({
      include: {
        member: {
          include: { user: true },
        },
        teller: {
          select: {
            id: true,
            fullName: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      deposits,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//////////////////////////////////////////////////
// 👨‍💼 TELLER DEPOSITS
//////////////////////////////////////////////////
exports.getTellerDeposits = async (req, res) => {
  try {
    const deposits = await prisma.deposit.findMany({
      where: {
        tellerId: req.user.id,
      },
      include: {
        member: {
          include: { user: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({
      success: true,
      deposits,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};