import { useEffect, useState } from "react";
import api from "../../../api";

export default function ManagerSavings() {
  const [savings, setSavings] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await api.get("/manager/savings");

    setSavings(res.data.data);
    setTotal(res.data.total);
  };

  return (
    <div className="dash-section">
      <h3>Savings Overview</h3>

      <div className="card">
        <h4>Total Savings</h4>
        <h2>KES {total.toLocaleString()}</h2>
      </div>

      {savings.map(s => (
        <div key={s.id} className="card">
          <b>{s.memberName}</b>
          <p>Amount: KES {s.amount}</p>
        </div>
      ))}
    </div>
  );
}