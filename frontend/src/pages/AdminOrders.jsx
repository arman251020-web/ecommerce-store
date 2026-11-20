import { useState, useEffect } from "react";
import "./Admin.css";
import API_URL from "../api";
const API = `${API_URL}/auth/admin`;

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  const loadOrders = async () => {
    try {
      const res = await fetch(`${API}/order`, { credentials: "include" });
      const data = await res.json();
      setOrders(data.user || data.orders || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      const res = await fetch(`${API}/order/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setOrders(orders.map((o) => (o._id === id ? { ...o, status } : o)));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Orders</h1>
          <p className="admin-subtitle">Track and update customer fulfillment statuses</p>
        </div>
      </div>

      <div className="admin-card" style={{ padding: 0 }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Items</th>
              <th>Status</th>
              <th>Change Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id}>
                <td>{o._id}</td>
                <td>{o.product?.length || 0} Products</td>
                <td>
                  <span className={`badge badge-${(o.status || "pending").toLowerCase()}`}>
                    {o.status || "Pending"}
                  </span>
                </td>
                <td>
                  <select
                    className="admin-select"
                    style={{ width: "140px" }}
                    value={o.status || "Pending"}
                    onChange={(e) => handleStatusChange(o._id, e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}