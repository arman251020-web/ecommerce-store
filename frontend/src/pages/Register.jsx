import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";
import API_URL from "../api";
function Register() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        address: ""
    });

    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            const response = await fetch(
                `${API_URL}/auth/user/register`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include",
                    body: JSON.stringify(formData)
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setMessage(data.message || "Registration failed");
                return;
            }

            setMessage("Account created successfully!");

            setTimeout(() => {
                navigate("/login");
            }, 1000);

        } catch (error) {
            console.error(error);
            setMessage("Unable to connect to server");
        }
    };

    return (
        <div className="auth-container">

            <div className="auth-card">

                <div className="auth-left">

                    <h1>Create Account</h1>

                    <p>
                        Join us today and start exploring
                        our products.
                    </p>

                    <div className="auth-decoration">
                        ✨
                    </div>

                </div>

                <div className="auth-right">

                    <h2>Register</h2>

                    <p className="auth-subtitle">
                        Create your new account
                    </p>

                    <form onSubmit={handleSubmit}>

                        <div className="input-group">
                            <label>Name</label>

                            <input
                                type="text"
                                name="name"
                                placeholder="Enter your name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

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
                                placeholder="Create a password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label>Address</label>

                            <input
                                type="text"
                                name="address"
                                placeholder="Enter your address"
                                value={formData.address}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="auth-button"
                        >
                            Create Account
                        </button>

                    </form>

                    {message && (
                        <p className="auth-message">
                            {message}
                        </p>
                    )}

                    <p className="auth-switch">
                        Already have an account?
                        <span onClick={() => navigate("/login")}>
                            Login
                        </span>
                    </p>

                </div>

            </div>

        </div>
    );
}

export default Register;