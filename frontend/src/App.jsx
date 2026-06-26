import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Public Pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";

// ================= ADMIN =================
import AdminDashboard from "./pages/dashboards/AdminDashboard";

import AdminOverview from "./pages/shared/admin/AdminOverview";
import AdminMembers from "./pages/shared/admin/Members";
import AdminLoans from "./pages/shared/admin/Loans";
import AdminSavings from "./pages/shared/admin/Savings";
import AdminReports from "./pages/shared/admin/Reports";
import AdminUsers from "./pages/shared/admin/Users";
import AdminSettings from "./pages/shared/admin/Settings";

// ================= MANAGER =================
import ManagerDashboard, { ManagerOverview } from "./pages/dashboards/ManagerDashboard";
import ManagerMembers from "./pages/shared/manager/ManagerMembers";
import ManagerLoans from "./pages/shared/manager/ManagerLoans";
import ManagerSavings from "./pages/shared/manager/ManagerSavings";
import ManagerReports from "./pages/shared/manager/ManagerReports";
import ManagerSettings from "./pages/shared/manager/ManagerSettings";

// ================= TELLER =================
import TellerDashboard from "./pages/dashboards/TellerDashboard";
import TellerOverview from "./pages/shared/teller/TellerOverview";
import TellerDeposits from "./pages/shared/teller/TellerDeposits";
import TellerTransactions from "./pages/shared/teller/TellerTransactions";
import TellerMembers from "./pages/shared/teller/TellerMembers";

// ================= MEMBER =================
import MemberDashboard from "./pages/dashboards/MemberDashboard";
import MemberOverview from "./pages/shared/member/MemberOverview";
import MemberSavings from "./pages/shared/member/MemberSavings";
import MemberLoans from "./pages/shared/member/MemberLoans";
import MemberTransactions from "./pages/shared/member/MemberTransactions";

//////////////////////////////////////////////////
// 🔐 PROTECTED ROUTE
//////////////////////////////////////////////////
function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh"
      }}>
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

//////////////////////////////////////////////////
// 🔁 DASHBOARD REDIRECT
//////////////////////////////////////////////////
function DashboardRouter() {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  const roleRoutes = {
    ADMIN: "/dashboard/admin",
    MANAGER: "/dashboard/manager",
    TELLER: "/dashboard/teller",
    MEMBER: "/dashboard/member",
  };

  return <Navigate to={roleRoutes[user.role] || "/login"} replace />;
}

//////////////////////////////////////////////////
// WRAPPER
//////////////////////////////////////////////////
const wrap = (roles, element) => (
  <ProtectedRoute allowedRoles={roles}>
    {element}
  </ProtectedRoute>
);

//////////////////////////////////////////////////
// 🚀 APP
//////////////////////////////////////////////////
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* ================= PUBLIC ================= */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* ================= DASHBOARD REDIRECT ================= */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardRouter />
              </ProtectedRoute>
            }
          />

          {/* ================= ADMIN ================= */}
          <Route
            path="/dashboard/admin"
            element={wrap(["ADMIN"], <AdminDashboard />)}
          >
            <Route index element={<AdminOverview />} />
            <Route path="members" element={<AdminMembers />} />
            <Route path="loans" element={<AdminLoans />} />
            <Route path="savings" element={<AdminSavings />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* ================= MANAGER ================= */}
          <Route
            path="/dashboard/manager"
            element={wrap(["MANAGER"], <ManagerDashboard />)}
          >
            <Route index element={<ManagerOverview />} />
            <Route path="members" element={<ManagerMembers />} />
            <Route path="loans" element={<ManagerLoans />} />
            <Route path="savings" element={<ManagerSavings />} />
            <Route path="reports" element={<ManagerReports />} />
            <Route path="settings" element={<ManagerSettings />} />
          </Route>

          {/* ================= TELLER ================= */}
          <Route
            path="/dashboard/teller"
            element={wrap(["TELLER"], <TellerDashboard />)}
          >
            <Route index element={<TellerOverview />} />
            <Route path="deposits" element={<TellerDeposits />} />
            <Route path="transactions" element={<TellerTransactions />} />
            <Route path="members" element={<TellerMembers />} />
          </Route>

          {/* ================= MEMBER ================= */}
          <Route
            path="/dashboard/member"
            element={wrap(["MEMBER"], <MemberDashboard />)}
          >
            <Route index element={<MemberOverview />} />
            <Route path="savings" element={<MemberSavings />} />
            <Route path="loans" element={<MemberLoans />} />
            <Route path="transactions" element={<MemberTransactions />} />
          </Route>

          {/* ================= FALLBACK ================= */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}