import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.io.js";
import chatModel from "../models/chat.model.js";
import messageModel from "../models/message.model.js";
import catchAsync from "../utils/catchAsync.js";

/**
 * Get users for sidebar (excluding the current user)
 */
export const getChatsForSidebar = catchAsync(async (req, res) => {
  const currentUser = req.user._id;

  const filteredUsers = await chatModel
    .find({
      users: { $in: currentUser }, // Exclude the current user as well as users in the blockList
    })
    .populate("users", "-password") // Exclude password field
    .lean();

  res.status(200).json({
    success: true,
    message: "All users retrieved successfully.",
    chats: filteredUsers,
  });
});

/**
 * Get messages between two users
 */
export const getMessages = catchAsync(async (req, res) => {
  const userToChat = req.params.id;
  const myId = req.user._id;

  const messages = await messageModel
    .find({
      $or: [
        { senderId: myId, receiverId: userToChat },
        { senderId: userToChat, receiverId: myId },
      ],
    })
    .sort({ createdAt: 1 }) // Sort messages by time in ascending order
    .lean();

  res.status(200).json({
    success: true,
    message: "Messages retrieved successfully.",
    messages,
  });
});

/**
 * Send a new message
 */
export const sendMessage = catchAsync(async (req, res) => {
  const { text, image } = req.body;
  const { id: receiverId } = req.params;

  const senderId = req.user._id;

  const room = await chatModel.findOne({
    users: { $all: [senderId, receiverId] }, // Match chats with both senderId and receiverId
  });

  if (!room) {
    const newRoom = await chatModel.create({
      users: [senderId, receiverId],
      roomStatus: "okay",
    });
  }

  let imageUrl;

  if (image) {
    const uploadRes = await cloudinary.uploader.upload(image, {
      folder: "hedwing/messages",
    });
    imageUrl = uploadRes.secure_url;
  }

  // Create and save message
  const newMessage = await messageModel.create({
    senderId,
    receiverId,
    text,
    image: imageUrl || "",
  });

  //   realtime functionlity goes here ==> socket.io
  const receiverSocketId = getReceiverSocketId(receiverId);
  if (receiverSocketId) {
    io.to(receiverSocketId).emit("newMessage", newMessage);
  }

  res.status(201).json({
    success: true,
    message: "Message sent successfully.",
    data: newMessage,
  });
});

/**
 * delete a message
 */
export const deleteMessage = catchAsync(async (req, res) => {
  const { msgId } = req.params;

  const senderId = req.user._id;

  const theMessage = await messageModel.findById(msgId);

  if (theMessage?.senderId.toString() !== senderId.toString()) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: You are not the owner of this message!",
    });
  }

  if (!msgId) {
    return res.status(400).json({
      success: false,
      message: "Message ID is required.",
    });
  }

  const message = await messageModel.findByIdAndDelete(msgId);

  if (!message) {
    return res.status(404).json({
      success: false,
      message: "Invalid message ID or message not found!",
    });
  }

  res.status(200).json({
    success: true,
    message: "Message deleted successfully",
    response: message, // Sending back the deleted message
  });
});

/**
 * edit a message
 */
export const editMessage = catchAsync(async (req, res) => {
  const updatedMessage = req.body;

  if (!updatedMessage?._id || !updatedMessage?.text) {
    return res.status(400).json({
      success: false,
      message: "Message ID and updated text are required!",
    });
  }

  const senderId = req.user._id;

  if (!updatedMessage?.senderId) {
    return res.status(400).json({
      success: false,
      message: "Sender ID is required!",
    });
  }

  if (updatedMessage.senderId !== senderId.toString()) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: You are not the owner of this message!",
    });
  }

  const message = await messageModel.findById(updatedMessage._id);

  if (!message) {
    return res.status(404).json({
      success: false,
      message: "Message not found!",
    });
  }

  const editRes = await messageModel.findByIdAndUpdate(
    updatedMessage._id,
    { text: updatedMessage.text, edited: true },
    { new: true }
  );

  res.status(200).json({
    success: true,
    message: "Message updated successfully.",
    updatedMessage: editRes,
  });
});
