const router = require("express").Router();
const {
  createColor,
  updateColor,
  deleteColor,
  getAllColors,
  getOneColor,
} = require("../controllers/colorContoller");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

router.post("/create", authMiddleware, isAdmin, createColor);
router.put("/update/:id", authMiddleware, isAdmin, updateColor);
router.get("/one/:id", authMiddleware, isAdmin, getOneColor);
router.get("/all", authMiddleware, isAdmin, getAllColors);
router.delete("/delete/:id", authMiddleware, isAdmin, deleteColor);

module.exports = router;
