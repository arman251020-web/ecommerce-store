import { useState, useEffect } from "react";
import "./Admin.css";
import API_URL from "../api";

const API = `${API_URL}/auth/admin`;

export default function AdminDashboardHome() {
  const [stats, setStats] = useState({ products: 0, orders: 0, users: 0, categories: 0 });
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [p, c, o, u] = await Promise.all([
          fetch(`${API}/products`, { credentials: "include" }),
          fetch(`${API}/product/category`, { credentials: "include" }),
          fetch(`${API}/order`, { credentials: "include" }),
          fetch(`${API}/users`, { credentials: "include" }),
        ]);
        const pD = await p.json();
        const cD = await c.json();
        const oD = await o.json();
        const uD = await u.json();

        const orderList = oD.user || oD.orders || [];
        setStats({
          products: pD.product?.length || 0,
          categories: cD.category?.length || 0,
          orders: orderList.length,
          users: uD.users?.length || 0,
        });
        setRecentOrders(orderList.slice(0, 5));
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div>
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Welcome, Admin 👋</h1>
          <p className="admin-subtitle">Live store performance indicators</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "32px" }}>
        <div className="admin-card" style={{ marginBottom: 0 }}>
          <p style={{ color: "var(--admin-text-muted)", margin: "0 0 8px 0" }}>Products</p>
          <h2 style={{ margin: 0 }}>{stats.products}</h2>
        </div>
        <div className="admin-card" style={{ marginBottom: 0 }}>
          <p style={{ color: "var(--admin-text-muted)", margin: "0 0 8px 0" }}>Orders</p>
          <h2 style={{ margin: 0 }}>{stats.orders}</h2>
        </div>
        <div className="admin-card" style={{ marginBottom: 0 }}>
          <p style={{ color: "var(--admin-text-muted)", margin: "0 0 8px 0" }}>Users</p>
          <h2 style={{ margin: 0 }}>{stats.users}</h2>
        </div>
        <div className="admin-card" style={{ marginBottom: 0 }}>
          <p style={{ color: "var(--admin-text-muted)", margin: "0 0 8px 0" }}>Categories</p>
          <h2 style={{ margin: 0 }}>{stats.categories}</h2>
        </div>
      </div>

      <div className="admin-card" style={{ padding: 0 }}>
        <div style={{ padding: "18px 24px", borderBottom: "1px solid var(--admin-border)" }}>
          <h3 style={{ margin: 0 }}>Recent Orders</h3>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Status</th>
              <th>Items</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((ord) => (
              <tr key={ord._id}>
                <td>{ord._id}</td>
                <td>
                  <span className={`badge badge-${(ord.status || "pending").toLowerCase()}`}>
                    {ord.status || "Pending"}
                  </span>
                </td>
                <td>{ord.product?.length || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}