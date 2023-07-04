const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    numViews: { type: Number, default: 0 },
    isLiked: { type: Boolean, default: false },
    isDisLiked: { type: Boolean, default: false },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    image: {
      type: String,
      default:
        "https://st2.depositphotos.com/1006899/8421/i/950/depositphotos_84219350-stock-photo-word-blog-suspended-by-ropes.jpg",
    },
    author: { type: String, default: "admin" },
    images: [],
  },

  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
    timestamps: true,
  }
);

const blogModel = mongoose.model("Blog", blogSchema);

module.exports = blogModel;
