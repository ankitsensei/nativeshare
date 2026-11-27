import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

export const UPLOAD_DIR = path.resolve("uploads");

fs.mkdirSync(UPLOAD_DIR, { recursive: true });

export interface StoredFile {
  id: string;
  originalName: string;
  filename: string;
  size: number;
  mimetype: string;
  uploadedAt: string;
}

export function createFileId(): string {
  return crypto.randomUUID();
}
export function getFilePath(filename: string): string {
  return path.join(UPLOAD_DIR, filename);
}

export function getFileList(): StoredFile[] {
  const files = fs.readdirSync(UPLOAD_DIR);

  return files
    .filter((filename) => filename.endsWith(".json"))
    .map((filename) => {
      const content = fs.readFileSync(path.join(UPLOAD_DIR, filename), "utf-8");

      return JSON.parse(content) as StoredFile;
    })
    .sort(
      (a, b) =>
        new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime(),
    );
}

export function saveFileMetadata(file: StoredFile): void {
  const metadataPath = path.join(UPLOAD_DIR, `${file.id}.json`);

  fs.writeFileSync(metadataPath, JSON.stringify(file, null, 2));
}

export function getFileById(id: string): StoredFile | undefined {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return undefined;

  const metadataPath = path.join(UPLOAD_DIR, `${id}.json`);

  if (!fs.existsSync(metadataPath)) return undefined;

  return JSON.parse(fs.readFileSync(metadataPath, "utf-8")) as StoredFile;
}
