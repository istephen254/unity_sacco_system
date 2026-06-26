import React, { useState } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom"; // ✅ add Outlet
import { useAuth } from "../../context/AuthContext";
import "./DashboardLayout.css";

export default function DashboardLayout({ title, navItems }) { // ✅ remove children prop
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sideOpen, setSideOpen] = useState(false);

  const handleLogout = () => { logout(); navigate("/login"); };

  return (
    <div className="dl">
      {/* SIDEBAR */}
      <aside className={`dl__side ${sideOpen ? "dl__side--open" : ""}`}>
        <div className="dl__side-brand">
          <div className="dl__stamp">US</div>
          <span>Unity SACCO</span>
        </div>

        <nav className="dl__nav">
          {navItems.map((item) => (
            <button
              key={item.path}
              className={`dl__nav-item ${
                location.pathname === item.path ? "dl__nav-item--active" : ""
              }`}
              onClick={() => { navigate(item.path); setSideOpen(false); }}
            >
              <span className="dl__nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <button className="dl__logout" onClick={handleLogout}>
          <span>⎋</span> Sign Out
        </button>
      </aside>

      {/* OVERLAY */}
      {sideOpen && <div className="dl__overlay" onClick={() => setSideOpen(false)} />}

      {/* MAIN */}
      <div className="dl__main">
        <header className="dl__header">
          <button className="dl__hamburger" onClick={() => setSideOpen((s) => !s)}>☰</button>
          <div className="dl__header-title">{title}</div>
          <div className="dl__user">
            <div className="dl__avatar">
              {user?.fullName?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="dl__user-info">
              <span className="dl__user-name">{user?.fullName || "User"}</span>
              <span className="dl__user-role">{user?.role?.replace("_", " ")}</span>
            </div>
          </div>
        </header>

        <main className="dl__content">
          <Outlet /> {/* ✅ sub-pages render here */}
        </main>
      </div>
    </div>
  );
}