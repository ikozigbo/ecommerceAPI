const express = require("express");
const {
  createUser,
  loginUser,
  getAllUsers,
  getOneUser,
  deleteUser,
  updateUser,
} = require("../controllers/userController");
const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.put("/updateuser/:id", updateUser);
router.get("/getall", getAllUsers);
router.get("/getone/:id", getOneUser);
router.delete("/deleteuser/:id", deleteUser);

module.exports = router;
