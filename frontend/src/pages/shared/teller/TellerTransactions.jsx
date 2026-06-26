import React, { useEffect, useState } from "react";
import api from "../../../api";

export default function TellerTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await api.get("/transactions");
      setTransactions(res.data.transactions || []);
    } catch (err) {
      console.error("Failed to load transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  const getBadgeClass = (type) => {
    switch (type) {
      case "DEPOSIT":
        return "badge badge--deposit";
      case "WITHDRAW":
        return "badge badge--withdraw";
      case "TRANSFER":
        return "badge badge--transfer";
      default:
        return "badge badge--gray";
    }
  };

  if (loading) {
    return <div className="dash-loading">Loading transactions...</div>;
  }

  return (
    <div className="page-container">
      <h2 className="page-title">💳 Teller Transactions</h2>

      <div className="dash-section">
        <div className="dash-section__head">
          <h3>Transaction Ledger</h3>
        </div>

        <table className="dash-table">
          <thead>
            <tr>
              <th>Member</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Reference</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  📭 No transactions found
                </td>
              </tr>
            ) : (
              transactions.map((tx) => (
                <tr key={tx.id}>
                  <td>{tx.member?.user?.fullName || "Unknown"}</td>

                  {/* TYPE BADGE */}
                  <td>
                    <span className={getBadgeClass(tx.type)}>
                      {tx.type}
                    </span>
                  </td>

                  {/* AMOUNT */}
                  <td
                    className={
                      tx.type === "DEPOSIT"
                        ? "amount-positive"
                        : "amount-negative"
                    }
                  >
                    {tx.type === "DEPOSIT" ? "+" : "-"}
                    KES {tx.amount}
                  </td>

                  <td>{tx.reference || "-"}</td>

                  <td>
                    {new Date(tx.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}