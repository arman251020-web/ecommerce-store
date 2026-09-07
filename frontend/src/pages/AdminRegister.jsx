import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminRegister() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        adminpass: ""
    });

    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        setIsError(false);

        try {
            const response = await fetch("http://localhost:5000/auth/admin/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include", // Preserves cookies if backend sets them on register
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.status === 201) {
                setMessage(data.message || "User created successfully");
                
                // Save user data for role checking & navbar state
                localStorage.setItem("user", JSON.stringify(data.user));

                // Redirect to admin home
                navigate("/auth/admin/home");
            } else {
                setIsError(true);
                setMessage(data.message || "Registration failed");
            }
        } catch (error) {
            console.error("Admin registration error:", error);
            setIsError(true);
            setMessage("Unable to connect to server");
        } finally {
            setLoading(false);
        }
    };

    const styles = {
        container: {
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#0b0f19",
            fontFamily: "Inter, system-ui, -apple-system, sans-serif",
            padding: "20px"
        },
        card: {
            width: "100%",
            maxWidth: "460px",
            backgroundColor: "#131a2a",
            borderRadius: "16px",
            padding: "36px",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.4)"
        },
        header: {
            marginBottom: "28px",
            textAlign: "center"
        },
        badge: {
            display: "inline-block",
            padding: "4px 10px",
            backgroundColor: "rgba(124, 58, 237, 0.15)",
            border: "1px solid rgba(124, 58, 237, 0.3)",
            borderRadius: "6px",
            color: "#a78bfa",
            fontSize: "0.75rem",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "1px",
            marginBottom: "12px"
        },
        title: {
            color: "#ffffff",
            fontSize: "1.5rem",
            fontWeight: 700,
            margin: "0 0 8px 0"
        },
        subtitle: {
            color: "#94a3b8",
            fontSize: "0.88rem",
            margin: 0
        },
        form: {
            display: "flex",
            flexDirection: "column",
            gap: "18px"
        },
        fieldGroup: {
            display: "flex",
            flexDirection: "column",
            gap: "6px"
        },
        label: {
            color: "#cbd5e1",
            fontSize: "0.85rem",
            fontWeight: 500
        },
        input: {
            width: "100%",
            padding: "10px 14px",
            backgroundColor: "#0d121d",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            borderRadius: "8px",
            color: "#f8fafc",
            fontSize: "0.9rem",
            outline: "none",
            boxSizing: "border-box",
            transition: "border-color 0.2s"
        },
        button: {
            marginTop: "10px",
            padding: "12px",
            backgroundColor: "#7c3aed",
            color: "#ffffff",
            border: "none",
            borderRadius: "8px",
            fontSize: "0.95rem",
            fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
            transition: "background-color 0.2s ease"
        },
        message: {
            padding: "10px",
            borderRadius: "8px",
            fontSize: "0.85rem",
            textAlign: "center",
            marginTop: "16px",
            backgroundColor: isError ? "rgba(239, 68, 68, 0.1)" : "rgba(34, 197, 94, 0.1)",
            color: isError ? "#f87171" : "#4ade80",
            border: `1px solid ${isError ? "rgba(239, 68, 68, 0.2)" : "rgba(34, 197, 94, 0.2)"}`
        },
        footerText: {
            color: "#64748b",
            fontSize: "0.85rem",
            textAlign: "center",
            marginTop: "20px"
        },
        linkSpan: {
            color: "#a78bfa",
            cursor: "pointer",
            fontWeight: 500,
            marginLeft: "6px"
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.header}>
                    <span style={styles.badge}>Admin Portal</span>
                    <h1 style={styles.title}>Register Administrator</h1>
                    <p style={styles.subtitle}>Create an authorized admin account</p>
                </div>

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.fieldGroup}>
                        <label style={styles.label}>Full Name</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter your name"
                            value={formData.name}
                            onChange={handleChange}
                            style={styles.input}
                            required
                        />
                    </div>

                    <div style={styles.fieldGroup}>
                        <label style={styles.label}>Email Address</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="admin@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            style={styles.input}
                            required
                        />
                    </div>

                    <div style={styles.fieldGroup}>
                        <label style={styles.label}>Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Create password"
                            value={formData.password}
                            onChange={handleChange}
                            style={styles.input}
                            required
                        />
                    </div>

                    <div style={styles.fieldGroup}>
                        <label style={styles.label}>Admin Security Key (adminpass)</label>
                        <input
                            type="password"
                            name="adminpass"
                            placeholder="Enter secret authorization key"
                            value={formData.adminpass}
                            onChange={handleChange}
                            style={styles.input}
                            required
                        />
                    </div>

                    <button type="submit" style={styles.button} disabled={loading}>
                        {loading ? "Registering..." : "Create Admin Account"}
                    </button>
                </form>

                {message && <div style={styles.message}>{message}</div>}

                <p style={styles.footerText}>
                    Already have an admin account?
                    <span style={styles.linkSpan} onClick={() => navigate("/login")}>
                        Login
                    </span>
                </p>
            </div>
        </div>
    );
}

export default AdminRegister;