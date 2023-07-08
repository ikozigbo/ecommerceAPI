const router = require("express").Router();
const {
  createEnquiry,
  updateEnquiry,
  deleteEnquiry,
  getAllEnquirys,
  getOneEnquiry,
} = require("../controllers/enqController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

router.post("/create", authMiddleware, createEnquiry);
router.put("/update/:id", authMiddleware, isAdmin, updateEnquiry);
router.get("/one/:id", authMiddleware, isAdmin, getOneEnquiry);
router.get("/all", authMiddleware, isAdmin, getAllEnquirys);
router.delete("/delete/:id", authMiddleware, isAdmin, deleteEnquiry);

module.exports = router;
