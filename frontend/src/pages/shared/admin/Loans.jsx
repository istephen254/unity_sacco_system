import { useEffect, useState } from "react";
import api from "../../../api";

export default function Loans() {
  const [loans, setLoans] = useState([]);

  const fetchLoans = async () => {
    try {
      const res = await api.get("/loans");
      setLoans(res.data?.loans || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const approveLoan = async (id) => {
    await api.patch(`/loans/${id}/approve`);
    fetchLoans();
  };

  const rejectLoan = async (id) => {
    await api.patch(`/loans/${id}/reject`);
    fetchLoans();
  };

  return (
    <div>
      <h2>Loans</h2>

      <table className="dash-table">
        <thead>
          <tr>
            <th>Member</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {loans.map((l) => (
            <tr key={l.id}>
              <td>{l.member?.user?.fullName}</td>
              <td>{l.amount}</td>
              <td>{l.status}</td>
              <td>
                {l.status === "PENDING" && (
                  <>
                    <button onClick={() => approveLoan(l.id)}>Approve</button>
                    <button onClick={() => rejectLoan(l.id)}>Reject</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}