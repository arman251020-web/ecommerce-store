import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import "./Home.css";
import API_URL from "../api";
function Home() {
    const navigate = useNavigate();

    // 1. Track authentication using stored user data
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        setIsLoggedIn(Boolean(storedUser));
    }, []);

    // 2. Remove user from localStorage on logout
    const handleLogout = () => {
        localStorage.removeItem("user");
        setIsLoggedIn(false);
        navigate("/");
    };

    return (
        <div className="home">
            {/* REUSABLE NAVBAR */}
            <Navbar 
                isLoggedIn={isLoggedIn}
                cartCount={2}
                onLogout={handleLogout}
            />
            {/* HERO */}
            <section className="hero">
                <div className="hero-content">
                    <p className="hero-small">
                        NEW COLLECTION 2026
                    </p>

                    <h1>
                        Discover Your
                        <br />
                        <span>Perfect Style.</span>
                    </h1>

                    <p className="hero-description">
                        Explore our latest collection of premium
                        products designed for your lifestyle.
                    </p>

                    <div className="hero-buttons">
                        <button
                            className="shop-btn"
                            onClick={() => navigate("/products")}
                        >
                            Shop Now →
                        </button>

                        <button
                            className="explore-btn"
                            onClick={() => navigate("/products")}
                        >
                            Explore Categories
                        </button>
                    </div>
                </div>

                <div className="hero-image">
                    <div className="product-circle">
                        🛍️
                    </div>
                </div>
            </section>

            {/* FEATURES */}
            <section className="features">
                <div className="feature">
                    <div className="feature-icon">🚚</div>
                    <div>
                        <h3>Free Shipping</h3>
                        <p>On orders over ₹999</p>
                    </div>
                </div>

                <div className="feature">
                    <div className="feature-icon">🔒</div>
                    <div>
                        <h3>Secure Payment</h3>
                        <p>100% secure checkout</p>
                    </div>
                </div>

                <div className="feature">
                    <div className="feature-icon">↩️</div>
                    <div>
                        <h3>Easy Returns</h3>
                        <p>30 day return policy</p>
                    </div>
                </div>

                <div className="feature">
                    <div className="feature-icon">⭐</div>
                    <div>
                        <h3>Top Quality</h3>
                        <p>Premium products</p>
                    </div>
                </div>
            </section>

            {/* CATEGORIES */}
            <section className="categories">
                <div className="section-heading">
                    <p>SHOP BY CATEGORY</p>
                    <h2>Find What You Love</h2>
                </div>

                <div className="category-grid">
                    <div className="category-card" onClick={() => navigate("/products")}>
                        <div className="category-icon">👕</div>
                        <h3>Fashion</h3>
                        <p>120+ Products</p>
                    </div>

                    <div className="category-card" onClick={() => navigate("/products")}>
                        <div className="category-icon">💻</div>
                        <h3>Electronics</h3>
                        <p>80+ Products</p>
                    </div>

                    <div className="category-card" onClick={() => navigate("/products")}>
                        <div className="category-icon">🏠</div>
                        <h3>Home & Living</h3>
                        <p>150+ Products</p>
                    </div>

                    <div className="category-card" onClick={() => navigate("/products")}>
                        <div className="category-icon">🎒</div>
                        <h3>Accessories</h3>
                        <p>90+ Products</p>
                    </div>
                </div>
            </section>

            {/* PRODUCTS */}

            {/* CTA */}
            <section className="cta">
                <div>
                    <p>SPECIAL OFFER</p>
                    <h2>
                        Get 20% Off Your
                        <br />
                        First Order
                    </h2>
                    <span>
                        Use code: <strong>WELCOME20</strong>
                    </span>
                </div>

                <button onClick={() => navigate("/products")}>
                    Start Shopping →
                </button>
            </section>

            {/* FOOTER */}
            <footer className="footer">
                <div className="footer-brand">
                    <h2>Shop<span>.</span></h2>
                    <p>
                        Your one-stop destination for
                        quality products and great prices.
                    </p>
                </div>

                <div className="footer-column">
                    <h3>Shop</h3>
                    <p>Products</p>
                    <p>Categories</p>
                    <p>New Arrivals</p>
                    <p>Best Sellers</p>
                </div>

                <div className="footer-column">
                    <h3>Account</h3>
                    <p onClick={() => navigate("/login")}>Login</p>
                    <p onClick={() => navigate("/register")}>Register</p>
                    <p>My Orders</p>
                    <p>Wishlist</p>
                </div>

                <div className="footer-column">
                    <h3>Support</h3>
                    <p>Contact Us</p>
                    <p>Shipping</p>
                    <p>Returns</p>
                    <p>FAQ</p>
                </div>
            </footer>

            <div className="footer-bottom">
                <p>© 2026 Shop. All rights reserved.</p>
                <p>Privacy Policy &nbsp; | &nbsp; Terms</p>
            </div>
        </div>
    );
}

export default Home;