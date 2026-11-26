import express from "express";
import cors from "cors";
import os from "node:os";
import { getLocalIP } from "./utils/network.js";

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const HOST = "0.0.0.0";

// Middleware
app.use(cors());
app.use(express.json());

// Health Check
app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "NativeShare server is running!",
    timestamp: new Date().toISOString,
  });
});

// Server information
app.get("/api/info", (_req, res) => {
  res.json({
    name: "NativeShare",
    version: "1.0.0",
    localIP: getLocalIP(),
    port: PORT,
    networkInterfaces: os.networkInterfaces(),
  });
});

// Start server
app.listen(PORT, HOST, () => {
  const localIP = getLocalIP();

  console.log("\n------------------------------");
  console.log("       NativeShare");
  console.log("------------------------------");
  console.log(`Local:   http://localhost:${PORT}`);
  console.log(`Network: http://${localIP}:${PORT}`);
  console.log("------------------------------\n");
});
