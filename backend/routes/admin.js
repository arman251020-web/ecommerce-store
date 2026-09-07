const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const secret = process.env.JWT_SECRET_ADMIN;
const adminpasswo = process.env.ADMIN_PASS;

// Models
const user = require("../models/User");
const category = require("../models/Category");
const product = require("../models/Product");
const order = require("../models/Order");

router.post("/register", async (req, res) => {
    try {
        const { email, password, name, adminpass } = req.body;

        if (!email || !password || !name || !adminpass) {
            return res.status(400).json({
                message: "All fields are required",
                email,
                password,
                name,
                adminpass
            });
        }

        if (adminpass !== adminpasswo) {
            return res.status(403).json({
                message: "NOT ALLOWED"
            });
        }

        const isEmail = await user.findOne({ email });
        if (isEmail) {
            return res.status(409).json({
                message: "Email is already used"
            });
        }

        const hash = await bcrypt.hash(password, 10);
        const admin1 = new user({
            name,
            email,
            role: "admin",
            password: hash
        });
        await admin1.save();

        const token = jwt.sign(
            {
                id: admin1._id,
                email: admin1.email,
                role: admin1.role
            },
            secret,
            { expiresIn: "12h" }
        );

        res.cookie("adminToken", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 12 * 60 * 60 * 1000
        });

        return res.status(201).json({
            message: "User created successfully",
            user: {
                id: admin1._id,
                name: admin1.name,
                email: admin1.email,
                role: admin1.role
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
});
router.post("/logout", (req, res) => {
    try {
        res.clearCookie("adminToken", {
            httpOnly: true,
            secure: false, 
            sameSite: "lax"
        });

        return res.status(200).json({
            message: "Admin logged out successfully"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server error during logout",
            error: error.message
        });
    }
});

router.get("/product/category", async (req, res) => {
    try {
        const p2 = await category.find();
        return res.status(200).json({
            message: "this found",
            category: p2
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
});

router.post("/category/add", async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name || !description) {
            return res.status(400).json({ message: "Please enter all category details" });
        }

        const iscat = await category.findOne({ name });
        if (iscat) {
            return res.status(409).json({
                message: "Category already present",
                category: iscat
            });
        }

        const newcat = await category.create({
            name,
            description
        });

        return res.status(201).json({
            message: "created",
            category: newcat
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
});

router.delete("/category/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const productcheck = await product.findOne({ category: id });
        if (productcheck) {
            return res.status(400).json({
                message: "Category is in use by existing products. Change or delete them first."
            });
        }

        const del = await category.findByIdAndDelete(id);
        if (!del) {
            return res.status(404).json({ message: "Category not found" });
        }

        return res.status(200).json({
            message: "it is delete",
            category: del
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
});


router.get("/products", async (req, res) => {
    try {
        const p1 = await product.find().populate("category", "name");
        return res.status(200).json({
            message: "found",
            product: p1
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
});

router.post("/product/add", async (req, res) => {
    try {
        const { name, description, price, category: categoryId, photo } = req.body;

        if (!name || !price || !categoryId || !photo) {
            return res.status(400).json({ message: "Please provide all required product fields" });
        }

        const isname = await product.findOne({ name });
        if (isname) {
            return res.status(409).json({
                message: "Product already present",
                product: isname
            });
        }

        const newpro = await product.create({
            name,
            description,
            price,
            category: categoryId,
            photo
        });

        return res.status(201).json({
            message: "created",
            product: newpro
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
});


router.get("/product/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const p2 = await product.findById(id).populate("category", "name");
        if (!p2) {
            return res.status(404).json({
                message: "not found",
                productId: id
            });
        }
        return res.status(200).json({
            message: "found",
            product: p2
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
});

router.put("/product/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, category, photo } = req.body;

        const updateData = {};
        if (name) updateData.name = name;
        if (description) updateData.description = description;
        if (price) updateData.price = price;
        if (category) updateData.category = category;
        if (photo) updateData.photo = photo;

        const productUpdate = await product.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!productUpdate) {
            return res.status(404).json({
                message: "not found",
                productId: id
            });
        }

        return res.status(200).json({
            message: "updated",
            product: productUpdate
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
});

router.delete("/product/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const del = await product.findByIdAndDelete(id);

        if (!del) {
            return res.status(404).json({
                message: "not found",
                productId: id
            });
        }

        return res.status(200).json({
            message: "deleted",
            product: del
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
});


router.get("/order", async (req, res) => {
    try {
        const allcons = await order.find().populate("user", "name email");
        return res.status(200).json({
            message: "found",
            user: allcons
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
});

router.put("/order/:id", async (req, res) => {
    try {
        const { status } = req.body;
        const { id } = req.params;

        const pro = await order.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true }
        );

        if (!pro) {
            return res.status(404).json({
                message: "not found"
            });
        }

        return res.status(200).json({
            message: "update access",
            order: pro
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
});


router.get("/users", async (req, res) => {
    try {
        const users = await user.find().select("-password");
        return res.status(200).json({
            message: "Users fetched successfully",
            users
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
});

router.delete("/user/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await user.findByIdAndDelete(id).select("-password");

        if (!deletedUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            message: "User deleted successfully",
            user: deletedUser
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
});

module.exports = router;