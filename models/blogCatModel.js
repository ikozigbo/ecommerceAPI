const mongoose = require("mongoose");

const blogCategorySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true, index: true },
  },
  {
    timestamps: true,
  }
);

const blogCategoryModel = mongoose.model(
  "Blog-Category",
  blogCategorySchema
);

module.exports = blogCategoryModel;
