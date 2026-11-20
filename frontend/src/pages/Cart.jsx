import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import "./Cart.css";
import API_URL from "../api";
const API = `${API_URL}`;

function Cart() {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);
    const [clearing, setClearing] = useState(false);
    const [error, setError] = useState("");

    // =========================
    // GET CART
    // =========================
    const getCart = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(`${API}/auth/user/cart`, {
                method: "GET",
                credentials: "include"
            });

            const data = await response.json();

            if (data.message === "empty" || !data.cart || !data.cart.items) {
                setCart(null);
            } else {
                setCart(data.cart);
            }
        } catch (err) {
            console.error(err);
            setError("Unable to load your cart.");
        } finally {
            setLoading(false);
        }
    };

    // =========================
    // UPDATE QUANTITY (+ / -)
    // =========================
    const updateQuantity = async (productId, currentQuantity, change) => {
        if (currentQuantity + change <= 0) {
            removeProduct(productId);
            return;
        }

        try {
            setUpdatingId(productId);

            const response = await fetch(`${API}/auth/user/cart`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    productid: productId,
                    quantity: change
                })
            });

            const data = await response.json();

            if (response.ok && data.cart) {
                setCart(data.cart);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setUpdatingId(null);
        }
    };

    // =========================
    // REMOVE PRODUCT
    // =========================
    const removeProduct = async (productId) => {
        try {
            setUpdatingId(productId);

            const response = await fetch(`${API}/auth/user/cart/${productId}`, {
                method: "DELETE",
                credentials: "include"
            });

            const data = await response.json();

            if (data.cart && data.cart.items.length > 0) {
                setCart(data.cart);
            } else {
                setCart(null);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setUpdatingId(null);
        }
    };

    // =========================
    // CLEAR CART
    // =========================
    const clearCart = async () => {
        if (!window.confirm("Are you sure you want to remove all items from your cart?")) {
            return;
        }

        try {
            setClearing(true);

            await fetch(`${API}/auth/user/cart`, {
                method: "DELETE",
                credentials: "include"
            });

            setCart(null);
        } catch (err) {
            console.error(err);
        } finally {
            setClearing(false);
        }
    };

    useEffect(() => {
        getCart();
    }, []);

    // =========================
    // LOADING STATE
    // =========================
    if (loading) {
        return (
            <>
                <Navbar />
                <div className="cart-page">
                    <div className="cart-loading">
                        <div className="spinner"></div>
                        <p>Loading your cart...</p>
                    </div>
                </div>
            </>
        );
    }

    // =========================
    // ERROR STATE
    // =========================
    if (error) {
        return (
            <>
                <Navbar />
                <div className="cart-page">
                    <div className="cart-error">
                        <div className="error-icon">⚠️</div>
                        <h2>Something went wrong</h2>
                        <p>{error}</p>
                        <button onClick={getCart}>Try Again</button>
                    </div>
                </div>
            </>
        );
    }

    // =========================
    // EMPTY STATE
    // =========================
    if (!cart || !cart.items || cart.items.length === 0) {
        return (
            <>
                <Navbar />
                <div className="cart-page">
                    <div className="empty-cart">
                        <div className="empty-cart-icon">🛒</div>
                        <h1>Your cart is empty</h1>
                        <p>
                            You haven't added anything to your cart yet.
                            Explore our products and find something you love.
                        </p>
                        <button onClick={() => { window.location.href = "/products"; }}>
                            Start Shopping
                        </button>
                    </div>
                </div>
            </>
        );
    }

    // =========================
    // CALCULATIONS
    // =========================
    const subtotal = cart.items.reduce((total, item) => {
        const price = Number(item.product?.price) || 0;
        return total + price * item.quantity;
    }, 0);

    const delivery = subtotal >= 500 ? 0 : 50;
    const total = subtotal + delivery;

    return (
        <>
            <Navbar />

            <div className="cart-page">
                <div className="cart-container">

                    {/* HEADER */}
                    <div className="cart-header">
                        <div>
                            <h1>Shopping Cart</h1>
                            <p>
                                {cart.items.length} {cart.items.length === 1 ? "item" : "items"} in your cart
                            </p>
                        </div>

                        <button
                            className="clear-cart"
                            onClick={clearCart}
                            disabled={clearing}
                        >
                            {clearing ? "Clearing..." : "Clear Cart"}
                        </button>
                    </div>

                    {/* CART CONTENT */}
                    <div className="cart-layout">

                        {/* PRODUCTS LIST */}
                        <div className="cart-products">
                            {cart.items.map((item) => {
                                const product = item.product;
                                if (!product) return null;

                                const unitPrice = Number(product.price) || 0;
                                const itemTotal = unitPrice * item.quantity;
                                const isBusy = updatingId === product._id;

                                return (
                                    <div className="cart-item" key={product._id}>
                                        
                                        {/* IMAGE */}
                                        <div className="cart-image">
                                            <img
                                                src={product.photo || product.image || "https://placehold.co/150x150?text=No+Image"}
                                                alt={product.name}
                                                onError={(e) => {
                                                    e.target.src = "https://placehold.co/150x150?text=No+Image";
                                                }}
                                            />
                                        </div>

                                        {/* PRODUCT DETAILS */}
                                        <div className="cart-details">
                                            <h2>{product.name}</h2>
                                            <p className="cart-price">
                                                ₹{unitPrice.toLocaleString("en-IN")}
                                            </p>

                                            <div className="quantity-box">
                                                <button
                                                    disabled={isBusy}
                                                    onClick={() => updateQuantity(product._id, item.quantity, -1)}
                                                >
                                                    −
                                                </button>

                                                <span>{item.quantity}</span>

                                                <button
                                                    disabled={isBusy}
                                                    onClick={() => updateQuantity(product._id, item.quantity, 1)}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>

                                        {/* TOTAL & REMOVE */}
                                        <div className="cart-item-right">
                                            <strong>
                                                ₹{itemTotal.toLocaleString("en-IN")}
                                            </strong>

                                            <button
                                                className="remove-button"
                                                disabled={isBusy}
                                                onClick={() => removeProduct(product._id)}
                                            >
                                                {isBusy ? "Updating..." : "Remove"}
                                            </button>
                                        </div>

                                    </div>
                                );
                            })}
                        </div>

                        {/* ORDER SUMMARY */}
                        <div className="cart-summary">
                            <h2>Order Summary</h2>

                            <div className="summary-row">
                                <span>Subtotal</span>
                                <span>₹{subtotal.toLocaleString("en-IN")}</span>
                            </div>

                            <div className="summary-row">
                                <span>Delivery</span>
                                <span className="delivery">
                                    {delivery === 0 ? "FREE" : `₹${delivery}`}
                                </span>
                            </div>

                            {delivery > 0 && (
                                <div className="free-delivery-message">
                                    Add ₹{(500 - subtotal).toLocaleString("en-IN")} more for free delivery
                                </div>
                            )}

                            <div className="summary-line"></div>

                            <div className="summary-total">
                                <span>Total</span>
                                <strong>₹{total.toLocaleString("en-IN")}</strong>
                            </div>

                            <button
                                className="checkout-button"
                                onClick={() => { window.location.href = "/checkout"; }}
                            >
                                Proceed to Checkout <span>→</span>
                            </button>

                            <button
                                className="continue-shopping"
                                onClick={() => { window.location.href = "/products"; }}
                            >
                                ← Continue Shopping
                            </button>

                            <div className="secure-checkout">
                                🔒 Secure checkout
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}

export default Cart;