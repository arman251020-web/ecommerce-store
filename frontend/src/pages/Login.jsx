import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";
import API_URL from "../api";
function Login() {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                setMessage(data.message || "Login failed");
                return;
            }

            setMessage("Login successful");

            // Save user directly to localStorage
            localStorage.setItem("user", JSON.stringify(data.user));

            if (data.user?.role === "admin") {
                navigate("/admin/home");
            } else {
                navigate("/home");
            }

        } catch (error) {
            console.error("Login error:", error);
            setMessage("Unable to connect to server");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-left">
                    <h1>Welcome Back</h1>
                    <p>
                        Login to your account and continue
                        shopping with us.
                    </p>
                    <div className="auth-decoration">
                        🛒
                    </div>
                </div>

                <div className="auth-right">
                    <h2>Login</h2>
                    <p className="auth-subtitle">
                        Enter your account details
                    </p>

                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label>Password</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <button 
                            type="submit" 
                            className="auth-button"
                            disabled={loading}
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </form>

                    {message && (
                        <p className="auth-message">
                            {message}
                        </p>
                    )}

                    <p className="auth-switch">
                        Don't have an account?{" "}
                        <span onClick={() => navigate("/register")}>
                            Register
                        </span>
                    </p>
                     <p className="auth-switch">
                        Don't have an account?{" "}
                        <span onClick={() => navigate("/auth/admin/register")}>
                            Admin Register
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;