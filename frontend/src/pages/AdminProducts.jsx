import React, { useState, useEffect } from "react";
import "./Admin.css";
import API_URL from "../api";
const API = `${API_URL}/auth/admin`;

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    photo: "",
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        fetch(`${API}/products`, { credentials: "include" }),
        fetch(`${API}/product/category`, { credentials: "include" }),
      ]);

      const prodData = await prodRes.json();
      const catData = await catRes.json();

      setProducts(Array.isArray(prodData.product) ? prodData.product : []);
      setCategories(Array.isArray(catData.category) ? catData.category : []);
    } catch (err) {
      console.error("Data load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.category) {
      alert("Please select a category.");
      return;
    }

    const endpoint = isEditing ? `${API}/product/${isEditing}` : `${API}/product/add`;
    const method = isEditing ? "PUT" : "POST";

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setIsEditing(null);
        setFormData({ name: "", description: "", price: "", category: "", photo: "" });
        loadData();
      } else {
        alert(data.message || "Failed to save product");
      }
    } catch (err) {
      console.error("Product submission error:", err);
      alert("Error saving product");
    }
  };

  const handleEditClick = (prod) => {
    setIsEditing(prod._id);
    setFormData({
      name: prod.name,
      description: prod.description || "",
      price: prod.price,
      // Extracts ID whether category was populated as object or stored as a raw ID string
      category: prod.category?._id || prod.category || "",
      photo: prod.photo || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product permanently?")) return;

    try {
      const res = await fetch(`${API}/product/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p._id !== id));
      } else {
        const data = await res.json();
        alert(data.message || "Failed to delete product");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Network error while deleting product");
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(null);
    setFormData({ name: "", description: "", price: "", category: "", photo: "" });
  };

  const filteredProducts = products.filter((p) =>
    p.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Products</h1>
          <p className="admin-subtitle">Live product inventory management</p>
        </div>
        <div style={{ width: "260px" }}>
          <input
            type="text"
            className="admin-input"
            placeholder="Search product..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* PRODUCT FORM */}
      <div className="admin-card">
        <h3 style={{ margin: "0 0 16px 0" }}>
          {isEditing ? "Edit Product" : "Add New Product"}
        </h3>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px" }}>
            <div>
              <label style={labelStyle}>Product Name *</label>
              <input
                className="admin-input"
                placeholder="Product name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div>
              <label style={labelStyle}>Price (₹) *</label>
              <input
                className="admin-input"
                type="number"
                min="0"
                placeholder="Price"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </div>

            <div>
              <label style={labelStyle}>Category *</label>
              <select
                className="admin-select"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={labelStyle}>Image URL *</label>
              <input
                className="admin-input"
                placeholder="https://..."
                value={formData.photo}
                onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Description *</label>
            <textarea
              className="admin-textarea"
              style={{ minHeight: "75px" }}
              placeholder="Product description and specs..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          {formData.photo && (
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "0.85rem", color: "var(--admin-text-muted)" }}>Preview:</span>
              <img
                src={formData.photo}
                alt="preview"
                style={{ width: "48px", height: "48px", objectFit: "contain", borderRadius: "6px", backgroundColor: "#000" }}
                onError={(e) => { e.target.style.display = "none"; }}
              />
            </div>
          )}

          <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
            <button type="submit" className="admin-btn">
              {isEditing ? "Update Product" : "Save Product"}
            </button>
            {isEditing && (
              <button type="button" className="admin-btn-danger" onClick={handleCancelEdit}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* PRODUCTS TABLE */}
      <div className="admin-card" style={{ padding: 0, overflowX: "auto" }}>
        {loading ? (
          <p style={{ padding: "24px", color: "var(--admin-text-muted)" }}>Loading products...</p>
        ) : filteredProducts.length === 0 ? (
          <p style={{ padding: "24px", color: "var(--admin-text-muted)" }}>No products found.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p) => (
                <tr key={p._id}>
                  <td>
                    <img
                      src={p.photo}
                      alt={p.name}
                      style={{
                        width: "44px",
                        height: "44px",
                        objectFit: "contain",
                        borderRadius: "6px",
                        backgroundColor: "#0d121d",
                      }}
                      onError={(e) => {
                        e.target.src = "https://placehold.co/100x100?text=No+Image";
                      }}
                    />
                  </td>
                  <td style={{ fontWeight: 600 }}>{p.name}</td>
                  <td>
                    <span className="badge badge-shipped">
                      {p.category?.name || "Uncategorized"}
                    </span>
                  </td>
                  <td>₹{p.price?.toLocaleString("en-IN")}</td>
                  <td>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        type="button"
                        className="admin-btn"
                        style={{ padding: "6px 12px", fontSize: "0.8rem" }}
                        onClick={() => handleEditClick(p)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="admin-btn-danger"
                        onClick={() => handleDelete(p._id)}
                      >
                        Delete
                      </button>
                    </div>
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

const labelStyle = {
  display: "block",
  fontSize: "0.8rem",
  fontWeight: 500,
  color: "var(--admin-text-muted)",
  marginBottom: "6px",
};