import cors from "cors";
import express from "express";
import morgan from "morgan";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import { env } from "./config/env.js";
import { errorHandler, notFoundHandler } from "./middleware/errorMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import videoRoutes from "./routes/videoRoutes.js";

export const app = express();
export const httpServer = createServer(app);
export const io = new Server(httpServer, {
  cors: {
    origin: env.clientUrl,
    credentials: true
  }
});

app.use(
  cors({
    origin: env.clientUrl,
    credentials: true
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use("/uploads", express.static(path.resolve(env.uploadDir)));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, message: "Server is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/videos", videoRoutes);

app.use(notFoundHandler);
app.use(errorHandler);
