import fs from "fs";
import path from "path";
import { app, httpServer, io } from "./app.js";
import { connectDatabase } from "./config/db.js";
import { env } from "./config/env.js";
import { registerSocketHandlers } from "./services/socketService.js";

const bootstrap = async () => {
  fs.mkdirSync(path.resolve(env.uploadDir), { recursive: true });
  fs.mkdirSync(path.resolve(env.processedDir), { recursive: true });
  await connectDatabase();
  registerSocketHandlers(io);

  httpServer.listen(env.port, () => {
    console.log(`API listening on http://localhost:${env.port}`);
  });
};

bootstrap().catch((error) => {
  console.error("Failed to bootstrap server", error);
  process.exit(1);
});
