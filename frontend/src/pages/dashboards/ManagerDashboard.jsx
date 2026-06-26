import DashboardLayout from "./DashboardLayout";
import "./DashboardLayout.css";
import { Outlet } from "react-router-dom";

export const MANAGER_NAV = [
  { path: "/dashboard/manager", icon: "🏠", label: "Overview" },
  { path: "/dashboard/manager/members", icon: "👥", label: "Members" },
  { path: "/dashboard/manager/loans", icon: "💳", label: "Loans" },
  { path: "/dashboard/manager/savings", icon: "💰", label: "Savings" },
  { path: "/dashboard/manager/reports", icon: "📊", label: "Reports" },
  { path: "/dashboard/manager/settings", icon: "⚙️", label: "Settings" },
];

//////////////////////////////////////////////////
// OVERVIEW PAGE (kept as you had it)
//////////////////////////////////////////////////
export function ManagerOverview() {
  return (
    <div className="dash-section">
      <div className="dash-section__head">
        <h3>Manager Overview</h3>
      </div>

      <p style={{ padding: "1.25rem", color: "var(--gray-500)" }}>
        Welcome, Manager. Dashboard stats coming soon.
      </p>
    </div>
  );
}

//////////////////////////////////////////////////
// MAIN DASHBOARD LAYOUT WRAPPER (UPDATED)
//////////////////////////////////////////////////
export default function ManagerDashboard() {
  return (
    <DashboardLayout title="Manager Dashboard" navItems={MANAGER_NAV}>
      {/* 👇 This is the key addition (nested pages render here) */}
      <Outlet />
    </DashboardLayout>
  );
}