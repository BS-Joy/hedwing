import express, { Router } from "express";
import {
  loginController,
  logoutController,
  signupController,
  updateProfile,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const authRouter = express.Router();

authRouter.post("/signup", signupController);
authRouter.post("/signin", loginController);
authRouter.get("/logout", logoutController);

authRouter.patch("/updateProfile", protectRoute, updateProfile);

export default authRouter;
