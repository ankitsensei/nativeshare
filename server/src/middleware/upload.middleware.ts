import multer from "multer";
import path from "node:path";
import { createFileId, UPLOAD_DIR } from "../services/file.service.js";

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, UPLOAD_DIR);
  },
  filename: (_req, _file, callback) => {
    callback(
      null,
      createFileId() + path.extname(_file.originalname).slice(0, 20),
    );
  },
});

export const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 1024,
    files: 20,
  },
});
