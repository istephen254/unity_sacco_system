import React from "react";
import DashboardLayout from "./DashboardLayout";
import "./DashboardLayout.css";

export const TELLER_NAV = [
  { path: "/dashboard/teller", icon: "🏠", label: "Overview" },
  { path: "/dashboard/teller/deposits", icon: "💰", label: "Deposits" },
  { path: "/dashboard/teller/transactions", icon: "💳", label: "Transactions" },
  { path: "/dashboard/teller/members", icon: "👥", label: "Members" },
];

export default function TellerDashboard() {
  return (
    <DashboardLayout
      title="💰 Teller Operations"
      navItems={TELLER_NAV}
    />
  );
}