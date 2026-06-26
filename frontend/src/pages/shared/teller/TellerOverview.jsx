import React, { useEffect, useState } from "react";
import api from "../../../api";

export default function TellerOverview() {
  const [stats, setStats] = useState({
    depositsCount: 0,
    totalDeposits: 0,
    transactionsToday: 0,
    membersServed: 0,
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [depositsRes, transactionsRes, membersRes] = await Promise.all([
        api.get("/deposits/teller"),

        api.get("/transactions/teller").catch(() => ({
          data: { transactions: [] },
        })),

        api.get("/members").catch(() => ({
          data: { members: [] },
        })),
      ]);

      const deposits = depositsRes.data?.deposits || [];

      // 🔥 SUM TOTAL DEPOSITS
      const totalDeposits = deposits.reduce(
        (sum, d) => sum + (d.amount || 0),
        0
      );

      setStats({
        depositsCount: deposits.length,
        totalDeposits,
        transactionsToday: transactionsRes.data?.transactions?.length || 0,
        membersServed: membersRes.data?.members?.length || 0,
      });
    } catch (err) {
      console.error("Dashboard error:", err);
    }
  };

  return (
    <div className="page-container">
      <h2 className="page-title">💰 Teller Overview</h2>

      <div className="teller-summary">
        <div className="teller-summary-card">
          <div className="label">Today's Deposits</div>
          <div className="value">{stats.depositsCount}</div>
        </div>

        <div className="teller-summary-card">
          <div className="label">💰 Total Deposits</div>
          <div className="value">{stats.totalDeposits}</div>
        </div>

        <div className="teller-summary-card">
          <div className="label">Transactions</div>
          <div className="value">{stats.transactionsToday}</div>
        </div>

        <div className="teller-summary-card">
          <div className="label">Members Served</div>
          <div className="value">{stats.membersServed}</div>
        </div>
      </div>
    </div>
  );
}