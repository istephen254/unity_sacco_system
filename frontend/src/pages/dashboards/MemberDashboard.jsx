import DashboardLayout from "./DashboardLayout";
import "./DashboardLayout.css";

export const MEMBER_NAV = [
  { path: "/dashboard/member",              icon: "🏠", label: "Overview" },
  { path: "/dashboard/member/savings",      icon: "💰", label: "My Savings" },
  { path: "/dashboard/member/loans",        icon: "💳", label: "My Loans" },
  { path: "/dashboard/member/transactions", icon: "📋", label: "Transactions" },
];

export default function MemberDashboard() {
  return <DashboardLayout title="Member Portal" navItems={MEMBER_NAV} />;
}