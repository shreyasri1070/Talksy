import React from 'react'

const uploadController = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    res.json({
      url: req.file.path,           // ✅ cloudinary URL
      publicId: req.file.filename,  // ✅ for deletion later
      mediaType: req.file.mimetype.startsWith("image") ? "image"
               : req.file.mimetype.startsWith("video") ? "video"
               : req.file.mimetype.startsWith("audio") ? "audio"
               : "file",
    });
  } catch (err) {
    res.status(500).json({ error: "Upload failed", details: err.message });
  }
}

export default uploadController;
