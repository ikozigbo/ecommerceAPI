const { response } = require("express");
const { generateToken } = require("../configs/jwtToken");
const { generateRefreshToken } = require("../configs/refreshtoken");
const User = require("../models/userModel");
const Product = require("../models/productModel");
const Cart = require("../models/cartModel");
const Coupon = require("../models/couponModel");
const asyncHandler = require("express-async-handler");
const { validateMongoId } = require("../utils/validateMongoDbId");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("./emailController");

////NOTE: status codes can be sent directly before throwing errors using res.status()

//create a user
const createUser = asyncHandler(async (req, res) => {
  const email = req.body.email;
  const findUser = await User.findOne({ email });
  if (!findUser) {
    const newUser = await User.create(req.body);
    res.json(newUser);
  } else {
    throw new Error("User already Exsists");
  }
});

// login a user
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //check if user exists or not
  const findUser = await User.findOne({ email });
  if (findUser && findUser.isPasswordMatched(password)) {
    const refreshToken = await generateRefreshToken(findUser?._id);
    const updateUser = await User.findByIdAndUpdate(
      findUser?._id,
      { refreshToken },
      { new: true }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    res.json({
      id: findUser?._id,
      firstName: findUser?.firstName,
      lastName: findUser?.lastName,
      email: findUser?.email,
      mobile: findUser?.mobile,
      token: generateToken(findUser?._id),
    });
  } else {
    throw new Error("invalid Credentials");
  }
});

//admin login
const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //check if user exists or not
  const findAdmin = await User.findOne({ email });
  if (findAdmin.role !== "admin") throw new Error("Not Authorized");
  if (findAdmin && findAdmin.isPasswordMatched(password)) {
    const refreshToken = await generateRefreshToken(findAdmin?._id);
    const updateUser = await User.findByIdAndUpdate(
      findAdmin?._id,
      { refreshToken },
      { new: true }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    res.json({
      id: findAdmin?._id,
      firstName: findAdmin?.firstName,
      lastName: findAdmin?.lastName,
      email: findAdmin?.email,
      mobile: findAdmin?.mobile,
      token: generateToken(findAdmin?._id),
    });
  } else {
    throw new Error("invalid Credentials");
  }
});

//handle refresh token
const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie.refreshToken) throw new Error("no refresh token in cookies");
  const { refreshToken } = cookie;
  //console.log(refreshToken);
  const user = await User.findOne({ refreshToken });
  if (!user) throw new Error("no refresh token present in db or not matched");
  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    //console.log(decoded);
    //console.log(user.id);
    if (err || user.id !== decoded.id) {
      throw new Error("Somthing wrong with refresh token");
    }
    const accessToken = generateToken(user._id);
    res.json(accessToken);
  });
});

//logout functionality
const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie.refreshToken) throw new Error("no refresh token in cookies");
  const { refreshToken } = cookie;
  const user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204); // forbidden
  }
  await User.findOneAndUpdate({ refreshToken }, { refreshToken: "" });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  res.sendStatus(204);
});

//update a user
const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.user;
  validateMongoId(id);
  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        firstName: req?.body?.firstName,
        lastName: req?.body?.lastName,
        email: req?.body?.email,
        mobile: req?.body?.mobile,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res.json(updatedUser);
  } catch (error) {
    throw new Error(error);
  }
});

//save user address
const saveAddress = asyncHandler(async (req, res) => {
  const { id } = req.user;
  validateMongoId(id);
  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        address: req?.body?.address,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res.json(updatedUser);
  } catch (error) {
    throw new Error(error);
  }
});

// get all users
const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const allUsers = await User.find();
    res.json(allUsers);
  } catch (error) {
    throw new Error(error);
  }
});

//get a single user
const getOneUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoId(id);
  try {
    const getUser = await User.findById(id);
    if (getUser) {
      res.json(getUser);
    } else {
      throw new Error("User doesn't exist");
    }
  } catch (error) {
    throw new Error(error);
  }
});

// delete a user
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoId(id);
  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (deletedUser) {
      res.json({
        message: "user Deleted",
        data: deletedUser,
      });
    } else {
      throw new Error("User doesn't exist");
    }
  } catch (error) {
    throw new Error(error);
  }
});

const blockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoId(id);
  console.log(id);
  try {
    const block = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: true,
      },
      {
        new: true,
      }
    );
    res.json({
      message: "blocked user",
    });
  } catch (error) {
    throw new Error(error);
  }
});
const unblockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoId(id);
  try {
    const unblock = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: false,
      },
      {
        new: true,
      }
    );
    res.json({
      message: "Unblocked user",
    });
  } catch (error) {
    throw new Error(error);
  }
});

const updatePassword = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { password } = req.body;
  validateMongoId(_id);
  const user = await User.findById(_id);
  if (password) {
    user.password = password;
    const updatedPassword = await user.save();
    res.json(updatedPassword);
  } else {
    res.json(user);
  }
});

const forgetPasswordToken = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found with this email");
  try {
    const token = await user.createPasswordResetToken();
    await user.save();
    const resetURL = `hi, Please follow this link to reset your password. This link is valid for 10 mins. <a href='http://localhost:5051/api/user/reset-password/${token}'>Click here</a>`;
    const data = {
      to: email,
      text: "Hey, user",
      subject: "forget Password link",
      html: resetURL,
    };
    sendEmail(data);
    res.json(token);
  } catch (error) {
    throw new Error(error);
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) throw new Error("Token Expired, Please try again later");
  //set the users password and remove old tokens
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  res.json(user);
});

const getWishList = asyncHandler(async (req, res) => {
  const { id } = req.user;
  try {
    const findUser = await User.findById(id).populate("wishlist");
    res.json(findUser);
  } catch (error) {
    throw new Error(error);
  }
});

const userCart = asyncHandler(async (req, res) => {
  const { cart } = req.body;
  const { _id } = req.user;
  validateMongoId(_id);
  try {
    let products = [];
    const user = await User.findById(_id);
    //check if al ready have product in cart
    const alreadyExistCart = await Cart.findOne({ orderBy: user._id });

    for (let i = 0; i < cart.length; i++) {
      let object = {};
      object.product = cart[i]._id;
      object.count = cart[i].count;
      let getPrice = await Product.findById(cart[i]._id).select("price").exec();
      object.price = getPrice.price;
      products.push(object);
    }
    let cartTotal = 0;
    for (let i = 0; i < products.length; i++) {
      cartTotal += products[i].price * products[i].count;
    }
    //console.log(cartTotal);
    // console.log(products);
    if (alreadyExistCart) {
      await Cart.findByIdAndDelete(alreadyExistCart._id);
    }
    let newCart = await Cart.create({
      products,
      cartTotal,
      orderBy: user?._id,
    });
    res.json(newCart);
  } catch (error) {
    throw new Error(error);
  }
});

const getUserCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoId(_id);
  try {
    const cart = await Cart.findOne({ orderBy: _id }).populate(
      "products.product"
    );
    res.json(cart);
  } catch (error) {
    throw new Error(error);
  }
});

const emptyCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoId(_id);
  try {
    const cart = await Cart.findOneAndDelete({ orderBy: _id });
    res.json({
      message: "deleted cart",
      cart,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const applyCoupon = asyncHandler(async (req, res) => {
  const { coupon } = req.body;
  const { _id } = req.user;
  validateMongoId(_id);
  try {
    const validCoupon = await Coupon.findOne({ name: coupon });
    if (!validCoupon) {
      //res.status(301);
      throw new Error("Invalid Coupon");
    }
    //const user = await User.findOne({ _id });
    //console.log(user);
    const cart = await Cart.findOne({
      orderBy: _id,
    }).populate("products.product");
    if (!cart) {
      res.status(404);
      throw new Error("empty cart");
    } else {
      const totalAfterDiscount =
        cart.cartTotal -
        ((cart.cartTotal * validCoupon.discount) / 100).toFixed(2);
      //console.log(totalAfterDiscount);
      const updatedCart = await Cart.findOneAndUpdate(
        { orderBy: _id },
        { totalAfterDiscount },
        { new: true }
      );
      res.json(updatedCart);
    }
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createUser,
  loginUser,
  logout,
  getAllUsers,
  getOneUser,
  deleteUser,
  updateUser,
  blockUser,
  unblockUser,
  handleRefreshToken,
  updatePassword,
  forgetPasswordToken,
  resetPassword,
  loginAdmin,
  getWishList,
  saveAddress,
  userCart,
  getUserCart,
  emptyCart,
  applyCoupon,
};
