const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "user" },
});

UserSchema.pre("save", async function (next) {
  const salt = bcrypt.genSaltSync(10);
  this.password = bcrypt.hashSync(this.password, salt);
});

UserSchema.methods.isPasswordMatched = function (enteredPassword) {
  return bcrypt.compareSync(enteredPassword, this.password);
};

const userModel = mongoose.model("User", UserSchema);

module.exports = userModel;
