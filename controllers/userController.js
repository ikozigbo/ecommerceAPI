const { generateToken } = require("../configs/jwtToken");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");

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

//update a user
const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
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

module.exports = {
  createUser,
  loginUser,
  getAllUsers,
  getOneUser,
  deleteUser,
  updateUser,
};
