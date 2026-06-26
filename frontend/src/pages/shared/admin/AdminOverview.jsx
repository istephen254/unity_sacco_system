import { useEffect, useState } from "react";
import api from "../../../api";

export default function AdminOverview() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/dashboard/stats");
        setStats(res.data);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  return (
    <div className="dash-grid">
      <div className="stat-card">
        <div className="stat-card__label">Total Members</div>
        <div className="stat-card__value">{stats?.totalMembers || 0}</div>
      </div>

      <div className="stat-card stat-card--gold">
        <div className="stat-card__label">Total Deposits</div>
        <div className="stat-card__value">
          KES {Number(stats?.totalDeposits || 0).toLocaleString()}
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-card__label">Active Loans</div>
        <div className="stat-card__value">{stats?.activeLoans || 0}</div>
      </div>

      <div className="stat-card stat-card--gold">
        <div className="stat-card__label">Pending Loans</div>
        <div className="stat-card__value">{stats?.pendingLoans || 0}</div>
      </div>
    </div>
  );
}