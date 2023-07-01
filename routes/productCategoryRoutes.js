const router = require("express").Router();
const {
  createCategory,
  updateCategory,
  deleteCategory,
  getAllCategories,
  getOneCategory,
} = require("../controllers/productCategoryController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

router.post("/create", authMiddleware, isAdmin, createCategory);
router.put("/update/:id", authMiddleware, isAdmin, updateCategory);
router.get("/one/:id", authMiddleware, isAdmin, getOneCategory);
router.get("/all", authMiddleware, isAdmin, getAllCategories);
router.delete("/delete/:id", authMiddleware, isAdmin, deleteCategory);

module.exports = router;
