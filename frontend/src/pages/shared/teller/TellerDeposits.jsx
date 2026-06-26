import React, { useEffect, useState } from "react";
import api from "../../../api";

export default function TellerDeposits() {
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);

  const [memberNumber, setMemberNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchDeposits();
  }, []);

  const fetchDeposits = async () => {
    try {
      setLoading(true);

      const res = await api.get("/deposits/teller");

      if (res.data?.success) {
        setDeposits(res.data.deposits || []);
      } else {
        setDeposits([]);
      }
    } catch (err) {
      console.error("Fetch deposits error:", err);
      setDeposits([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeposit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      await api.post("/deposits", {
        memberNumber,
        amount: Number(amount),
      });

      setMemberNumber("");
      setAmount("");

      await fetchDeposits();
    } catch (err) {
      console.error("Deposit failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="dash-loading">Loading deposits...</div>;
  }

  return (
    <div className="page-container">
      <h2 className="page-title">💰 Deposits</h2>

      {/* FORM */}
      <div className="dash-section" style={{ marginBottom: "1.5rem" }}>
        <div className="dash-section__head">
          <h3>New Deposit</h3>
        </div>

        <form onSubmit={handleDeposit} className="dash-filters">
          <input
            className="form-input"
            placeholder="Member Number (e.g M-0001)"
            value={memberNumber}
            onChange={(e) => setMemberNumber(e.target.value)}
          />

          <input
            className="form-input"
            placeholder="Amount (KES)"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <button className="btn btn--primary" disabled={submitting}>
            {submitting ? "Processing..." : "💰 Deposit"}
          </button>
        </form>
      </div>

      {/* TABLE */}
      <div className="dash-section">
        <div className="dash-section__head">
          <h3>Recent Deposits</h3>
        </div>

        <table className="dash-table">
          <thead>
            <tr>
              <th>Member</th>
              <th>Amount</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {deposits.map((d) => (
              <tr key={d.id}>
                <td>{d.member?.user?.fullName}</td>
                <td className="amount-positive">+KES {d.amount}</td>
                <td>{new Date(d.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}