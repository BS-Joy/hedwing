import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { blockChat } from "../controllers/chat.controller.js";

const chatRouter = express.Router();

chatRouter.patch("/block", protectRoute, blockChat);

export default chatRouter;
