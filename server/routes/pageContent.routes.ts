import { Router } from "express";
import { PageContentController } from "../controllers/pageContent.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { imageUpload } from "../middleware/upload.middleware";

const router = Router();

// Public — every visitor's Home/About/Services page needs this to render.
router.get("/:key", PageContentController.get);

// Admin-only writes.
router.put("/:key", requireAuth, PageContentController.set);
router.post("/upload", requireAuth, imageUpload("page-content"), PageContentController.uploadImage);

export default router;
