import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export const createToken = (user) =>
  jwt.sign(
    {
      userId: user._id,
      organizationId: user.organizationId,
      role: user.role
    },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn }
  );
