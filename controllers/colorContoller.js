const Color = require("../models/colorModel");
const asyncHandler = require("express-async-handler");
const { validateMongoId } = require("../utils/validateMongoDbId");

const createColor = asyncHandler(async (req, res) => {
  try {
    const newColor = await Color.create(req.body);
    res.json(newColor);
  } catch (error) {
    throw new Error(error);
  }
});

const updateColor = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoId(id);
  try {
    const updateColor = await Color.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updateColor);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteColor = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoId(id);
  // console.log(id);
  try {
    const deleteColor = await Color.findByIdAndDelete(id);
    res.json(deleteColor);
  } catch (error) {
    throw new Error(error);
  }
});

const getOneColor = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoId(id);
  // console.log(id);
  try {
    const color = await Color.findById(id);
    res.json(color);
  } catch (error) {
    throw new Error(error);
  }
});

const getAllColors = asyncHandler(async (req, res) => {
  try {
    const colors = await Color.find();
    res.json(colors);
  } catch (error) {
    throw new Error(error);
  }
});
module.exports = {
  createColor,
  updateColor,
  deleteColor,
  getOneColor,
  getAllColors,
};
