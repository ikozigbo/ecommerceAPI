const Enquiry = require("../models/enqModel");
const asyncHandler = require("express-async-handler");
const { validateMongoId } = require("../utils/validateMongoDbId");

const createEnquiry = asyncHandler(async (req, res) => {
  try {
    const newEnquiry = await Enquiry.create(req.body);
    res.json(newEnquiry);
  } catch (error) {
    throw new Error(error);
  }
});

const updateEnquiry = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoId(id);
  try {
    const updateEnquiry = await Enquiry.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updateEnquiry);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteEnquiry = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoId(id);
  // console.log(id);
  try {
    const deleteEnquiry = await Enquiry.findByIdAndDelete(id);
    res.json(deleteEnquiry);
  } catch (error) {
    throw new Error(error);
  }
});

const getOneEnquiry = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoId(id);
  // console.log(id);
  try {
    const enquiry = await Enquiry.findById(id);
    res.json(enquiry);
  } catch (error) {
    throw new Error(error);
  }
});

const getAllEnquirys = asyncHandler(async (req, res) => {
  try {
    const enquirys = await Enquiry.find();
    res.json(enquirys);
  } catch (error) {
    throw new Error(error);
  }
});
module.exports = {
  createEnquiry,
  updateEnquiry,
  deleteEnquiry,
  getOneEnquiry,
  getAllEnquirys,
};
