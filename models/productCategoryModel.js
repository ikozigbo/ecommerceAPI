const mongoose = require("mongoose");

const productCategorySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true, index: true },
  },
  {
    timestamps: true,
  }
);

const productCategoryModel = mongoose.model(
  "Product-Category",
  productCategorySchema
);

module.exports = productCategoryModel;
