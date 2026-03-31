import User from "../models/User.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { httpError } from "../utils/httpError.js";

export const listUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ organizationId: req.user.organizationId })
    .select("-password")
    .sort({ createdAt: -1 });

  res.json({ users });
});

export const createUserByAdmin = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw httpError("User already exists", 409);
  }

  const user = await User.create({
    name,
    email,
    password,
    role: role || "viewer",
    organizationId: req.user.organizationId
  });

  res.status(201).json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      organizationId: user.organizationId
    }
  });
});
