import express from "express";
import authRouter from "./routes/auth.route.js";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import cors from "cors";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5001;

connectDB();

app.use("/api/auth", authRouter);

app.listen(5000, () => {
  console.log("server is running on port: ", port);
  connectDB();
});
