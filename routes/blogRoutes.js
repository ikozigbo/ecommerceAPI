const express = require("express");
const router = express.Router();
const { createBlog, updateBlog } = require("../controllers/blogController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

router.post("/new-blog", authMiddleware, isAdmin, createBlog);
router.put("/:id", authMiddleware, isAdmin, updateBlog)

module.exports = router;
