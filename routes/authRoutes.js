const express = require("express");
const {
  createUser,
  loginUser,
  getAllUsers,
  getOneUser,
  deleteUser,
  updateUser,
  blockUser,
  unblockUser,
  handleRefreshToken,
  logout,
  updatePassword,
  forgetPasswordToken,
  resetPassword,
  loginAdmin,
  getWishList,
  saveAddress,
  userCart,
  getUserCart,
  emptyCart,
  applyCoupon,
} = require("../controllers/userController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.post("/admin-login", loginAdmin);
router.post("/cart", authMiddleware, userCart);
router.post("/forget-password-token", forgetPasswordToken);
router.put("/reset-password/:token", resetPassword);
router.put("/updateuser", authMiddleware, updateUser);
router.put("/save-address", authMiddleware, saveAddress);
router.put("/password", authMiddleware, updatePassword);
router.get("/getall", getAllUsers);
router.get("/getone/:id", authMiddleware, isAdmin, getOneUser);
router.get("/refresh", handleRefreshToken);
router.get("/logout", logout);
router.delete("/deleteuser/:id", deleteUser);
router.put("/blockuser/:id", authMiddleware, isAdmin, blockUser);
router.put("/unblockuser/:id", authMiddleware, isAdmin, unblockUser);
router.get("/wishlist", authMiddleware, getWishList);
router.get("/user-cart", authMiddleware, getUserCart);
router.delete("/empty-cart", authMiddleware, emptyCart);
router.post("/apply-coupon", authMiddleware, applyCoupon);

module.exports = router;
