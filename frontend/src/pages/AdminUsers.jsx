import { useState, useEffect } from "react";
import "./Admin.css";
import API_URL from "../api";
const API = `${API_URL}/auth/admin`;

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  const loadUsers = async () => {
    try {
      const res = await fetch(`${API}/users`, { credentials: "include" });
      const data = await res.json();
      setUsers(data.users || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this user?")) return;
    try {
      const res = await fetch(`${API}/user/${id}`, { method: "DELETE", credentials: "include" });
      if (res.ok) setUsers(users.filter((u) => u._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Users</h1>
          <p className="admin-subtitle">All registered accounts</p>
        </div>
      </div>

      <div className="admin-card" style={{ padding: 0 }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>
                  <span className={`badge ${u.role === "admin" ? "badge-delivered" : "badge-shipped"}`}>
                    {u.role || "user"}
                  </span>
                </td>
                <td>
                  <button className="admin-btn-danger" onClick={() => handleDelete(u._id)}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}