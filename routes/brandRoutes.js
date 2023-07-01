const router = require("express").Router();
const {
  createBrand,
  updateBrand,
  deleteBrand,
  getAllBrands,
  getOneBrand,
} = require("../controllers/brandController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

router.post("/create", authMiddleware, isAdmin, createBrand);
router.put("/update/:id", authMiddleware, isAdmin, updateBrand);
router.get("/one/:id", authMiddleware, isAdmin, getOneBrand);
router.get("/all", authMiddleware, isAdmin, getAllBrands);
router.delete("/delete/:id", authMiddleware, isAdmin, deleteBrand);

module.exports = router;
