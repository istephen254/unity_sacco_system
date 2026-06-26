import { useEffect, useState } from "react";
import api from "../../api";

//////////////////////////////////////////////////
// 💰 DEPOSITS PAGE
//////////////////////////////////////////////////
export default function DepositsPage({ role }) {
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ memberId: "", amount: "" });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  // Members list for dropdown
  const [members, setMembers] = useState([]);

  //////////////////////////////////////////////////
  // 📡 FETCH DEPOSITS
  //////////////////////////////////////////////////
  const fetchDeposits = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/deposits");
      setDeposits(res.data);
    } catch (err) {
      setError(err.message || "Failed to load deposits");
    } finally {
      setLoading(false);
    }
  };

  //////////////////////////////////////////////////
  // 📡 FETCH MEMBERS (for dropdown)
  //////////////////////////////////////////////////
  const fetchMembers = async () => {
    try {
      const res = await api.get("/members");
      setMembers(res.data);
    } catch (err) {
      console.error("Failed to load members:", err);
    }
  };

  useEffect(() => {
    fetchDeposits();
    if (role === "ADMIN" || role === "TELLER") {
      fetchMembers();
    }
  }, [role]);

  //////////////////////////////////////////////////
  // 📝 HANDLE FORM SUBMIT
  //////////////////////////////////////////////////
  const handleSubmit = async () => {
    setFormError(null);

    if (!form.memberId || !form.amount) {
      setFormError("Please fill in all fields.");
      return;
    }

    if (isNaN(form.amount) || Number(form.amount) <= 0) {
      setFormError("Amount must be a positive number.");
      return;
    }

    setSubmitting(true);
    try {
      await api.post("/deposits", {
        memberId: Number(form.memberId),
        amount: Number(form.amount),
      });
      setForm({ memberId: "", amount: "" });
      setShowModal(false);
      fetchDeposits(); // refresh list
    } catch (err) {
      setFormError(err.message || "Failed to record deposit.");
    } finally {
      setSubmitting(false);
    }
  };

  //////////////////////////////////////////////////
  // 🎨 RENDER
  //////////////////////////////////////////////////
  return (
    <div className="dash-section">

      {/* HEADER */}
      <div className="dash-section__head">
        <h3>Deposits</h3>
        {(role === "ADMIN" || role === "TELLER") && (
          <button
            className="btn btn--primary"
            onClick={() => { setShowModal(true); setFormError(null); }}
          >
            + Record Deposit
          </button>
        )}
      </div>

      {/* ERROR */}
      {error && (
        <div className="dash-alert dash-alert--error">
          ⚠️ {error}
          <button onClick={fetchDeposits} style={{ marginLeft: 12 }}>Retry</button>
        </div>
      )}

      {/* TABLE */}
      {loading ? (
        <div className="dash-loading">Loading deposits...</div>
      ) : deposits.length === 0 ? (
        <div className="dash-empty">No deposits found.</div>
      ) : (
        <table className="dash-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Member</th>
              <th>Member No.</th>
              <th>Amount (KES)</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {deposits.map((d, i) => (
              <tr key={d.id}>
                <td style={{ color: "var(--pine)", fontWeight: 600 }}>
                  {i + 1}
                </td>
                <td>{d.member?.user?.fullName || "—"}</td>
                <td>{d.member?.memberNumber || "—"}</td>
                <td style={{ fontWeight: 600 }}>
                  {Number(d.amount).toLocaleString("en-KE", {
                    minimumFractionDigits: 2,
                  })}
                </td>
                <td>
                  {new Date(d.createdAt).toLocaleDateString("en-KE", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td>
                  <span className="badge badge--green">Completed</span>
                </td>
              </tr>
            ))}
          </tbody>

          {/* TOTAL ROW */}
          <tfoot>
            <tr>
              <td colSpan={3} style={{ textAlign: "right", fontWeight: 700 }}>
                Total
              </td>
              <td style={{ fontWeight: 700, color: "var(--pine)" }}>
                KES{" "}
                {deposits
                  .reduce((sum, d) => sum + Number(d.amount), 0)
                  .toLocaleString("en-KE", { minimumFractionDigits: 2 })}
              </td>
              <td colSpan={2} />
            </tr>
          </tfoot>
        </table>
      )}

      {/* ── MODAL ── */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div
            className="modal"
            onClick={(e) => e.stopPropagation()} // prevent close on inner click
          >
            <div className="modal__head">
              <h3>Record Deposit</h3>
              <button
                className="modal__close"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="modal__body">

              {/* MEMBER SELECT */}
              <div className="form-group">
                <label className="form-label">Member</label>
                <select
                  className="form-input"
                  value={form.memberId}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, memberId: e.target.value }))
                  }
                >
                  <option value="">-- Select Member --</option>
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.memberNumber} — {m.user?.fullName}
                    </option>
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
                  onChange={(e) =>
                    setForm((f) => ({ ...f, amount: e.target.value }))
                  }
                />
              </div>

              {/* FORM ERROR */}
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
                {submitting ? "Saving..." : "Save Deposit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}