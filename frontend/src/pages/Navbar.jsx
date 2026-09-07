import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Navbar({ 
  userAvatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
  cartCount = 0
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  // Sync user from localStorage whenever URL/route changes
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (err) {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [location.pathname]);

  const links = [
    { label: "Home", path: "/home" },
    { label: "Shop", path: "/products" },
    { label: "Categories", path: "/categories" },
    { label: "About", path: "/about" },
  ];

  const handleSearchSubmit = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5000/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("user");
      setUser(null);
      navigate("/login");
    }
  };

  const isLoggedIn = Boolean(user);

  const styles = {
    navbar: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "12px 32px",
      backgroundColor: "#0d131f",
      fontFamily: "Inter, system-ui, -apple-system, sans-serif",
      borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
      gap: "24px",
      position: "sticky",
      top: 0,
      zIndex: 100,
    },
    navLeft: {
      display: "flex",
      alignItems: "center",
      gap: "36px",
    },
    brand: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      fontSize: "1.25rem",
      fontWeight: 700,
      color: "#ffffff",
      cursor: "pointer",
      userSelect: "none",
    },
    brandIcon: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "32px",
      height: "32px",
      borderRadius: "8px",
      background: "linear-gradient(135deg, #7c3aed, #ec4899)",
    },
    linksList: {
      display: "flex",
      alignItems: "center",
      gap: "24px",
      listStyle: "none",
      margin: 0,
      padding: 0,
    },
    navLink: (isActive) => ({
      background: "none",
      border: "none",
      fontSize: "0.92rem",
      fontWeight: 500,
      cursor: "pointer",
      color: isActive ? "#a78bfa" : "#94a3b8",
      transition: "color 0.2s ease",
      padding: "4px 0",
    }),
    navRight: {
      display: "flex",
      alignItems: "center",
      gap: "18px",
      flexShrink: 0,
    },
    searchBox: {
      position: "relative",
      display: "flex",
      alignItems: "center",
      width: "260px",
    },
    searchIcon: {
      position: "absolute",
      left: "12px",
      color: "#64748b",
      pointerEvents: "none",
    },
    searchInput: {
      width: "100%",
      padding: "8px 14px 8px 36px",
      backgroundColor: searchFocused ? "#1a2130" : "#141a26",
      border: `1px solid ${searchFocused ? "#7c3aed" : "rgba(255, 255, 255, 0.08)"}`,
      borderRadius: "20px",
      color: "#f8fafc",
      fontSize: "0.85rem",
      outline: "none",
      transition: "all 0.2s ease",
    },
    actionsGroup: {
      display: "flex",
      alignItems: "center",
      gap: "14px",
    },
    iconBtn: {
      position: "relative",
      background: "none",
      border: "none",
      color: "#cbd5e1",
      cursor: "pointer",
      padding: "6px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    badge: {
      position: "absolute",
      top: "0px",
      right: "-2px",
      backgroundColor: "#ef4444",
      color: "#ffffff",
      fontSize: "0.65rem",
      fontWeight: 700,
      height: "16px",
      minWidth: "16px",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    avatar: {
      width: "32px",
      height: "32px",
      borderRadius: "50%",
      objectFit: "cover",
      border: "2px solid rgba(255, 255, 255, 0.2)",
      cursor: "pointer",
    },
    loginBtn: {
      backgroundColor: "transparent",
      color: "#cbd5e1",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      padding: "7px 16px",
      borderRadius: "8px",
      fontSize: "0.85rem",
      fontWeight: 500,
      cursor: "pointer",
    },
    registerBtn: {
      backgroundColor: "#7c3aed",
      color: "#ffffff",
      border: "none",
      padding: "7px 16px",
      borderRadius: "8px",
      fontSize: "0.85rem",
      fontWeight: 500,
      cursor: "pointer",
    },
    logoutBtn: {
      backgroundColor: "transparent",
      color: "#f87171",
      border: "1px solid rgba(248, 113, 113, 0.3)",
      padding: "6px 12px",
      borderRadius: "6px",
      fontSize: "0.8rem",
      fontWeight: 500,
      cursor: "pointer",
    },
  };

  return (
    <header style={styles.navbar}>
      <div style={styles.navLeft}>
        <div style={styles.brand} onClick={() => navigate("/")}>
          <div style={styles.brandIcon}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </div>
          <span>ShopNest</span>
        </div>

        <ul style={styles.linksList}>
          {links.map((link) => (
            <li key={link.label}>
              <button
                type="button"
                style={styles.navLink(location.pathname === link.path)}
                onClick={() => navigate(link.path)}
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div style={styles.navRight}>
        <div style={styles.searchBox}>
          <svg style={styles.searchIcon} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchSubmit}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            style={styles.searchInput}
          />
        </div>

        {isLoggedIn ? (
          <div style={styles.actionsGroup}>
            <button
              type="button"
              style={styles.iconBtn}
              aria-label="Wishlist"
              onClick={() => navigate("/wishlist")}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>

            <button
              type="button"
              style={styles.iconBtn}
              aria-label="Cart"
              onClick={() => navigate("/cart")}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              {cartCount > 0 && <span style={styles.badge}>{cartCount}</span>}
            </button>

            <img
              src={user?.avatar || userAvatar}
              alt="Profile"
              style={styles.avatar}
              onClick={() => navigate("/profile")}
            />

            <button type="button" style={styles.logoutBtn} onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : (
          <div style={styles.actionsGroup}>
            <button
              type="button"
              style={styles.loginBtn}
              onClick={() => navigate("/login")}
            >
              Login
            </button>
            <button
              type="button"
              style={styles.registerBtn}
              onClick={() => navigate("/register")}
            >
              Register
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;