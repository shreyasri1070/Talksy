import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import uploadController from "../controllers/uploadController.js";

const router = express.Router();

router.post("/upload", upload.single("file"), uploadController);

export default router;