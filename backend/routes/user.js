const express = require("express")
const router = express.Router();
const sercet = process.env.JWT_SECRET;
const user = require("../models/User")
const bcrypt = require("bcrypt")
const auth = require("../middleware/authMiddleware")
const jwt = require("jsonwebtoken")
//model
const product = require("../models/Product");
const order = require("../models/Order")
const category = require("../models/Category")
const wishlist = require("../models/Wishlist")
const cart = require("../models/Cart")

router.post("/register", async (req, res) => {
    try {
        const { email, password, name, address } = req.body;

        if (!email || !password || !name || !address) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const isEmail = await user.findOne({ email });
        if (isEmail) {
            return res.status(409).json({
                message: "Email is already used"
            });
        }
        const hash = await bcrypt.hash(password, 10);
        const user1 = new user({
            name,
            email,
            role: "user",
            password: hash,
            address
        });
        await user1.save();
        const token = jwt.sign(
            {
                id: user1._id,
                email: user1.email,
                role: user1.role
            }, sercet, { expiresIn: "12h" }
        );
        res.cookie("userToken", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 12 * 60 * 60 * 1000
        });
        return res.status(201).json({
            message: "User created successfully",
            user: {
                id: user1._id,
                name: user1.name,
                email: user1.email,
                role: user1.role
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server error"
        });
    }
});

router.post("/logout", (req, res) => {
    try {
        res.clearCookie("userToken", {
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

// carts
router.get("/cart", auth, async (req, res) => {
    try {
        const id = req.userId || req.userid;
        const checkcart = await cart.findOne({ user: id }).populate("items.product");

        if (!checkcart || checkcart.items.length === 0) {
            return res.status(200).json({
                message: "empty",
                cart: { items: [] }
            });
        }

        return res.status(200).json({
            message: "found",
            cart: checkcart
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
});
router.post("/cart", auth, async (req, res) => {
    try {
        const id = req.userId || req.userid;
        const { productid, quantity = 1 } = req.body;

        if (!productid) {
            return res.status(400).json({
                message: "no found product"
            });
        }

        let checkcart = await cart.findOne({ user: id });

        if (!checkcart) {
            checkcart = await cart.create({
                user: id,
                items: [{
                    product: productid,
                    quantity: Number(quantity)
                }]
            });
        } else {
            const itemexists = checkcart.items.find(
                item => item.product && item.product.toString() === productid
            );

            if (itemexists) {
                itemexists.quantity += Number(quantity);
            } else {
                checkcart.items.push({
                    product: productid,
                    quantity: Number(quantity)
                });
            }

            await checkcart.save();
        }

        await checkcart.populate("items.product");

        return res.status(200).json({
            message: "done",
            cart: checkcart
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
});

router.delete("/cart/:productid", auth, async (req, res) => {
    try {
        const { productid } = req.params;
        const id = req.userId || req.userid;

        const checkuser = await cart.findOne({ user: id });

        if (!checkuser) {
            return res.status(404).json({
                message: "not found user"
            });
        }

        checkuser.items = checkuser.items.filter(
            item => {
                const prodId = item.product?._id ? item.product._id.toString() : item.product?.toString();
                return prodId !== productid;
            }
        );

        await checkuser.save();
        await checkuser.populate("items.product");

        return res.status(200).json({
            message: "found",
            cart: checkuser
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
});

router.delete("/cart", auth, async (req, res) => {
    try {
        const id = req.userId || req.userid;
        const del = await cart.findOneAndDelete({ user: id });

        return res.status(200).json({
            message: "done",
            cart: del
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
});

//wishlist


router.get("/wishlist", auth, async (req, res) => {
    try {
        const id = req.userid;
        const ifwishlist = await wishlist
            .findOne({ user: id })
            .populate("product");
        if (!ifwishlist) {
            return res.json({
                message: "not present",
                wishlist: null
            });
        }
        return res.json({
            message: "found",
            wishlist: ifwishlist
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "server error"
        });
    }
});

router.post("/wishlist/:productid", auth, async (req, res) => {

    try {

        const productid = req.params.productid;
        const id = req.userid;

        console.log("User ID:", id);
        console.log("Product ID:", productid);


        let ifwishlist = await wishlist.findOne({
            user: id
        });




        if (!ifwishlist) {

            ifwishlist = await wishlist.create({
                user: id,
                product: [productid]
            });

            return res.json({
                message: "added",
                wishlist: ifwishlist
            });
        }



        const isExist = ifwishlist.product.some(
            product =>
                String(product) === String(productid)
        );


        if (isExist) {

            return res.json({
                message: "already exists",
                wishlist: ifwishlist
            });

        }



        ifwishlist.product.push(productid);

        await ifwishlist.save();


        return res.json({
            message: "added",
            wishlist: ifwishlist
        });


    } catch (error) {

        console.error("WISHLIST POST ERROR:", error);

        return res.status(500).json({
            message: "server error",
            error: error.message
        });

    }

});
router.delete("/wishlist/:productid", auth, async (req, res) => {
    try {
        const id = req.userid;
        const productid = req.params.productid;

        const ifwishlist = await wishlist.findOne({
            user: id
        });
        if (!ifwishlist) {
            return res.json({
                message: "not found"
            });
        }
        ifwishlist.product = ifwishlist.product.filter(
            product => product.toString() !== productid
        );
        await ifwishlist.save();
        return res.json({
            message: "removed",
            wishlist: ifwishlist
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "server error"
        });
    }
});

// PRODUCTS

router.get("/product", auth, async (req, res) => {

    try {

        const pro = await product
            .find()
            .populate("category");

        return res.json({
            message: "found",
            product: pro
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "server error"
        });

    }

});
router.get("/product/search/:nameid", auth, async (req, res) => {
    try {
        const nameid = req.params.nameid;
        const pro = await product.findOne({name:nameid});
        if (!pro) {
            return res.json({
                message: "not found"
            });
        }
        return res.json({
            message: "found",
            product: pro
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "server error"
        });
    }
});

// CATEGORY
router.get("/category", auth, async (req, res) => {
    try {
        const categories = await category.find();
        if (categories.length === 0) {
            return res.json({
                message: "no data",
                category: []
            });
        }
        return res.json({
            message: "found",
            category: categories
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "server error"
        });
    }
});
router.get("/category/search/:idname", auth, async (req, res) => {
    try {
        const idname = req.params.idname;
        const categories = await category.findOne({
            name: idname
        });
        if (!categories) {
            return res.json({
                message: "not found"
            });
        }
        return res.json({
            message: "found",
            category: categories
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "server error"
        });
    }
});

//order
router.get("/order", auth, async (req, res) => {
    try {
        let id = req.userid;
        let checkorder = await order.exists({ user: id })
        if (!checkorder) {
            return res.json({
                message: "not found"
            })
        }
        return res.json({
            message: "found",
            order: checkorder
        })
    } catch (error) {
        console.error(error)
    }
})


module.exports = router;