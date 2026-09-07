import { useEffect, useState } from "react";
import "./Products.css";
import Navbar from "./Navbar";

function Products() {

    // =========================
    // STATES
    // =========================

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    const [selectedCategory, setSelectedCategory] = useState("All");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [wishlistIds, setWishlistIds] = useState(new Set());
    const [toast, setToast] = useState(null);

    const fallbackImage = "https://placehold.co/300x200?text=No+Image";


    // =========================
    // TOAST
    // =========================

    const showToast = (message, image = null, name = null) => {

        setToast({
            message,
            image,
            name
        });

        setTimeout(() => {
            setToast(null);
        }, 2500);
    };


    // =========================
    // GET PRODUCTS
    // =========================

    const getProducts = async () => {

        try {

            const response = await fetch(
                "http://localhost:5000/auth/user/product",
                {
                    credentials: "include"
                }
            );

            if (!response.ok) {
                throw new Error("Failed to get products");
            }

            const data = await response.json();

            if (data.product) {
                setProducts(data.product);
            } else {
                setProducts([]);
            }

        } catch (error) {

            console.error("Product error:", error);
            setError("Unable to load products");

        }
    };


    // =========================
    // GET CATEGORIES
    // =========================

    const getCategories = async () => {

        try {

            const response = await fetch(
                "http://localhost:5000/auth/user/category",
                {
                    credentials: "include"
                }
            );

            if (!response.ok) {
                throw new Error("Failed to get categories");
            }

            const data = await response.json();

            if (data.category) {
                setCategories(data.category);
            } else {
                setCategories([]);
            }

        } catch (error) {

            console.error("Category error:", error);

        }
    };


    // =========================
    // GET WISHLIST
    // =========================

    const getWishlist = async () => {

        try {

            const response = await fetch(
                "http://localhost:5000/auth/user/wishlist",
                {
                    credentials: "include"
                }
            );

            if (!response.ok) {
                throw new Error("Failed to get wishlist");
            }

            const data = await response.json();

            if (
                data.wishlist &&
                Array.isArray(data.wishlist.product)
            ) {

                const ids = data.wishlist.product.map((product) => {

                    if (product && typeof product === "object") {
                        return String(product._id);
                    }

                    return String(product);

                });

                setWishlistIds(new Set(ids));

            } else {

                setWishlistIds(new Set());

            }

        } catch (error) {

            console.error("Wishlist error:", error);
            setWishlistIds(new Set());

        }
    };


    // =========================
    // LOAD DATA
    // =========================

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


    // =========================
    // CATEGORY FILTER
    // =========================

    const filterCategory = (categoryId) => {

        setSelectedCategory(String(categoryId));

    };


    // =========================
    // WISHLIST TOGGLE
    // =========================

    const toggleWishlist = async (product) => {

        const productId = String(product._id);
        const isWishlisted = wishlistIds.has(productId);
        const productImage = product.photo || product.image || fallbackImage;

        try {

            const response = await fetch(
                `http://localhost:5000/auth/user/wishlist/${productId}`,
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
                isWishlisted
                    ? "Removed from wishlist"
                    : "Added to wishlist",
                productImage,
                product.name
            );

        } catch (error) {

            console.error("Wishlist error:", error);
            showToast("Something went wrong");

        }
    };


    // =========================
    // ADD TO CART
    // =========================

    const addToCart = async (product) => {

        const productImage = product.photo || product.image || fallbackImage;

        try {

            const response = await fetch(
                "http://localhost:5000/auth/user/cart",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        productid: String(product._id),
                        quantity: 1
                    })
                }
            );

            if (!response.ok) {
                showToast("Unable to add to cart");
                return;
            }

            showToast(
                "Added to cart",
                productImage,
                product.name
            );

        } catch (error) {

            console.error("Cart error:", error);
            showToast("Something went wrong");

        }
    };


    // =========================
    // FILTER PRODUCTS
    // =========================

    const filteredProducts =
        selectedCategory === "All"
            ? products
            : products.filter((item) => {

                if (item.category && typeof item.category === "object") {
                    return (
                        String(item.category._id) === String(selectedCategory)
                    );
                }

                return (
                    String(item.category) === String(selectedCategory)
                );

            });


    // =========================
    // LOADING
    // =========================

    if (loading) {

        return (
            <div className="products-page">
                <Navbar />
                <div className="loading">
                    Loading products...
                </div>
            </div>
        );

    }


    // =========================
    // MAIN UI
    // =========================

    return (

        <div className="products-page">

            <Navbar />


            {/* =========================
                TOAST
            ========================= */}

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


            {/* =========================
                HEADER
            ========================= */}

            <div className="products-header">
                <div>
                    <h1>Products</h1>
                    <p>Explore our products</p>
                </div>
            </div>


            {/* =========================
                CATEGORY
            ========================= */}

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


            {/* =========================
                ERROR
            ========================= */}

            {error && <div className="error">{error}</div>}


            {/* =========================
                PRODUCT COUNT
            ========================= */}

            <div className="product-count">
                {filteredProducts.length} products
            </div>


            {/* =========================
                PRODUCTS
            ========================= */}

            {filteredProducts.length === 0 ? (

                <div className="no-products">
                    <h2>No products found</h2>
                    <p>There are no products in this category.</p>
                </div>

            ) : (

                <div className="product-grid">

                    {filteredProducts.map((item) => {

                        const isWishlisted = wishlistIds.has(String(item._id));
                        const productImage = item.photo || item.image || fallbackImage;

                        return (

                            <div className="product-card" key={item._id}>

                                {/* IMAGE */}
                                <div className="product-image">
                                    <img
                                        src={productImage}
                                        alt={item.name}
                                        onError={(e) => {
                                            e.target.src = fallbackImage;
                                        }}
                                    />
                                </div>

                                {/* DETAILS */}
                                <div className="product-details">
                                    <h2>{item.name}</h2>
                                    <p className="description">{item.description}</p>

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