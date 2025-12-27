const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async (req, res, next) => {
  // Get token from header (support both x-auth-token and Authorization)
  let token = req.header("x-auth-token") || req.header("Authorization");

  if (!token) return res.status(401).json({ message: "No token, authorization denied" });

  // Remove Bearer if present
  if (token.startsWith("Bearer ")) {
    token = token.slice(7, token.length).trimLeft();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;

    // Fetch user and attach to req
    const user = await User.findById(decoded.id).select("-passwordHash");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    req.user = user;

    next();

  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};
