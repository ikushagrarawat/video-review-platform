import { Router } from "express";
import { createCategory, listCategories } from "../controllers/categoryController.js";
import { requireAuth, requireRole } from "../middleware/authMiddleware.js";

const router = Router();

router.use(requireAuth);
router.get("/", listCategories);
router.post("/", requireRole("editor", "admin"), createCategory);

export default router;
