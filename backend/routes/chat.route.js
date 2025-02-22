import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { blockChat, unblockChat } from "../controllers/chat.controller.js";

const chatRouter = express.Router();

chatRouter.patch("/block", protectRoute, blockChat);
chatRouter.patch("/unblock", protectRoute, unblockChat);

export default chatRouter;
