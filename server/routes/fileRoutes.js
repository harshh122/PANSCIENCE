import express from "express";
import mongoose from "mongoose";

const router = express.Router();

// ✅ GET /api/files/:filename
router.get("/:filename", async (req, res) => {
  try {
    // Access the active MongoDB connection
    const db = mongoose.connection.db;

    // Create a GridFS bucket
    const bucket = new mongoose.mongo.GridFSBucket(db, {
      bucketName: "uploads", // must match your GridFS storage config
    });

    // Find file metadata
    const files = await db.collection("uploads.files")
      .find({ filename: req.params.filename })
      .toArray();

    if (!files || files.length === 0) {
      return res.status(404).json({ message: "File not found" });
    }

    const file = files[0];
    res.set("Content-Type", file.contentType || "application/octet-stream");

    // Stream the file
    const readStream = bucket.openDownloadStreamByName(req.params.filename);
    readStream.pipe(res);

    readStream.on("error", (err) => {
      console.error("Stream error:", err);
      res.status(500).json({ message: "Error streaming file" });
    });
  } catch (err) {
    console.error("Error fetching file:", err);
    res.status(500).json({ message: "Error fetching file" });
  }
});

export default router;
