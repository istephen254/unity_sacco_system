const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

const prisma = require("./lib/prisma"); // initializes Prisma early

//////////////////////////////////////////////////
// 🚀 APP INIT
//////////////////////////////////////////////////
const app = express();
const PORT = process.env.PORT || 5000;

//////////////////////////////////////////////////
// 🛡️ MIDDLEWARE
//////////////////////////////////////////////////
app.use(helmet());

//////////////////////////////////////////////////
// 🌐 CORS — allows local dev + Render frontend
//////////////////////////////////////////////////
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.FRONTEND_URL, // set this on Render to your frontend URL
].filter(Boolean); // removes undefined if FRONTEND_URL not set

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (Postman, mobile apps, curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

//////////////////////////////////////////////////
// 📦 ROUTES
//////////////////////////////////////////////////

const authRoutes = require("./routes/authRoutes");
const memberRoutes = require("./routes/memberRoutes");
const loanRoutes = require("./routes/loanRoutes");
const depositRoutes = require("./routes/depositRoutes");
const savingRoutes = require("./routes/savingRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const branchRoutes = require("./routes/branchRoutes");
const adminRoutes = require("./routes/adminRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const userRoutes = require("./routes/userRoutes");
const managerRoutes = require("./routes/managerRoutes");

//////////////////////////////////////////////////
// 🔗 API ROUTE MOUNTING
//////////////////////////////////////////////////

app.use("/api/auth", authRoutes);
app.use("/api/members", memberRoutes);
app.use("/api/loans", loanRoutes);
app.use("/api/deposits", depositRoutes);
app.use("/api/savings", savingRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/branches", branchRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/users", userRoutes);
app.use("/api/manager", managerRoutes);

//////////////////////////////////////////////////
// ❤️ HEALTH CHECK
//////////////////////////////////////////////////
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    app: "Unity SACCO Backend",
    status: "ok",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});

//////////////////////////////////////////////////
// 🌐 ROOT ROUTE
//////////////////////////////////////////////////
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Unity SACCO API Running",
    version: "1.0.0",
  });
});

//////////////////////////////////////////////////
// 🌐 404 HANDLER (MUST BE LAST)
//////////////////////////////////////////////////
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
});

//////////////////////////////////////////////////
// 🔥 GLOBAL ERROR HANDLER
//////////////////////////////////////////////////
app.use((err, req, res, next) => {
  console.error("❌ SERVER ERROR:", err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

//////////////////////////////////////////////////
// 🎯 START SERVER
//////////////////////////////////////////////////
const server = app.listen(PORT, () => {
  console.log("");
  console.log("====================================");
  console.log(`🚀 Unity SACCO Backend Started`);
  console.log(`🌍 Environment : ${process.env.NODE_ENV || "development"}`);
  console.log(`📡 Port        : ${PORT}`);
  console.log(`🔗 URL         : http://localhost:${PORT}`);
  console.log("====================================");
  console.log("📦 Loaded Routes:");
  console.log("   /api/auth");
  console.log("   /api/members");
  console.log("   /api/loans");
  console.log("   /api/deposits");
  console.log("   /api/savings");
  console.log("   /api/transactions");
  console.log("   /api/branches");
  console.log("   /api/admin");
  console.log("   /api/dashboard");
  console.log("   /api/users");
  console.log("   /api/manager");
  console.log("====================================");
  console.log(`🌐 Allowed Origins:`);
  allowedOrigins.forEach((o) => console.log(`   ${o}`));
  console.log("====================================");
  console.log("");
});

//////////////////////////////////////////////////
// 🧹 GRACEFUL SHUTDOWN
//////////////////////////////////////////////////
process.on("SIGINT", async () => {
  console.log("\n🛑 Shutting down server...");

  try {
    await prisma.$disconnect();
  } catch (err) {
    console.error("Prisma disconnect error:", err);
  }

  server.close(() => {
    console.log("🧹 Server closed successfully");
    process.exit(0);
  });
});