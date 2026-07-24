import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";

import authRoutes from "./routes/authRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import sponsorRoutes from "./routes/sponsorRoutes.js";
import interestRoutes from "./routes/interestRoutes.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

export const createApp = () => {
  const app = express();

  const allowedOrigins = (process.env.CLIENT_ORIGINS || "")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow non-browser requests (curl, server-to-server) with no origin header
        if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
          return callback(null, true);
        }
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      },
      credentials: true,
    })
  );

  app.use(helmet());
  // Raised from a typical 100kb default to fit a handful of compressed,
// base64-encoded event/sponsor photos in a single request.
app.use(express.json({ limit: "15mb" }));
  app.use(mongoSanitize());
  if (process.env.NODE_ENV !== "test") {
    app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
  }

  // Basic rate limiting to protect auth endpoints from brute force
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 50,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: "Too many attempts, please try again later" },
  });
  app.use("/api/auth", authLimiter);

  app.get("/api/health", (req, res) => res.json({ success: true, status: "ok" }));

  app.use("/api/auth", authRoutes);
  app.use("/api/events", eventRoutes);
  app.use("/api/sponsors", sponsorRoutes);
  app.use("/api/interests", interestRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
};
