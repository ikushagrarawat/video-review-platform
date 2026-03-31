import Category from "../models/Category.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { httpError } from "../utils/httpError.js";

export const listCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({
    organizationId: req.user.organizationId
  }).sort({ name: 1 });

  res.json({ categories });
});

export const createCategory = asyncHandler(async (req, res) => {
  const name = req.body.name?.trim();

  if (!name) {
    throw httpError("Category name is required", 400);
  }

  const existingCategory = await Category.findOne({
    organizationId: req.user.organizationId,
    name
  });

  if (existingCategory) {
    throw httpError("Category already exists", 409);
  }

  const category = await Category.create({
    name,
    organizationId: req.user.organizationId,
    createdBy: req.user._id
  });

  res.status(201).json({ category });
});
