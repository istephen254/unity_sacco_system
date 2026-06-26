const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function getAllBranches(req, res) {
  try {
    const branches = await prisma.branch.findMany({ orderBy: { name: "asc" } });
    return res.json({ branches });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
}

async function createBranch(req, res) {
  try {
    const { name, address } = req.body;
    const branch = await prisma.branch.create({ data: { name, address } });
    return res.status(201).json({ branch });
  } catch (err) {
    if (err.code === "P2002") return res.status(409).json({ message: "Branch name already exists" });
    return res.status(500).json({ message: "Server error" });
  }
}

module.exports = { getAllBranches, createBranch };