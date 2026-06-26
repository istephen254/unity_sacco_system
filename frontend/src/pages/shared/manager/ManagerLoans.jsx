import { useEffect, useState } from "react";
import api from "../../../api";

export default function ManagerLoans() {
  const [loans, setLoans] = useState([]);

  useEffect(() => {
    loadLoans();
  }, []);

  const loadLoans = async () => {
    const res = await api.get("/manager/loans");
    setLoans(res.data.data);
  };

  const approve = async (id) => {
    await api.put(`/manager/loans/${id}/approve`);
    loadLoans();
  };

  const decline = async (id) => {
    await api.put(`/manager/loans/${id}/decline`);
    loadLoans();
  };

  return (
    <div className="dash-section">
      <h3>Loan Approvals</h3>

      {loans.map(l => (
        <div key={l.id} className="card row">
          <div>
            <b>{l.memberName}</b>
            <p>Amount: KES {l.amount}</p>
            <p>Status: {l.status}</p>
          </div>

          <div>
            {l.status === "PENDING" && (
              <>
                <button onClick={() => approve(l.id)}>Approve</button>
                <button onClick={() => decline(l.id)}>Decline</button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}