import { Router } from "express";
import fs from "node:fs";
import path from "node:path";
import { upload } from "../middleware/upload.middleware.js";
import {
  createFileId,
  getFileById,
  getFileList,
  getFilePath,
  saveFileMetadata,
  type StoredFile,
} from "../services/file.service.js";

const router = Router();

// Upload files
router.post("/upload", upload.array("files", 20), (req, res) => {
  const files = (req.files ?? []) as Express.Multer.File[];

  if (files.length === 0) {
    res.status(400).json({
      success: false,
      message: "No files uploaded",
    });
    return;
  }

  const uploadedFiles: StoredFile[] = files.map((file) => {
    const storedFile: StoredFile = {
      id: createFileId(),
      originalName: path.basename(file.originalname),
      filename: file.filename,
      size: file.size,
      mimetype: file.mimetype,
      uploadedAt: new Date().toISOString(),
    };

    saveFileMetadata(storedFile);
    return storedFile;
  });

  res.status(201).json({
    success: true,
    message: "Files uploaded successfully",
    files: uploadedFiles,
  });
});

// List files
router.get("/", (_req, res) => {
  res.json({
    success: true,
    files: getFileList(),
  });
});

// Download file
router.get("/:id/download", (req, res) => {
  const file = getFileById(req.params.id);

  if (!file) {
    res.status(404).json({
      success: false,
      message: "File not found",
    });
    return;
  }

  const filePath = getFilePath(file.filename);

  if (!fs.existsSync(filePath)) {
    res.status(404).json({
      success: false,
      message: "File is missing from storage",
    });
    return;
  }

  res.download(filePath, file.originalName);
});

export default router;
