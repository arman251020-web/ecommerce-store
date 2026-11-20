
import { useEffect, useState } from "react";
import "./Products.css";
import Navbar from "./Navbar";
import API_URL from "../api";

function Products() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [wishlistIds, setWishlistIds] = useState(new Set());
    const [toast, setToast] = useState(null);

    const fallbackImage = "https://placehold.co/300x200?text=No+Image";

    const showToast = (message, image = null, name = null) => {
        setToast({ message, image, name });
        setTimeout(() => setToast(null), 2500);
    };

    const getProducts = async () => {
        try {
            const response = await fetch(`${API_URL}/auth/user/product`, {
                credentials: "include"
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to load products");
            }

            const productList = Array.isArray(data.product)
                ? data.product
                : Array.isArray(data.products)
                    ? data.products
                    : [];

            setProducts(productList);
            setError("");
        } catch (err) {
            console.error("Product error:", err);
            setProducts([]);
            setError(err.message || "Unable to load products");
        }
    };

    const getCategories = async () => {
        try {
            const response = await fetch(`${API_URL}/auth/user/category`, {
                credentials: "include"
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to load categories");
            }

            setCategories(Array.isArray(data.category) ? data.category : []);
        } catch (err) {
            console.error("Category error:", err);
        }
    };

    const getWishlist = async () => {
        try {
            const response = await fetch(`${API_URL}/auth/user/wishlist`, {
                credentials: "include"
            });

            if (!response.ok) {
                throw new Error("Failed to load wishlist");
            }

            const data = await response.json();

            if (data.wishlist && Array.isArray(data.wishlist.product)) {
                const ids = data.wishlist.product.map((product) =>
                    String(
                        product && typeof product === "object"
                            ? product._id
                            : product
                    )
                );

                setWishlistIds(new Set(ids));
            } else {
                setWishlistIds(new Set());
            }
        } catch (err) {
            console.error("Wishlist error:", err);
            setWishlistIds(new Set());
        }
    };

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);

            await Promise.all([
                getProducts(),
                getCategories(),
                getWishlist()
            ]);

            setLoading(false);
        };

        loadData();
    }, []);

    const filterCategory = (categoryId) => {
        setSelectedCategory(String(categoryId));
    };

    const toggleWishlist = async (product) => {
        const productId = String(product._id);
        const isWishlisted = wishlistIds.has(productId);
        const productImage = product.photo || product.image || fallbackImage;

        try {
            const response = await fetch(
                `${API_URL}/auth/user/wishlist/${productId}`,
                {
                    method: isWishlisted ? "DELETE" : "POST",
                    credentials: "include"
                }
            );

            if (!response.ok) {
                showToast("Wishlist request failed");
                return;
            }

            setWishlistIds((previous) => {
                const next = new Set(previous);

                if (isWishlisted) {
                    next.delete(productId);
                } else {
                    next.add(productId);
                }

                return next;
            });

            showToast(
                isWishlisted ? "Removed from wishlist" : "Added to wishlist",
                productImage,
                product.name
            );
        } catch (err) {
            console.error("Wishlist error:", err);
            showToast("Something went wrong");
        }
    };

    const addToCart = async (product) => {
        const productImage = product.photo || product.image || fallbackImage;

        try {
            const response = await fetch(`${API_URL}/auth/user/cart`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    productid: String(product._id),
                    quantity: 1
                })
            });

            if (!response.ok) {
                showToast("Unable to add to cart");
                return;
            }

            showToast("Added to cart", productImage, product.name);
        } catch (err) {
            console.error("Cart error:", err);
            showToast("Something went wrong");
        }
    };

    const filteredProducts =
        selectedCategory === "All"
            ? products
            : products.filter((item) => {
                if (item.category && typeof item.category === "object") {
                    return String(item.category._id) === selectedCategory;
                }

                return String(item.category) === selectedCategory;
            });

    if (loading) {
        return (
            <div className="products-page">
                <Navbar />
                <div className="loading">Loading products...</div>
            </div>
        );
    }

    return (
        <div className="products-page">
            <Navbar />

            {toast && (
                <div className="toast">
                    {toast.image && (
                        <img
                            src={toast.image}
                            alt={toast.name || "Product"}
                            className="toast-image"
                            onError={(e) => {
                                e.target.src = fallbackImage;
                            }}
                        />
                    )}

                    <div className="toast-content">
                        <strong>{toast.message}</strong>
                        {toast.name && <p>{toast.name}</p>}
                    </div>

                    <button
                        className="toast-close"
                        onClick={() => setToast(null)}
                    >
                        ×
                    </button>
                </div>
            )}

            <div className="products-header">
                <div>
                    <h1>Products</h1>
                    <p>Explore our products</p>
                </div>
            </div>

            <div className="category-container">
                <button
                    className={
                        selectedCategory === "All"
                            ? "category-btn active"
                            : "category-btn"
                    }
                    onClick={() => filterCategory("All")}
                >
                    All
                </button>

                {categories.map((cat) => (
                    <button
                        key={cat._id}
                        className={
                            selectedCategory === String(cat._id)
                                ? "category-btn active"
                                : "category-btn"
                        }
                        onClick={() => filterCategory(cat._id)}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>

            {error && <div className="error">{error}</div>}

            <div className="product-count">
                {filteredProducts.length} products
            </div>

            {filteredProducts.length === 0 ? (
                <div className="no-products">
                    <h2>No products found</h2>
                    <p>{error || "There are no products in this category."}</p>
                </div>
            ) : (
                <div className="product-grid">
                    {filteredProducts.map((item) => {
                        const isWishlisted = wishlistIds.has(String(item._id));
                        const productImage =
                            item.photo || item.image || fallbackImage;

                        return (
                            <div className="product-card" key={item._id}>
                                <div className="product-image">
                                    <img
                                        src={productImage}
                                        alt={item.name}
                                        onError={(e) => {
                                            e.target.src = fallbackImage;
                                        }}
                                    />
                                </div>

                                <div className="product-details">
                                    <h2>{item.name}</h2>
                                    <p className="description">
                                        {item.description}
                                    </p>

                                    <div className="product-bottom">
                                        <span className="price">
                                            ₹{Number(item.price || 0).toLocaleString("en-IN")}
                                        </span>

                                        <div className="product-actions">
                                            <button
                                                className={
                                                    isWishlisted
                                                        ? "wishlist-btn active"
                                                        : "wishlist-btn"
                                                }
                                                title={
                                                    isWishlisted
                                                        ? "Remove from wishlist"
                                                        : "Add to wishlist"
                                                }
                                                onClick={() => toggleWishlist(item)}
                                            >
                                                {isWishlisted ? "♥" : "♡"}
                                            </button>

                                            <button
                                                className="cart-btn"
                                                onClick={() => addToCart(item)}
                                            >
                                                Add
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default Products;
