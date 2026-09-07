const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "user_secret_key";

const authUser = async (req, res, next) => {
  try {
    // 1. Check for token in cookies (default) or Bearer header (fallback)
    const token =
      req.cookies?.userToken ||
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

    // 4. Attach user data to the request object
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