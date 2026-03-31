import { Router } from "express";
import { createUserByAdmin, listUsers } from "../controllers/userController.js";
import { requireAuth, requireRole } from "../middleware/authMiddleware.js";

const router = Router();

router.use(requireAuth, requireRole("admin"));
router.get("/", listUsers);
router.post("/", createUserByAdmin);

export default router;
