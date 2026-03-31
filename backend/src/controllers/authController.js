import User from "../models/User.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { createToken } from "../utils/auth.js";
import { httpError } from "../utils/httpError.js";

const buildAuthResponse = (user) => ({
  token: createToken(user),
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    organizationId: user.organizationId,
    role: user.role
  }
});

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, organizationId, role } = req.body;

  if (!name || !email || !password || !organizationId) {
    throw httpError("Name, email, password, and organization are required", 400);
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw httpError("User already exists", 409);
  }

  const user = await User.create({
    name,
    email,
    password,
    organizationId,
    role: role || "viewer"
  });

  res.status(201).json(buildAuthResponse(user));
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user || !(await user.comparePassword(password))) {
    throw httpError("Invalid email or password", 401);
  }

  res.json(buildAuthResponse(user));
});

export const me = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});
