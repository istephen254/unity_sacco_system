import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import api from "../../../api";

export default function MemberOverview() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get("/members/me/summary")
      .then((res) => setData(res.data))
      .catch((err) => setError(err.message || "Failed to load summary"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="dash-loading">Loading your account...</div>;
  if (error)   return <div className="dash-alert dash-alert--error">⚠️ {error}</div>;

  return (
    <>
      {/* WELCOME BANNER */}
      <div style={{
        background: "var(--pine)",
        borderRadius: "var(--radius-md)",
        padding: "1.5rem",
        marginBottom: "1.5rem",
        display: "flex",
        alignItems: "center",
        gap: "1rem",
      }}>
        <div style={{
          width: 52, height: 52, borderRadius: "50%",
          background: "var(--ochre)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontWeight: 700, fontSize: "1.3rem", color: "#fff", flexShrink: 0,
        }}>
          {user?.fullName?.charAt(0).toUpperCase() || "M"}
        </div>
        <div>
          <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.8rem", marginBottom: 2 }}>
            Welcome back
          </div>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: "1.15rem" }}>
            {user?.fullName}
          </div>
          <div style={{ color: "var(--ochre)", fontSize: "0.8rem" }}>
            Member No: {data?.memberNumber || "—"}
          </div>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="dash-grid">
        <div className="stat-card">
          <div className="stat-card__label">Savings Balance</div>
          <div className="stat-card__value">
            KES {Number(data?.savingsBalance || 0).toLocaleString("en-KE", { minimumFractionDigits: 2 })}
          </div>
          <div className="stat-card__sub">Total accumulated savings</div>
        </div>

        <div className="stat-card stat-card--gold">
          <div className="stat-card__label">Loan Balance</div>
          <div className="stat-card__value">
            KES {Number(data?.loanBalance || 0).toLocaleString("en-KE", { minimumFractionDigits: 2 })}
          </div>
          <div className="stat-card__sub">Outstanding loan amount</div>
        </div>

        <div className="stat-card">
          <div className="stat-card__label">Share Capital</div>
          <div className="stat-card__value">
            KES {Number(data?.shareCapital || 0).toLocaleString("en-KE", { minimumFractionDigits: 2 })}
          </div>
          <div className="stat-card__sub">Your equity in the SACCO</div>
        </div>

        <div className="stat-card stat-card--gold">
          <div className="stat-card__label">Active Loans</div>
          <div className="stat-card__value">{data?.activeLoans || 0}</div>
          <div className="stat-card__sub">Loans currently running</div>
        </div>
      </div>

      {/* RECENT TRANSACTIONS */}
      <div className="dash-section">
        <div className="dash-section__head">
          <h3>Recent Transactions</h3>
          <button className="btn btn--ghost btn--sm" onClick={() => navigate("/dashboard/member/transactions")}>
            View All
          </button>
        </div>

        {!data?.recentTransactions?.length ? (
          <div className="dash-empty">No transactions yet.</div>
        ) : (
          <table className="dash-table">
            <thead>
              <tr>
                <th>Reference</th>
                <th>Type</th>
                <th>Amount (KES)</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {data.recentTransactions.map((t) => (
                <tr key={t.id}>
                  <td style={{ fontFamily: "monospace", fontSize: "0.85rem" }}>
                    {t.reference || "—"}
                  </td>
                  <td>
                    <span className={`badge ${
                      t.type === "DEPOSIT"        ? "badge--green"  :
                      t.type === "LOAN_REPAYMENT" ? "badge--blue"   :
                      "badge--gold"
                    }`}>
                      {t.type === "DEPOSIT"        ? "Deposit"         :
                       t.type === "LOAN_REPAYMENT" ? "Loan Repayment"  :
                       "Dividend"}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600 }}>
                    {Number(t.amount).toLocaleString("en-KE", { minimumFractionDigits: 2 })}
                  </td>
                  <td>
                    {new Date(t.createdAt).toLocaleDateString("en-KE", {
                      day: "2-digit", month: "short", year: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* QUICK LINKS */}
      <div className="dash-grid" style={{ marginTop: "0.5rem" }}>
        {[
          { label: "My Savings",     icon: "💰", path: "/dashboard/member/savings" },
          { label: "My Loans",       icon: "💳", path: "/dashboard/member/loans" },
          { label: "Transactions",   icon: "📋", path: "/dashboard/member/transactions" },
        ].map((item) => (
          <button
            key={item.path}
            className="stat-card"
            onClick={() => navigate(item.path)}
            style={{ cursor: "pointer", border: "1px solid var(--gray-200)", textAlign: "left" }}
          >
            <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{item.icon}</div>
            <div style={{ fontWeight: 600, color: "var(--pine)" }}>{item.label}</div>
            <div style={{ fontSize: "0.8rem", color: "var(--gray-400)", marginTop: 2 }}>
              View details →
            </div>
          </button>
        ))}
      </div>
    </>
  );
}