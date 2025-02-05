import express from "express";
import authRouter from "./routes/auth.route.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();

const port = process.env.PORT || 5001;

app.use("/api/auth", authRouter);

app.listen(5000, () => {
  console.log("server is running on port: ", port);
});
