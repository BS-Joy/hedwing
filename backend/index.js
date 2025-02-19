import express from "express";
import authRouter from "./routes/auth.route.js";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import messageRouter from "./routes/message.route.js";
import { app, io, server } from "./lib/socket.io.js";
import friendsRouter from "./routes/friend.route.js";

dotenv.config();
const port = process.env.PORT || 5001;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/messages", messageRouter);
app.use("/api/friends", friendsRouter);

// app.use((err, req, res, next) => {
//   console.error("Error:", err.message);
//   res.status(err.status || 500).json({
//     success: false,
//     message: err.message || "Internal Server Error",
//   });
// });

server.listen(port, () => {
  console.log("🚀 server is running on port: ", port);
  connectDB();
});
