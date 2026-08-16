import { Request, Response } from "express";
import { PageContentModel } from "../models/PageContent.model";
import { publicUploadUrl } from "../middleware/upload.middleware";

const ALLOWED_KEYS = new Set(["home", "about", "services"]);

export const PageContentController = {
  async get(req: Request, res: Response) {
    const { key } = req.params;
    if (!ALLOWED_KEYS.has(key)) {
      return res.status(400).json({ success: false, error: "Unknown page key" });
    }
    const data = await PageContentModel.get(key);
    res.json({ success: true, data: data ?? {} });
  },

  async set(req: Request, res: Response) {
    const { key } = req.params;
    if (!ALLOWED_KEYS.has(key)) {
      return res.status(400).json({ success: false, error: "Unknown page key" });
    }
    if (!req.body || typeof req.body !== "object") {
      return res.status(400).json({ success: false, error: "Invalid body" });
    }
    const data = await PageContentModel.set(key, req.body);
    res.json({ success: true, data });
  },

  // Handles an image uploaded from the admin panel (e.g. hero image, offer
  // image, a service's icon image) — file already saved to
  // uploads/page-content/ by multer; we just return its public URL for the
  // ImagePicker to store inline in the page's JSON content.
  async uploadImage(req: Request, res: Response) {
    if (!req.file) {
      return res.status(400).json({ success: false, error: "No image file uploaded" });
    }
    const url = publicUploadUrl("page-content", req.file.filename);
    res.json({ success: true, url });
  },
};
