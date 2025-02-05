import express, { Router } from "express";
import { signupController } from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.get("/signup", signupController);

export default authRouter;
