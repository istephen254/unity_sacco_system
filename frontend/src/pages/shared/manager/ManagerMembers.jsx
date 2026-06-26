import { useEffect, useState } from "react";
import api from "../../../api";
import "./manager.css";

export default function ManagerMembers() {
  const [members, setMembers] = useState([]);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    nationalId: "",
    phone: "",
    address: "",
    shareCapital: 0,
  });

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      const res = await api.get("/members");

      setMembers(res.data.members || []);
    } catch (err) {
      console.error(err);
    }
  };

  const addMember = async (e) => {
    e.preventDefault();

    try {
      await api.post("/members", form);

      alert("Member created successfully");

      setForm({
        fullName: "",
        email: "",
        password: "",
        nationalId: "",
        phone: "",
        address: "",
        shareCapital: 0,
      });

      loadMembers();
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
          "Failed to create member"
      );
    }
  };

  return (
    <div className="dash-section">
      <h2>Members Management</h2>

      <form className="card form" onSubmit={addMember}>
        <input
          placeholder="Full Name"
          value={form.fullName}
          onChange={(e) =>
            setForm({
              ...form,
              fullName: e.target.value,
            })
          }
        />

        <input
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) =>
            setForm({
              ...form,
              email: e.target.value,
            })
          }
        />

        <input
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) =>
            setForm({
              ...form,
              password: e.target.value,
            })
          }
        />

        <input
          placeholder="National ID"
          value={form.nationalId}
          onChange={(e) =>
            setForm({
              ...form,
              nationalId: e.target.value,
            })
          }
        />

        <input
          placeholder="Phone Number"
          value={form.phone}
          onChange={(e) =>
            setForm({
              ...form,
              phone: e.target.value,
            })
          }
        />

        <input
          placeholder="Address"
          value={form.address}
          onChange={(e) =>
            setForm({
              ...form,
              address: e.target.value,
            })
          }
        />

        <input
          type="number"
          placeholder="Share Capital"
          value={form.shareCapital}
          onChange={(e) =>
            setForm({
              ...form,
              shareCapital: Number(e.target.value),
            })
          }
        />

        <button type="submit">
          Add Member
        </button>
      </form>

      <h3>Registered Members</h3>

      {members.map((m) => (
        <div key={m.id} className="card">
          <h4>{m.user?.fullName}</h4>

          <p>Email: {m.user?.email}</p>

          <p>Member No: {m.memberNumber}</p>

          <p>National ID: {m.nationalId}</p>

          <p>Phone: {m.phone}</p>

          <p>Share Capital: {m.shareCapital}</p>

          <p>
            Branch: {m.branch?.name || "N/A"}
          </p>
        </div>
      ))}
    </div>
  );
}