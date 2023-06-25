const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
    try {
      if (token) {
        const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decodedToken?.id);
        req.user = user;
        next();
      }
    } catch (error) {
      throw new Error("Not Authorized token expired, please login again");
    }
  } else {
    throw new Error("No token is attached to the header");
  }
});

const isAdmin = asyncHandler(async (req, res, next) => {
  const { role } = req.user;
  if (role !== "admin") {
    throw new Error("you are not an admin");
  } else {
    next();
  }
});

module.exports = { authMiddleware, isAdmin };
