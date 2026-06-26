import { useEffect, useState } from "react";
import api from "../../../api";

const TX_TYPES = [
  { value: "",               label: "All Types" },
  { value: "DEPOSIT",        label: "Deposit" },
  { value: "LOAN_REPAYMENT", label: "Loan Repayment" },
  { value: "DIVIDEND",       label: "Dividend" },
];

const TYPE_BADGE = {
  DEPOSIT:        "badge--green",
  LOAN_REPAYMENT: "badge--blue",
  DIVIDEND:       "badge--gold",
};

const TYPE_LABEL = {
  DEPOSIT:        "Deposit",
  LOAN_REPAYMENT: "Loan Repayment",
  DIVIDEND:       "Dividend",
};

export default function MemberTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [filtered, setFiltered]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);

  const [typeFilter, setTypeFilter] = useState("");
  const [dateFrom, setDateFrom]     = useState("");
  const [dateTo, setDateTo]         = useState("");

  useEffect(() => {
    api.get("/members/me/transactions")
      .then((res) => { setTransactions(res.data); setFiltered(res.data); })
      .catch((err) => setError(err.message || "Failed to load transactions"))
      .finally(() => setLoading(false));
  }, []);

  // Filter
  useEffect(() => {
    let result = [...transactions];

    if (typeFilter) {
      result = result.filter((t) => t.type === typeFilter);
    }
    if (dateFrom) {
      result = result.filter((t) => new Date(t.createdAt) >= new Date(dateFrom));
    }
    if (dateTo) {
      result = result.filter((t) => new Date(t.createdAt) <= new Date(dateTo + "T23:59:59"));
    }

    setFiltered(result);
  }, [typeFilter, dateFrom, dateTo, transactions]);

  const totals = filtered.reduce(
    (acc, t) => {
      acc[t.type] = (acc[t.type] || 0) + Number(t.amount);
      acc.all += Number(t.amount);
      return acc;
    },
    { DEPOSIT: 0, LOAN_REPAYMENT: 0, DIVIDEND: 0, all: 0 }
  );

  if (loading) return <div className="dash-loading">Loading transactions...</div>;
  if (error)   return <div className="dash-alert dash-alert--error">⚠️ {error}</div>;

  return (
    <>
      {/* SUMMARY */}
      <div className="dash-grid" style={{ marginBottom: "1.5rem" }}>
        <div className="stat-card">
          <div className="stat-card__label">Deposits</div>
          <div className="stat-card__value">
            KES {totals.DEPOSIT.toLocaleString("en-KE", { minimumFractionDigits: 2 })}
          </div>
        </div>
        <div className="stat-card stat-card--gold">
          <div className="stat-card__label">Loan Repayments</div>
          <div className="stat-card__value">
            KES {totals.LOAN_REPAYMENT.toLocaleString("en-KE", { minimumFractionDigits: 2 })}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card__label">Dividends</div>
          <div className="stat-card__value">
            KES {totals.DIVIDEND.toLocaleString("en-KE", { minimumFractionDigits: 2 })}
          </div>
        </div>
        <div className="stat-card stat-card--gold">
          <div className="stat-card__label">Grand Total</div>
          <div className="stat-card__value">
            KES {totals.all.toLocaleString("en-KE", { minimumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      <div className="dash-section">
        <div className="dash-section__head">
          <h3>Transaction History</h3>
        </div>

        {/* FILTERS */}
        <div className="dash-filters">
          <select
            className="form-input"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            style={{ maxWidth: 180 }}
          >
            {TX_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>

          <input
            type="date"
            className="form-input"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            style={{ maxWidth: 160 }}
          />
          <span style={{ color: "var(--gray-400)", alignSelf: "center" }}>to</span>
          <input
            type="date"
            className="form-input"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            style={{ maxWidth: 160 }}
          />

          {(typeFilter || dateFrom || dateTo) && (
            <button
              className="btn btn--ghost btn--sm"
              onClick={() => { setTypeFilter(""); setDateFrom(""); setDateTo(""); }}
            >
              ✕ Clear
            </button>
          )}

          <span style={{ marginLeft: "auto", fontSize: "0.85rem", color: "var(--gray-400)" }}>
            {filtered.length} of {transactions.length} records
          </span>
        </div>

        {/* TABLE */}
        {!filtered.length ? (
          <div className="dash-empty">
            {transactions.length === 0 ? "No transactions yet." : "No results match your filters."}
          </div>
        ) : (
          <table className="dash-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Reference</th>
                <th>Type</th>
                <th>Amount (KES)</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t, i) => (
                <tr key={t.id}>
                  <td style={{ color: "var(--pine)", fontWeight: 600 }}>{i + 1}</td>
                  <td style={{ fontFamily: "monospace", fontSize: "0.85rem" }}>
                    {t.reference || "—"}
                  </td>
                  <td>
                    <span className={`badge ${TYPE_BADGE[t.type] || "badge--gray"}`}>
                      {TYPE_LABEL[t.type] || t.type}
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
            <tfoot>
              <tr>
                <td colSpan={3} style={{ textAlign: "right", fontWeight: 700 }}>Total</td>
                <td style={{ fontWeight: 700, color: "var(--pine)" }}>
                  KES {totals.all.toLocaleString("en-KE", { minimumFractionDigits: 2 })}
                </td>
                <td />
              </tr>
            </tfoot>
          </table>
        )}
      </div>
    </>
  );
}