const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "user_secret_key";

const authUser = async (req, res, next) => {
  try {
    // 1. Check for token in cookies (userToken, adminToken, or token) or Bearer header
    const token =
      req.cookies?.userToken ||
      req.cookies?.adminToken ||
      req.cookies?.token ||
      (req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : null);

    if (!token) {
      return res.status(401).json({
        message: "Access denied. Please log in first.",
      });
    }

    // 2. Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // 3. Find user in database and exclude password
    const currentUser = await User.findById(decoded.id).select("-password");
    if (!currentUser) {
      return res.status(401).json({
        message: "Session invalid. User no longer exists.",
      });
    }

    // 4. Attach user ID using BOTH casing styles to prevent undefined errors
    req.userId = currentUser._id;
    req.userid = currentUser._id;

    // 5. Attach full user document
    req.user = currentUser;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Session expired. Please log in again." });
    }
    return res.status(401).json({ message: "Invalid authentication token." });
  }
};

module.exports = authUser;