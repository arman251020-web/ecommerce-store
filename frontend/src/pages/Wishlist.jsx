import { useEffect, useState } from "react";
import "./Wishlist.css";

const API = "http://localhost:5000";

function Wishlist() {

    const [wishlist, setWishlist] = useState(null);
    const [loading, setLoading] = useState(true);
    const [removing, setRemoving] = useState(null);
    const [error, setError] = useState("");


    // =========================
    // GET WISHLIST
    // =========================

    const getWishlist = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await fetch(
                `${API}/auth/user/wishlist`,
                {
                    method: "GET",
                    credentials: "include"
                }
            );

            const data = await response.json();

            if (data.message === "not present") {

                setWishlist(null);

            } else {

                setWishlist(data.wishlist);

            }

        } catch (error) {

            console.error(error);

            setError(
                "Unable to load your wishlist."
            );

        } finally {

            setLoading(false);

        }
    };


    // =========================
    // REMOVE PRODUCT
    // =========================

    const removeProduct = async (productId) => {

        try {

            setRemoving(productId);

            const response = await fetch(
                `${API}/auth/user/wishlist/${productId}`,
                {
                    method: "DELETE",
                    credentials: "include"
                }
            );

            const data = await response.json();

            if (
                data.wishlist &&
                data.wishlist.product.length > 0
            ) {

                setWishlist(data.wishlist);

            } else {

                setWishlist(null);

            }

        } catch (error) {

            console.error(error);

        } finally {

            setRemoving(null);

        }
    };


    // =========================
    // ADD TO CART
    // =========================

    const addToCart = async (productId) => {

        try {

            const response = await fetch(
                `${API}/auth/user/cart`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    credentials: "include",

                    body: JSON.stringify({
                        productid: productId,
                        quantity: 1
                    })
                }
            );

            const data = await response.json();

            console.log(data);

            alert("Product added to cart");

        } catch (error) {

            console.error(error);

            alert("Unable to add product to cart");

        }
    };


    // =========================
    // LOAD
    // =========================

    useEffect(() => {

        getWishlist();

    }, []);


    // =========================
    // LOADING
    // =========================

    if (loading) {

        return (

            <div className="wishlist-page">

                <div className="wishlist-loading">

                    <div className="wishlist-spinner"></div>

                    <p>
                        Loading your wishlist...
                    </p>

                </div>

            </div>

        );
    }


    // =========================
    // ERROR
    // =========================

    if (error) {

        return (

            <div className="wishlist-page">

                <div className="wishlist-error">

                    <div>
                        ⚠️
                    </div>

                    <h2>
                        Something went wrong
                    </h2>

                    <p>
                        {error}
                    </p>

                    <button onClick={getWishlist}>
                        Try Again
                    </button>

                </div>

            </div>

        );
    }


    // =========================
    // EMPTY
    // =========================

    if (
        !wishlist ||
        !wishlist.product ||
        wishlist.product.length === 0
    ) {

        return (

            <div className="wishlist-page">

                <div className="empty-wishlist">

                    <div className="heart-icon">
                        ♡
                    </div>

                    <h1>
                        Your wishlist is empty
                    </h1>

                    <p>
                        Save products you love here and
                        come back to them later.
                    </p>

                    <button
                        onClick={() => {
                            window.location.href =
                                "/products";
                        }}
                    >
                        Explore Products
                    </button>

                </div>

            </div>

        );
    }


    return (

        <div className="wishlist-page">

            <div className="wishlist-container">


                {/* =====================
                    HEADER
                ====================== */}

                <div className="wishlist-header">

                    <div>

                        <h1>
                            My Wishlist
                        </h1>

                        <p>
                            {wishlist.product.length}{" "}
                            {wishlist.product.length === 1
                                ? "product"
                                : "products"}{" "}
                            saved
                        </p>

                    </div>

                </div>


                {/* =====================
                    PRODUCTS
                ====================== */}

                <div className="wishlist-grid">

                    {wishlist.product.map((product) => {

                        return (

                            <div
                                className="wishlist-card"
                                key={product._id}
                            >


                                {/* IMAGE */}

                                <div className="wishlist-image">

                                    <img
                                        src={
                                            product.image ||
                                            "/placeholder.png"
                                        }
                                        alt={product.name}
                                    />


                                    {/* REMOVE */}

                                    <button
                                        className="heart-remove"
                                        disabled={
                                            removing ===
                                            product._id
                                        }
                                        onClick={() =>
                                            removeProduct(
                                                product._id
                                            )
                                        }
                                    >

                                        {removing === product._id
                                            ? "..."
                                            : "♥"}

                                    </button>

                                </div>


                                {/* INFO */}

                                <div className="wishlist-info">

                                    <h2>
                                        {product.name}
                                    </h2>

                                    <div className="wishlist-bottom">

                                        <strong>
                                            ₹
                                            {Number(
                                                product.price
                                            ).toLocaleString(
                                                "en-IN"
                                            )}
                                        </strong>

                                    </div>


                                    {/* CART BUTTON */}

                                    <button
                                        className="wishlist-cart-button"
                                        onClick={() =>
                                            addToCart(
                                                product._id
                                            )
                                        }
                                    >

                                        Add to Cart

                                    </button>

                                </div>

                            </div>

                        );

                    })}

                </div>

            </div>

        </div>

    );
}

export default Wishlist;