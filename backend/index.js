import express from "express";
import authRouter from "./routes/auth.route.js";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import messageRouter from "./routes/message.route.js";
import { app, io, server } from "./lib/socket.io.js";
import chatRouter from "./routes/chat.route.js";

dotenv.config();
const port = process.env.PORT || 5001;

connectDB();

app.use(
  cors({
    // origin: "https://hedwing.vercel.app",
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/messages", messageRouter);
app.use("/api/chat", chatRouter);

// app.use((err, req, res, next) => {
//   console.error("Error:", err.message);
//   res.status(err.status || 500).json({
//     success: false,
//     message: err.message || "Internal Server Error",
//   });
// });

app.get("/", (req, res) => {
  console.log("Server running");
  res.send("server is running");
});

server.listen(port, () => {
  console.log("🚀 server is running on port: ", port);
  connectDB();
});
