import React, { useEffect, useState } from "react";
import api from "../../../api";

export default function TellerMembers() {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await api.get("/members");
      setMembers(res.data.members || []);
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = members.filter((m) =>
    `${m.user?.fullName} ${m.memberNumber}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="page-container">
      <h2 className="page-title">👥 Members</h2>

      <div className="scan-input" style={{ marginBottom: "1rem" }}>
        <span>🔍</span>
        <input
          placeholder="Search by name or member number..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <table className="dash-table">
        <thead>
          <tr>
            <th>Member No</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Branch</th>
            <th>Share Capital</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map((m) => (
            <tr key={m.id}>
              <td>{m.memberNumber}</td>
              <td>{m.user?.fullName}</td>
              <td>{m.phone}</td>
              <td>{m.branch?.name}</td>
              <td className="amount-positive">
                KES {m.shareCapital}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}