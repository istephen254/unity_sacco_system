import { useEffect, useState } from "react";
import api from "../../../api";

export default function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const load = async () => {
      const res = await api.get("/users");
      setUsers(res.data?.users || []);
    };

    load();
  }, []);

  const changeRole = async (id, role) => {
    await api.patch(`/users/${id}/role`, { role });
  };

  return (
    <div>
      <h2>User Management</h2>

      <table className="dash-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.fullName}</td>
              <td>{u.email}</td>
              <td>
                <select
                  value={u.role}
                  onChange={(e) => changeRole(u.id, e.target.value)}
                >
                  <option>ADMIN</option>
                  <option>MANAGER</option>
                  <option>TELLER</option>
                  <option>MEMBER</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}