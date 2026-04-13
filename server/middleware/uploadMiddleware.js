import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => ({
    folder: "chat-media",
    resource_type: "auto",        //handles image, video, audio
    allowed_formats: ["jpg", "jpeg", "png", "gif", "mp4", "mp3", "pdf", "webp"],
    transformation: file.mimetype.startsWith("image")
      ? [{ width: 1000, crop: "limit" }] //auto resize large images
      : [],
  }),
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

export default upload;