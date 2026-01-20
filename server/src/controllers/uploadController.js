import cloudinary from "../config/cloudinary.js";

export async function uploadLogo(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file provided" });
    }

    const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

    const result = await cloudinary.uploader.upload(base64, {
      folder: "shop-logo",
    });

    return res.status(200).json({
      success: true,
      url: result.secure_url,
    });
  } catch (err) {
    next(err);
  }
}
