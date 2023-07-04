const express = require("express");
const router = express.Router();
const {
  createBlog,
  updateBlog,
  getBlog,
  getAllBlogs,
  deleteBlog,
  likeBlog,
  disLikeBlog,
  uploadImages,
} = require("../controllers/blogController");
const { uploadPhoto, blogImgResize } = require("../middlewares/uploadImages");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

router.post("/new-blog", authMiddleware, isAdmin, createBlog);
router.get("/:id", getBlog);
router.put("/update/:id", authMiddleware, isAdmin, updateBlog);
router.put(
  "/upload/:id",
  authMiddleware,
  isAdmin,
  uploadPhoto.array("images", 10),
  blogImgResize,
  uploadImages
);
router.put("/like", authMiddleware, likeBlog);
router.put("/dislike", authMiddleware, disLikeBlog);
router.get("/", getAllBlogs);
router.delete("/:id", authMiddleware, isAdmin, deleteBlog);

module.exports = router;
