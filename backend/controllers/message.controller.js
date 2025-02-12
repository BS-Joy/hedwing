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
  const { message, receiverId } = req.body;
  const senderId = req.user._id;

  // Validate input
  if (!message || !receiverId) {
    return res.status(400).json({
      success: false,
      message: "Message and receiverId are required.",
    });
  }

  // Create and save message
  const newMessage = await messageModel.create({
    senderId,
    receiverId,
    message,
  });

  res.status(201).json({
    success: true,
    message: "Message sent successfully.",
    data: newMessage,
  });
});
