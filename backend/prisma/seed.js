const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient(); // seed runs standalone, own instance is fine here

async function main() {
  console.log("🌱 Seeding Unity SACCO database...");

  const branch = await prisma.branch.upsert({
    where: { name: "Nairobi CBD" },
    update: {},
    create: {
      name: "Nairobi CBD",
      address: "Kimathi Street, Nairobi",
    },
  });
  console.log("✅ Branch created");

  const password = await bcrypt.hash("1234", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@sacco.ac.ke" },
    update: {},
    create: { fullName: "System Admin", email: "admin@sacco.ac.ke", password, role: "ADMIN" },
  });

  const manager = await prisma.user.upsert({
    where: { email: "manager@sacco.ac.ke" },
    update: {},
    create: { fullName: "Branch Manager", email: "manager@sacco.ac.ke", password, role: "MANAGER" },
  });

  const teller = await prisma.user.upsert({
    where: { email: "teller@sacco.ac.ke" },
    update: {},
    create: { fullName: "Head Teller", email: "teller@sacco.ac.ke", password, role: "TELLER" },
  });

  const memberUser = await prisma.user.upsert({
    where: { email: "member@sacco.ac.ke" },
    update: {},
    create: { fullName: "John Kariuki", email: "member@sacco.ac.ke", password, role: "MEMBER" },
  });
  console.log("✅ Users created");

  const member = await prisma.member.upsert({
    where: { userId: memberUser.id },
    update: {},
    create: {
      memberNumber: "M-0001",
      nationalId: "12345678",
      phone: "0712345678",
      address: "Nairobi, Kenya",
      shareCapital: 5000,
      userId: memberUser.id,
      branchId: branch.id,
    },
  });
  console.log("✅ Member created");

  await prisma.saving.create({ data: { memberId: member.id, balance: 124500 } });
  console.log("✅ Savings created");

  await prisma.deposit.create({ data: { memberId: member.id, amount: 5000 } });
  console.log("✅ Deposit created");

  await prisma.loan.create({
    data: {
      memberId: member.id,
      amount: 100000,
      interestRate: 12,
      balance: 45000,
      status: "ACTIVE",
    },
  });
  console.log("✅ Loan created");

  const txData = [
    { type: "DEPOSIT", amount: 5000 },
    { type: "LOAN_REPAYMENT", amount: 4167 },
    { type: "DEPOSIT", amount: 5000 },
    { type: "DIVIDEND", amount: 6250 },
  ];

  for (const tx of txData) {
    await prisma.transaction.create({
      data: {
        memberId: member.id,
        type: tx.type,
        amount: tx.amount,
        reference: `TXN-${Math.floor(Math.random() * 10000)}`,
      },
    });
  }
  console.log("✅ Transactions created");

  console.log("\n🎉 SEED COMPLETED SUCCESSFULLY");
  console.log("Login credentials (password: 1234):");
  console.log("  admin@sacco.ac.ke");
  console.log("  manager@sacco.ac.ke");
  console.log("  teller@sacco.ac.ke");
  console.log("  member@sacco.ac.ke");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });