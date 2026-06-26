import { useEffect, useState } from "react";
import api from "../../../api";

export default function MemberSavings() {
  const [savings, setSavings] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    Promise.all([
      api.get("/members/me/savings"),
      api.get("/members/me/deposits"),
    ])
      .then(([savRes, depRes]) => {
        setSavings(savRes.data);
        setHistory(depRes.data);
      })
      .catch((err) => setError(err.message || "Failed to load savings"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="dash-loading">Loading savings...</div>;
  if (error)   return <div className="dash-alert dash-alert--error">⚠️ {error}</div>;

  return (
    <>
      {/* BALANCE CARD */}
      <div className="dash-grid" style={{ marginBottom: "1.5rem" }}>
        <div className="stat-card" style={{ borderLeft: "4px solid var(--pine)" }}>
          <div className="stat-card__label">Current Balance</div>
          <div className="stat-card__value">
            KES {Number(savings?.balance || 0).toLocaleString("en-KE", { minimumFractionDigits: 2 })}
          </div>
          <div className="stat-card__sub">As of {new Date().toLocaleDateString("en-KE")}</div>
        </div>

        <div className="stat-card stat-card--gold">
          <div className="stat-card__label">Total Deposited</div>
          <div className="stat-card__value">
            KES {history.reduce((s, d) => s + Number(d.amount), 0)
              .toLocaleString("en-KE", { minimumFractionDigits: 2 })}
          </div>
          <div className="stat-card__sub">{history.length} deposit(s) made</div>
        </div>
      </div>

      {/* DEPOSIT HISTORY */}
      <div className="dash-section">
        <div className="dash-section__head">
          <h3>Deposit History</h3>
        </div>

        {!history.length ? (
          <div className="dash-empty">No deposits recorded yet.</div>
        ) : (
          <table className="dash-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Amount (KES)</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {history.map((d, i) => (
                <tr key={d.id}>
                  <td style={{ color: "var(--pine)", fontWeight: 600 }}>{i + 1}</td>
                  <td style={{ fontWeight: 600 }}>
                    {Number(d.amount).toLocaleString("en-KE", { minimumFractionDigits: 2 })}
                  </td>
                  <td>
                    {new Date(d.createdAt).toLocaleDateString("en-KE", {
                      day: "2-digit", month: "short", year: "numeric",
                    })}
                  </td>
                  <td><span className="badge badge--green">Completed</span></td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={1} style={{ textAlign: "right", fontWeight: 700 }}>Total</td>
                <td style={{ fontWeight: 700, color: "var(--pine)" }}>
                  KES {history.reduce((s, d) => s + Number(d.amount), 0)
                    .toLocaleString("en-KE", { minimumFractionDigits: 2 })}
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