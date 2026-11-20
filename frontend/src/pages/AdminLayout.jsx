import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "./Admin.css";

export default function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-brand">Shop.</div>

        <nav className="admin-nav">
          <NavLink to="/auth/admin/dashboard" className={({ isActive }) => `admin-nav-item ${isActive ? "active" : ""}`}>
            📊 Dashboard
          </NavLink>
          <NavLink to="/auth/admin/products" className={({ isActive }) => `admin-nav-item ${isActive ? "active" : ""}`}>
            📦 Products
          </NavLink>
          <NavLink to="/auth/admin/categories" className={({ isActive }) => `admin-nav-item ${isActive ? "active" : ""}`}>
            🏷️ Categories
          </NavLink>
          <NavLink to="/auth/admin/users" className={({ isActive }) => `admin-nav-item ${isActive ? "active" : ""}`}>
            👥 Users
          </NavLink>
        </nav>

        <button 
          onClick={handleLogout} 
          className="admin-btn-danger" 
          style={{ marginTop: "auto", textAlign: "center" }}
        >
          🚪 Logout
        </button>
      </aside>

      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}