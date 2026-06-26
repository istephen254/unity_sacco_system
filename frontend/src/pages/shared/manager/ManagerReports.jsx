import { useEffect, useState } from "react";
import api from "../../../api";

export default function ManagerReports() {
  const [report, setReport] = useState(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await api.get("/manager/reports");
    setReport(res.data.data);
  };

  if (!report) return <p>Loading reports...</p>;

  return (
    <div className="dash-section">
      <h3>Reports</h3>

      <div className="card">
        <p>Total Members: {report.members}</p>
        <p>Total Loans: {report.loans}</p>
        <p>Total Savings: KES {report.savings}</p>
        <p>Active Loans: {report.activeLoans}</p>
      </div>
    </div>
  );
}