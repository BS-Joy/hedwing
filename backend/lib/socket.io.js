import { Server } from "socket.io";
import http from "http";
import express from "express";
import messageModel from "../models/message.model.js";
import chatModel from "../models/chat.model.js";

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  "https://hedwings.netlify.app",
  "http://localhost:5173", // For local development
];

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

// used to store online user
const userSocketMap = {};

export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

io.on("connection", (socket) => {
  // console.log("A user is connected: ", socket.id);

  const userId = socket.handshake.query.userId;

  if (userId && userId !== undefined) userSocketMap[userId] = socket.id;

  // used to broadcast online status to all the connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // for getting typing status
  socket.on("typing", ({ senderId, receiverId }) => {
    const receiverSocketId = getReceiverSocketId(receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("userTyping", { senderId });
    }
  });

  // get status when typing stopped
  socket.on("stopTyping", ({ senderId, receiverId }) => {
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("userStopTyping", { senderId });
    }
  });

  // when message seen
  // In your socket.io backend (e.g., in your connection handler)
  socket.on("message-seen", async ({ messageId, userId }) => {
    // console.log({ messageId, userId });
    // Update the message document: add the userId to readBy if not already there
    const updatedMessage = await messageModel.findByIdAndUpdate(
      messageId,
      {
        $addToSet: { readBy: userId },
      },
      { new: true }
    );

    await chatModel.findByIdAndUpdate(
      updatedMessage?.chatId,
      {
        unseenCount: {
          total: 0, // Reset total unseen messages
          toShow: null, // Reset the `toShow` (no unread messages to display)
        },
      },
      { new: true }
    );
    // Optionally, emit an event to update the UI in real time
    io.emit("update-message-status", { messageId, userId });
  });

  // when connect to a new user
  socket.on("newUser", async (newUser) => {
    io.emit("onNewUser", newUser);
  });

  socket.on("disconnect", () => {
    // console.log("A user disconnected.", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
