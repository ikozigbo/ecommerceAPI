const express = require("express");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const {
  createProduct,
  getOneProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const router = express.Router();

router.post("/create", authMiddleware, isAdmin, createProduct);
router.get("/one/:id", getOneProduct);
router.get("/all", getAllProducts);
router.put("/update/:id", authMiddleware, isAdmin, updateProduct);
router.delete("/delete/:id", authMiddleware, isAdmin, deleteProduct);

module.exports = router;
