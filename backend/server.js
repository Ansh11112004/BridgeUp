import "dotenv/config";
import { createServer } from "http";
import { Server } from "socket.io";
import { createApp } from "./src/app.js";
import { connectDB } from "./src/config/db.js";
import { initChatSocket } from "./src/sockets/chatSocket.js";

const PORT = process.env.PORT || 5000;
const allowedOrigins = (process.env.CLIENT_ORIGINS || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

const start = async () => {
  await connectDB();

  const app = createApp();
  const httpServer = createServer(app);

  const io = new Server(httpServer, {
    cors: {
      origin: allowedOrigins.length ? allowedOrigins : "*",
      credentials: true,
    },
  });
  app.set("io", io);
  initChatSocket(io);

  httpServer.listen(PORT, () => {
    console.log(`[server] Listening on port ${PORT} (${process.env.NODE_ENV || "development"})`);
  });

  process.on("unhandledRejection", (err) => {
    console.error("[server] Unhandled rejection:", err);
  });
};

start();
