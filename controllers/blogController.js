const Blog = require("../models/blogModel");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const { validateMongoId } = require("../utils/validateMongoDbId");

const createBlog = asyncHandler(async (req, res) => {
  try {
    const newBlog = await Blog.create(req.body);
    res.json(newBlog);
  } catch (error) {
    throw new Error(error);
  }
});

//update
const updateBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoId(id);
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updatedBlog);
  } catch (error) {
    throw new Error(error);
  }
});

//get one Blog
const getBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoId(id);
  try {
    const getBlog = await Blog.findById(id).populate("likes");
    await Blog.findByIdAndUpdate(
      id,
      {
        $inc: { numViews: 1 },
      },
      { new: true }
    );
    res.json(getBlog);
  } catch (error) {
    throw new Error(error);
  }
});

//get all blogs
const getAllBlogs = asyncHandler(async (req, res) => {
  try {
    const getBlogs = await Blog.find();
    res.json(getBlogs);
  } catch (error) {
    throw new Error(error);
  }
});

//delete blog
const deleteBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoId(id);
  try {
    const deletedBlog = await Blog.findByIdAndDelete(id);
    if (!deletedBlog) throw new Error("blog not in database");
    res.json(deletedBlog);
  } catch (error) {
    throw new Error(error);
  }
});

//likeBlog functionality
const likeBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.body;
  validateMongoId(blogId);
  try {
    const blog = await Blog.findById(blogId);
    const loginUserId = req?.user?._id;

    //checking ig the user has liked the blog already
    const isLikedAlready = blog?.likes?.find(
      (userId) => userId?.toString() === loginUserId?.toString()
    );

    //checking ig the user has disliked the blog already
    const isDisLikedAlready = blog?.dislikes?.find(
      (userId) => userId?.toString() === loginUserId?.toString()
    );
    if (isDisLikedAlready) {
      const blogg = await Blog.findByIdAndUpdate(
        blogId,
        { $pull: { dislikes: loginUserId }, $push: { likes: loginUserId } },
        { new: true }
      );
      res.json(blogg);
    } else if (isLikedAlready) {
      const blogg = await Blog.findByIdAndUpdate(
        blogId,
        { $pull: { likes: loginUserId } },
        { new: true }
      );
      res.json(blogg);
    } else {
      const blogg = await Blog.findByIdAndUpdate(
        blogId,
        { $push: { likes: loginUserId } },
        { new: true }
      );
      res.json(blogg);
    }
  } catch (error) {
    throw new Error(error);
  }
});

//dislike functionality
const disLikeBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.body;
  validateMongoId(blogId);
  try {
    const blog = await Blog.findById(blogId);
    const loginUserId = req?.user?._id;

    //checking ig the user has liked the blog already
    const isLikedAlready = blog?.likes?.find(
      (userId) => userId?.toString() === loginUserId?.toString()
    );

    //checking ig the user has disliked the blog already
    const isDisLikedAlready = blog?.dislikes?.find(
      (userId) => userId?.toString() === loginUserId?.toString()
    );
    if (isDisLikedAlready) {
      const blogg = await Blog.findByIdAndUpdate(
        blogId,
        { $pull: { dislikes: loginUserId } },
        { new: true }
      );
      res.json(blogg);
    } else if (isLikedAlready) {
      const blogg = await Blog.findByIdAndUpdate(
        blogId,
        { $pull: { likes: loginUserId }, $push: { dislikes: loginUserId } },
        { new: true }
      );
      res.json(blogg);
    } else {
      const blogg = await Blog.findByIdAndUpdate(
        blogId,
        { $push: { dislikes: loginUserId } },
        { new: true }
      );
      res.json(blogg);
    }
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createBlog,
  updateBlog,
  getBlog,
  getAllBlogs,
  deleteBlog,
  likeBlog,
  disLikeBlog,
};
