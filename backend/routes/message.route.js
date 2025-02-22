import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  deleteMessage,
  editMessage,
  getMessages,
  getChatsForSidebar,
  sendMessage,
} from "../controllers/message.controller.js";

const messageRouter = express.Router();

messageRouter.get("/users", protectRoute, getChatsForSidebar);
messageRouter.get("/:id", protectRoute, getMessages);

messageRouter.post("/send/:id", protectRoute, sendMessage);

messageRouter.delete("/delete/:msgId", protectRoute, deleteMessage);

messageRouter.patch("/edit", protectRoute, editMessage);

export default messageRouter;
