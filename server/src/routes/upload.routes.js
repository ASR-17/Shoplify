import { Router } from "express";
import multer from "multer";
import authMiddleware from "../middlewares/auth.middleware.js";
import cloudinary from "../config/cloudinary.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/logo",
  authMiddleware,
  upload.single("file"),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ success: false, message: "No file uploaded" });
      }

      const b64 = req.file.buffer.toString("base64");
      const dataUri = `data:${req.file.mimetype};base64,${b64}`;

      const result = await cloudinary.uploader.upload(dataUri, {
        folder: "smart-manager/logos",
      });

      return res.status(200).json({
        success: true,
        url: result.secure_url,
      });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
