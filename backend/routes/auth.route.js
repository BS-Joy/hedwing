import express from "express";
import {
  checkAuth,
  loginController,
  logoutController,
  searchUser,
  signupController,
  updateProfile,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const authRouter = express.Router();

authRouter.post("/signup", signupController);
authRouter.post("/signin", loginController);
authRouter.post("/logout", logoutController);

authRouter.patch("/updateProfile", protectRoute, updateProfile);

authRouter.get("/checkauth", protectRoute, checkAuth);

authRouter.get("/search", protectRoute, searchUser);

export default authRouter;
