const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    products: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        count: Number,
        price: Number,
      },
    ],
    cartTotal: Number,
    totalAfterDiscount: Number,
    orderBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const cartModel = mongoose.model("Cart", cartSchema);

module.exports = cartModel;
