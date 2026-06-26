import { useEffect, useState } from "react";
import api from "../../../api";

export default function Savings() {
  const [savings, setSavings] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/savings");
        setSavings(res.data?.savings || []);
      } catch (err) {
        console.error(err);
      }
    };

    load();
  }, []);

  return (
    <div>
      <h2>Savings</h2>

      <table className="dash-table">
        <thead>
          <tr>
            <th>Member</th>
            <th>Balance</th>
          </tr>
        </thead>

        <tbody>
          {savings.map((s) => (
            <tr key={s.id}>
              <td>{s.member?.user?.fullName}</td>
              <td>KES {s.balance}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}