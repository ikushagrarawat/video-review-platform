import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { env } from "../config/env.js";
import { asyncHandler } from "./asyncHandler.js";

export const requireAuth = asyncHandler(async (req, _res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : req.query.token || null;

  if (!token) {
    const error = new Error("Authentication required");
    error.statusCode = 401;
    throw error;
  }

  const payload = jwt.verify(token, env.jwtSecret);
  const user = await User.findById(payload.userId).select("-password");

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 401;
    throw error;
  }

  req.user = user;
  next();
});

export const requireRole = (...roles) => (req, _res, next) => {
  if (!roles.includes(req.user.role)) {
    const error = new Error("You do not have permission for this action");
    error.statusCode = 403;
    throw error;
  }

  next();
};
