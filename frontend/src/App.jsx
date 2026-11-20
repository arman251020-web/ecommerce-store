import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// User Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";


import Cart from "./pages/Cart"
import Wishlist from "./pages/Wishlist";
import Products from "./pages/Products";
// Admin Pages
import AdminRegister from "./pages/AdminRegister";
import AdminLayout from "./pages/AdminLayout";
import AdminDashboardHome from "./pages/AdminDashboardHome";
import AdminProducts from "./pages/AdminProducts";
import AdminCategories from "./pages/AdminCategories";
import AdminOrders from "./pages/AdminOrders";
import AdminUsers from "./pages/AdminUsers";
import AdminRegister from "./pages/AdminRegister";
function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* User Public & Shopping Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/products" element={<Products />}/>
                {/* Admin Registration */}
                <Route path="/admin/register" element={<AdminRegister />} />

                {/* Admin Nested Panel (Matches /auth/admin & /admin redirects) */}
                <Route path="/auth/admin" element={<AdminLayout />}>
                    <Route path="/auth/admin/register" element={<AdminRegister />}></Route>
                    <Route index element={<Navigate to="dashboard" replace />} />
                    <Route path="home" element={<Navigate to="dashboard" replace />} />
                    <Route path="dashboard" element={<AdminDashboardHome />} />
                    <Route path="products" element={<AdminProducts />} />
                    <Route path="categories" element={<AdminCategories />} />
                    <Route path="orders" element={<AdminOrders />} />
                    <Route path="users" element={<AdminUsers />} />
                </Route>

                {/* Fallback redirect for /admin/home */}
                <Route path="/admin/home" element={<Navigate to="/auth/admin/dashboard" replace />} />

                {/* Catch-all route */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;