import mongoose from "mongoose";

let isConnected = false;

export const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.error(
      "[db] MONGO_URI is not set. Copy .env.example to .env and fill it in."
    );
    process.exit(1);
  }

  mongoose.set("strictQuery", true);

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      // Fail fast instead of buffering forever if Mongo is unreachable
      serverSelectionTimeoutMS: 10000,
    });
    isConnected = true;
    console.log(`[db] MongoDB connected: ${mongoose.connection.host}`);
  } catch (err) {
    console.error(`[db] MongoDB connection error: ${err.message}`);
    process.exit(1);
  }

  mongoose.connection.on("disconnected", () => {
    isConnected = false;
    console.warn("[db] MongoDB disconnected");
  });
};

export const isDbConnected = () => isConnected;
