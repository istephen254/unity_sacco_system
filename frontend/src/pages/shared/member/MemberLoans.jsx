import { useEffect, useState } from "react";
import api from "../../../api";

const STATUS_BADGE = {
  ACTIVE:    "badge--green",
  PENDING:   "badge--yellow",
  APPROVED:  "badge--blue",
  REJECTED:  "badge--red",
  COMPLETED: "badge--gray",
};

export default function MemberLoans() {
  const [loans, setLoans]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    api.get("/members/me/loans")
      .then((res) => setLoans(res.data))
      .catch((err) => setError(err.message || "Failed to load loans"))
      .finally(() => setLoading(false));
  }, []);

  const totalBorrowed  = loans.reduce((s, l) => s + Number(l.amount), 0);
  const totalBalance   = loans.reduce((s, l) => s + Number(l.balance), 0);
  const totalRepaid    = totalBorrowed - totalBalance;

  if (loading) return <div className="dash-loading">Loading loans...</div>;
  if (error)   return <div className="dash-alert dash-alert--error">⚠️ {error}</div>;

  return (
    <>
      {/* SUMMARY */}
      <div className="dash-grid" style={{ marginBottom: "1.5rem" }}>
        <div className="stat-card">
          <div className="stat-card__label">Total Borrowed</div>
          <div className="stat-card__value">
            KES {totalBorrowed.toLocaleString("en-KE", { minimumFractionDigits: 2 })}
          </div>
        </div>
        <div className="stat-card stat-card--gold">
          <div className="stat-card__label">Outstanding Balance</div>
          <div className="stat-card__value">
            KES {totalBalance.toLocaleString("en-KE", { minimumFractionDigits: 2 })}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card__label">Total Repaid</div>
          <div className="stat-card__value">
            KES {totalRepaid.toLocaleString("en-KE", { minimumFractionDigits: 2 })}
          </div>
        </div>
        <div className="stat-card stat-card--gold">
          <div className="stat-card__label">Total Loans</div>
          <div className="stat-card__value">{loans.length}</div>
        </div>
      </div>

      {/* LOANS TABLE */}
      <div className="dash-section">
        <div className="dash-section__head">
          <h3>My Loans</h3>
        </div>

        {!loans.length ? (
          <div className="dash-empty">You have no loans yet.</div>
        ) : (
          <table className="dash-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Amount (KES)</th>
                <th>Interest Rate</th>
                <th>Balance (KES)</th>
                <th>Repaid (KES)</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {loans.map((l, i) => {
                const repaid = Number(l.amount) - Number(l.balance);
                const pct    = ((repaid / Number(l.amount)) * 100).toFixed(0);
                return (
                  <tr key={l.id}>
                    <td style={{ color: "var(--pine)", fontWeight: 600 }}>{i + 1}</td>
                    <td style={{ fontWeight: 600 }}>
                      {Number(l.amount).toLocaleString("en-KE", { minimumFractionDigits: 2 })}
                    </td>
                    <td>{l.interestRate}%</td>
                    <td style={{ color: l.balance > 0 ? "#B91C1C" : "var(--pine)", fontWeight: 600 }}>
                      {Number(l.balance).toLocaleString("en-KE", { minimumFractionDigits: 2 })}
                    </td>
                    <td>
                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <span>
                          {repaid.toLocaleString("en-KE", { minimumFractionDigits: 2 })}
                        </span>
                        {/* Progress bar */}
                        <div style={{
                          height: 4, borderRadius: 99,
                          background: "var(--gray-200)", overflow: "hidden", minWidth: 80,
                        }}>
                          <div style={{
                            height: "100%", borderRadius: 99,
                            width: `${pct}%`,
                            background: Number(pct) === 100 ? "#15803D" : "var(--pine)",
                          }} />
                        </div>
                        <span style={{ fontSize: "0.72rem", color: "var(--gray-400)" }}>
                          {pct}% repaid
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${STATUS_BADGE[l.status] || "badge--gray"}`}>
                        {l.status}
                      </span>
                    </td>
                    <td>
                      {new Date(l.createdAt).toLocaleDateString("en-KE", {
                        day: "2-digit", month: "short", year: "numeric",
                      })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={1} style={{ textAlign: "right", fontWeight: 700 }}>Totals</td>
                <td style={{ fontWeight: 700 }}>
                  KES {totalBorrowed.toLocaleString("en-KE", { minimumFractionDigits: 2 })}
                </td>
                <td />
                <td style={{ fontWeight: 700, color: "#B91C1C" }}>
                  KES {totalBalance.toLocaleString("en-KE", { minimumFractionDigits: 2 })}
                </td>
                <td style={{ fontWeight: 700, color: "var(--pine)" }}>
                  KES {totalRepaid.toLocaleString("en-KE", { minimumFractionDigits: 2 })}
                </td>
                <td colSpan={2} />
              </tr>
            </tfoot>
          </table>
        )}
      </div>
    </>
  );
}