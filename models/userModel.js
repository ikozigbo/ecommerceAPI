const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "user" },
    isBlocked: { type: Boolean, default: false },
    cart: { type: Array, default: [] },
    address: [{ type: mongoose.Schema.Types.ObjectId, ref: "Address" }],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    refreshToken: { type: String },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  { timestamps: true }
);

// UserSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) {
//     next();
//   }
//   const salt = bcrypt.genSaltSync(10);
//   this.password = bcrypt.hashSync(this.password, salt);
//   next();
// });

UserSchema.pre("save", async function (next) {
  // Code executed before saving a user instance
  if (!this.isModified("password")) {
    // If the "password" field has not been modified, skip to the next middleware or save operation
    next();
  }
  // Generate a salt (random data) for hashing the password
  const salt = bcrypt.genSaltSync(10);
  // Hash the password using bcrypt and the generated salt
  this.password = bcrypt.hashSync(this.password, salt);
  // Continue to the next middleware or save operation
  next();
});

UserSchema.methods.isPasswordMatched = function (enteredPassword) {
  return bcrypt.compareSync(enteredPassword, this.password);
};

UserSchema.methods.creatPasswordResetToken = async function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 30 * 60 * 1000; // 10 mins
  return resetToken;
};

const userModel = mongoose.model("User", UserSchema);

module.exports = userModel;
