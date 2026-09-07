import React, { useState, useEffect } from "react";
import "./Admin.css";

const API = "http://localhost:5000/auth/admin";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [newCat, setNewCat] = useState({ name: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadCategories = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/product/category`, { credentials: "include" });
      const data = await res.json();
      if (res.ok && Array.isArray(data.category)) {
        setCategories(data.category);
      } else {
        setCategories([]);
        if (!res.ok) setError(data.message || "Failed to load categories");
      }
    } catch (err) {
      console.error("Fetch categories error:", err);
      setError("Unable to connect to server");
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(`${API}/category/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(newCat),
      });
      const data = await res.json();

      if (res.ok) {
        setCategories((prev) => [...prev, data.category]);
        setNewCat({ name: "", description: "" });
      } else {
        alert(data.message || "Failed to create category");
      }
    } catch (err) {
      console.error("Add category error:", err);
      alert("Network error while adding category");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      const res = await fetch(`${API}/category/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();

      if (res.ok) {
        setCategories((prev) => prev.filter((cat) => cat._id !== id));
      } else {
        alert(data.message || "Cannot delete category");
      }
    } catch (err) {
      console.error("Delete category error:", err);
      alert("Network error while deleting category");
    }
  };

  return (
    <div>
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Categories</h1>
          <p className="admin-subtitle">Organize and manage store classifications</p>
        </div>
        <button onClick={loadCategories} className="admin-btn" style={{ padding: "8px 16px" }}>
          Refresh
        </button>
      </div>

      {error && (
        <div style={{ padding: "12px", background: "rgba(239, 68, 68, 0.15)", color: "#f87171", borderRadius: "8px", marginBottom: "16px" }}>
          {error}
        </div>
      )}

      {/* CREATE CATEGORY FORM */}
      <div className="admin-card">
        <h3 style={{ margin: "0 0 16px 0" }}>Create Category</h3>
        <form onSubmit={handleAddCategory} style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <input
            className="admin-input"
            style={{ flex: 1, minWidth: "220px" }}
            placeholder="Category Name (e.g., Electronics)"
            value={newCat.name}
            onChange={(e) => setNewCat({ ...newCat, name: e.target.value })}
            required
          />
          <input
            className="admin-input"
            style={{ flex: 2, minWidth: "300px" }}
            placeholder="Brief description"
            value={newCat.description}
            onChange={(e) => setNewCat({ ...newCat, description: e.target.value })}
            required
          />
          <button type="submit" className="admin-btn">
            Save Category
          </button>
        </form>
      </div>

      {/* CATEGORIES TABLE */}
      <div className="admin-card" style={{ padding: 0, overflowX: "auto" }}>
        {loading ? (
          <p style={{ padding: "24px", color: "var(--admin-text-muted)" }}>Loading categories...</p>
        ) : categories.length === 0 ? (
          <p style={{ padding: "24px", color: "var(--admin-text-muted)" }}>No categories found.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Category ID</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat._id}>
                  <td style={{ fontWeight: 600, color: "#fff" }}>{cat.name}</td>
                  <td>{cat.description}</td>
                  <td style={{ fontSize: "0.8rem", color: "var(--admin-text-muted)" }}>{cat._id}</td>
                  <td>
                    <button className="admin-btn-danger" onClick={() => handleDelete(cat._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}