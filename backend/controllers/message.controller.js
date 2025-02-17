import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.io.js";
import messageModel from "../models/message.model.js";
import userModel from "../models/user.model.js";
import catchAsync from "../utils/catchAsync.js";

/**
 * Get users for sidebar (excluding the current user)
 */
export const getUserForSidebar = catchAsync(async (req, res) => {
  const currentUser = req.user._id;

  const filteredUsers = await userModel
    .find({ _id: { $ne: currentUser } }) // Corrected variable name
    .select("-password") // Exclude password field
    .lean();

  res.status(200).json({
    success: true,
    message: "All users retrieved successfully.",
    users: filteredUsers,
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

  if (theMessage?.senderId !== senderId) {
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

  const editRes = await messageModel.findByIdAndUpdate(
    updatedMessage._id,
    {
      text: updatedMessage.text,
    },
    { new: true }
  );

  console.log(editRes);

  res.status(200).json({
    success: true,
    message: "Message updated successfully.",
    updatedMessage: editRes,
  });
});
