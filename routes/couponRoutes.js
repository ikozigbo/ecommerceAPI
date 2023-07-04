const router = require("express").Router();
const {
  createCoupon,
  getOneCoupon,
  getAllCoupons,
  updateCoupon,
  deleteCoupon,
} = require("../controllers/couponController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

router.post("/create", authMiddleware, isAdmin, createCoupon);
router.put("/update/:id", authMiddleware, isAdmin, updateCoupon);
router.get("/one/:id", authMiddleware, isAdmin, getOneCoupon);
router.get("/all", authMiddleware, isAdmin, getAllCoupons);
router.delete("/delete/:id", authMiddleware, isAdmin, deleteCoupon);

module.exports = router;
