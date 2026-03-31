import { Router } from "express";
import {
  deleteVideo,
  getVideoById,
  listCategories,
  listVideos,
  reprocessVideo,
  streamVideo,
  uploadVideo
} from "../controllers/videoController.js";
import { requireAuth, requireRole } from "../middleware/authMiddleware.js";
import { upload } from "../utils/storage.js";

const router = Router();

router.use(requireAuth);
router.get("/", listVideos);
router.get("/categories/options", listCategories);
router.get("/:videoId", getVideoById);
router.get("/:videoId/stream", streamVideo);
router.post("/:videoId/reprocess", requireRole("editor", "admin"), reprocessVideo);
router.delete("/:videoId", requireRole("editor", "admin"), deleteVideo);
router.post("/", requireRole("editor", "admin"), upload.single("video"), uploadVideo);

export default router;
