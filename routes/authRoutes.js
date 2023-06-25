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
} = require("../controllers/userController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.put("/updateuser", authMiddleware, updateUser);
router.get("/getall", getAllUsers);
router.get("/getone/:id", authMiddleware, isAdmin, getOneUser);
router.get("/refresh", handleRefreshToken);
router.get("/logout", logout);
router.delete("/deleteuser/:id", deleteUser);
router.put("/blockuser/:id", authMiddleware, isAdmin, blockUser);
router.put("/unblockuser/:id", authMiddleware, isAdmin, unblockUser);

module.exports = router;
