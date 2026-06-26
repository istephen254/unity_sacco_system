import { useEffect, useState } from "react";
import api from "../../../api";

export default function Members() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMembers = async () => {
    try {
      const res = await api.get("/members");
      setMembers(res.data?.members || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const deactivateMember = async (id) => {
    try {
      await api.patch(`/members/${id}/deactivate`);
      fetchMembers();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p>Loading members...</p>;

  return (
    <div>
      <h2>Members</h2>

      <table className="dash-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Member No</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {members.map((m) => (
            <tr key={m.id}>
              <td>{m.user?.fullName}</td>
              <td>{m.memberNumber}</td>
              <td>{m.status}</td>
              <td>
                <button onClick={() => deactivateMember(m.id)}>
                  Deactivate
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}