import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
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
  socket.on("message-seen", async ({ messageId, userId }) => {
    await markMessageAsSeen(messageId, userId); // Mark the message as seen
    io.emit("update-message-status", { messageId, userId }); // Notify all connected clients
  });

  socket.on("disconnect", () => {
    // console.log("A user disconnected.", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
