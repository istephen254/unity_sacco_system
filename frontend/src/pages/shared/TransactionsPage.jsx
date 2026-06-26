import { useEffect, useState } from "react";
import api from "../../api";

//////////////////////////////////////////////////
// TRANSACTION TYPE CONFIG
//////////////////////////////////////////////////
const TX_TYPES = [
  { value: "", label: "All Types" },
  { value: "DEPOSIT", label: "Deposit" },
  { value: "LOAN_REPAYMENT", label: "Loan Repayment" },
  { value: "DIVIDEND", label: "Dividend" },
];

const TYPE_BADGE = {
  DEPOSIT: "badge--green",
  LOAN_REPAYMENT: "badge--blue",
  DIVIDEND: "badge--gold",
};

const TYPE_LABEL = {
  DEPOSIT: "Deposit",
  LOAN_REPAYMENT: "Loan Repayment",
  DIVIDEND: "Dividend",
};

//////////////////////////////////////////////////
// 💳 TRANSACTIONS PAGE
//////////////////////////////////////////////////
export default function TransactionsPage({ role }) {
  const [transactions, setTransactions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [typeFilter, setTypeFilter] = useState("");
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ memberId: "", type: "", amount: "", reference: "" });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  // Members dropdown
  const [members, setMembers] = useState([]);

  //////////////////////////////////////////////////
  // 📡 FETCH
  //////////////////////////////////////////////////
  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/transactions");
      setTransactions(res.data);
      setFiltered(res.data);
    } catch (err) {
      setError(err.message || "Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  const fetchMembers = async () => {
    try {
      const res = await api.get("/members");
      setMembers(res.data);
    } catch (err) {
      console.error("Failed to load members:", err);
    }
  };

  useEffect(() => {
    fetchTransactions();
    if (role === "ADMIN" || role === "TELLER") {
      fetchMembers();
    }
  }, [role]);

  //////////////////////////////////////////////////
  // 🔍 FILTER
  //////////////////////////////////////////////////
  useEffect(() => {
    let result = [...transactions];

    if (typeFilter) {
      result = result.filter((t) => t.type === typeFilter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.member?.user?.fullName?.toLowerCase().includes(q) ||
          t.member?.memberNumber?.toLowerCase().includes(q) ||
          t.reference?.toLowerCase().includes(q)
      );
    }

    if (dateFrom) {
      result = result.filter(
        (t) => new Date(t.createdAt) >= new Date(dateFrom)
      );
    }

    if (dateTo) {
      result = result.filter(
        (t) => new Date(t.createdAt) <= new Date(dateTo + "T23:59:59")
      );
    }

    setFiltered(result);
  }, [typeFilter, search, dateFrom, dateTo, transactions]);

  //////////////////////////////////////////////////
  // 📝 SUBMIT
  //////////////////////////////////////////////////
  const handleSubmit = async () => {
    setFormError(null);

    if (!form.memberId || !form.type || !form.amount) {
      setFormError("Member, type, and amount are required.");
      return;
    }

    if (isNaN(form.amount) || Number(form.amount) <= 0) {
      setFormError("Amount must be a positive number.");
      return;
    }

    setSubmitting(true);
    try {
      await api.post("/transactions", {
        memberId: Number(form.memberId),
        type: form.type,
        amount: Number(form.amount),
        reference: form.reference || undefined,
      });
      setForm({ memberId: "", type: "", amount: "", reference: "" });
      setShowModal(false);
      fetchTransactions();
    } catch (err) {
      setFormError(err.message || "Failed to record transaction.");
    } finally {
      setSubmitting(false);
    }
  };

  //////////////////////////////////////////////////
  // 📊 SUMMARY TOTALS
  //////////////////////////////////////////////////
  const totals = filtered.reduce(
    (acc, t) => {
      acc[t.type] = (acc[t.type] || 0) + Number(t.amount);
      acc.all += Number(t.amount);
      return acc;
    },
    { DEPOSIT: 0, LOAN_REPAYMENT: 0, DIVIDEND: 0, all: 0 }
  );

  //////////////////////////////////////////////////
  // 🎨 RENDER
  //////////////////////////////////////////////////
  return (
    <div className="dash-section">

      {/* HEADER */}
      <div className="dash-section__head">
        <h3>Transactions</h3>
        {(role === "ADMIN" || role === "TELLER") && (
          <button
            className="btn btn--primary"
            onClick={() => { setShowModal(true); setFormError(null); }}
          >
            + New Transaction
          </button>
        )}
      </div>

      {/* SUMMARY CARDS */}
      <div className="dash-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-card__label">Total Deposits</div>
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

      {/* FILTERS */}
      <div className="dash-filters">
        {/* Search */}
        <input
          type="text"
          className="form-input"
          placeholder="Search member or reference..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: 240 }}
        />

        {/* Type filter */}
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

        {/* Date range */}
        <input
          type="date"
          className="form-input"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          style={{ maxWidth: 160 }}
        />
        <span style={{ color: "var(--muted)", alignSelf: "center" }}>to</span>
        <input
          type="date"
          className="form-input"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          style={{ maxWidth: 160 }}
        />

        {/* Clear filters */}
        {(search || typeFilter || dateFrom || dateTo) && (
          <button
            className="btn btn--ghost"
            onClick={() => { setSearch(""); setTypeFilter(""); setDateFrom(""); setDateTo(""); }}
          >
            ✕ Clear
          </button>
        )}
      </div>

      {/* ERROR */}
      {error && (
        <div className="dash-alert dash-alert--error">
          ⚠️ {error}
          <button onClick={fetchTransactions} style={{ marginLeft: 12 }}>Retry</button>
        </div>
      )}

      {/* TABLE */}
      {loading ? (
        <div className="dash-loading">Loading transactions...</div>
      ) : filtered.length === 0 ? (
        <div className="dash-empty">
          {transactions.length === 0 ? "No transactions found." : "No results match your filters."}
        </div>
      ) : (
        <table className="dash-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Reference</th>
              <th>Member</th>
              <th>Member No.</th>
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
                <td>{t.member?.user?.fullName || "—"}</td>
                <td>{t.member?.memberNumber || "—"}</td>
                <td>
                  <span className={`badge ${TYPE_BADGE[t.type] || "badge--yellow"}`}>
                    {TYPE_LABEL[t.type] || t.type}
                  </span>
                </td>
                <td style={{ fontWeight: 600 }}>
                  {Number(t.amount).toLocaleString("en-KE", { minimumFractionDigits: 2 })}
                </td>
                <td>
                  {new Date(t.createdAt).toLocaleDateString("en-KE", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
              </tr>
            ))}
          </tbody>

          {/* TOTAL ROW */}
          <tfoot>
            <tr>
              <td colSpan={5} style={{ textAlign: "right", fontWeight: 700 }}>
                Showing {filtered.length} of {transactions.length}
              </td>
              <td style={{ fontWeight: 700, color: "var(--pine)" }}>
                KES {totals.all.toLocaleString("en-KE", { minimumFractionDigits: 2 })}
              </td>
              <td />
            </tr>
          </tfoot>
        </table>
      )}

      {/* ── MODAL ── */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>

            <div className="modal__head">
              <h3>New Transaction</h3>
              <button className="modal__close" onClick={() => setShowModal(false)}>✕</button>
            </div>

            <div className="modal__body">

              {/* MEMBER */}
              <div className="form-group">
                <label className="form-label">Member</label>
                <select
                  className="form-input"
                  value={form.memberId}
                  onChange={(e) => setForm((f) => ({ ...f, memberId: e.target.value }))}
                >
                  <option value="">-- Select Member --</option>
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.memberNumber} — {m.user?.fullName}
                    </option>
                  ))}
                </select>
              </div>

              {/* TYPE */}
              <div className="form-group">
                <label className="form-label">Transaction Type</label>
                <select
                  className="form-input"
                  value={form.type}
                  onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                >
                  <option value="">-- Select Type --</option>
                  {TX_TYPES.filter((t) => t.value).map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>

              {/* AMOUNT */}
              <div className="form-group">
                <label className="form-label">Amount (KES)</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="e.g. 5000"
                  min="1"
                  value={form.amount}
                  onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                />
              </div>

              {/* REFERENCE (optional) */}
              <div className="form-group">
                <label className="form-label">Reference <span style={{ color: "var(--muted)", fontWeight: 400 }}>(optional)</span></label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. TXN-00123"
                  value={form.reference}
                  onChange={(e) => setForm((f) => ({ ...f, reference: e.target.value }))}
                />
              </div>

              {/* ERROR */}
              {formError && (
                <div className="dash-alert dash-alert--error">{formError}</div>
              )}
            </div>

            <div className="modal__foot">
              <button
                className="btn btn--ghost"
                onClick={() => setShowModal(false)}
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                className="btn btn--primary"
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? "Saving..." : "Save Transaction"}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}