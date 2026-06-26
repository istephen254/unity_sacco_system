import DashboardLayout from "./DashboardLayout";
import "./DashboardLayout.css";
import { Outlet } from "react-router-dom";

export const ADMIN_NAV = [
  { path: "/dashboard/admin", icon: "🏠", label: "Overview" },
  { path: "/dashboard/admin/members", icon: "👥", label: "Members" },
  { path: "/dashboard/admin/loans", icon: "💳", label: "Loans" },
  { path: "/dashboard/admin/savings", icon: "💰", label: "Savings" },
  { path: "/dashboard/admin/reports", icon: "📊", label: "Reports" },
  { path: "/dashboard/admin/users", icon: "🔑", label: "User Management" },
  { path: "/dashboard/admin/settings", icon: "⚙️", label: "Settings" },
];

//////////////////////////////////////////////////
// 🏠 SHELL ONLY (NO API, NO BUSINESS LOGIC)
//////////////////////////////////////////////////
export default function AdminDashboard() {
  return (
    <DashboardLayout title="Admin Dashboard" navItems={ADMIN_NAV}>
      <Outlet />
    </DashboardLayout>
  );
}