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

  const chats = await chatModel
    .find({
      users: { $in: currentUser }, // Exclude the current user as well as users in the blockList
    })
    .populate("users lastMessage")
    .select("-password") // Exclude password field
    .sort({ updatedAt: -1 })
    .lean();

  res.status(200).json({
    success: true,
    message: "All users retrieved successfully.",
    chats: chats,
  });
});

/**
 * Get messages between two users
 */
export const getMessages = catchAsync(async (req, res) => {
  const chatId = req.params.id;

  if (!chatId) {
    console.log(chatId);
    return res.status(200).json({
      success: true,
      message: "Messages retrieved successfully.",
      messages: [],
    });
  }

  const messages = await messageModel
    .find({
      chatId,
    })
    .sort({ createdAt: 1 }) // Sort messages by time in ascending order
    .lean();

  res.status(200).json({
    success: true,
    message: "Messages retrieved successfully.",
    messages,
  });
});

/*
 * Get Unseen messages count
 */
export const updateUnseenCount = catchAsync(async (req, res) => {
  const roomId = req.params.id;
  const currentUser = req.user._id;

  // console.log({ roomId });

  // 🔥 Find unseen messages for the current user in this chat
  const unseenMessages = await messageModel.find({
    chatId: roomId,
    senderId: { $ne: currentUser }, // Only messages sent by others
    readBy: { $ne: currentUser }, // Messages not read by currentUser
  });

  // 🔥 Update the unseenCount in chatModel with the correct count
  await chatModel.findByIdAndUpdate(
    roomId,
    {
      unseenCount: unseenMessages.length, // ✅ Set unseen count correctly
    },
    { new: true }
  );

  res.status(200).json({
    success: true,
    message: "Unseen count updated successfully.",
    unseenCount: unseenMessages.length,
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

  let newRoom;

  // if no room created yet
  if (!room) {
    newRoom = await chatModel.create({
      users: [senderId, receiverId],
      roomStatus: "okay",
    });

    // 🔥 Emit event to notify receiver about the new chat
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newChat", {
        room: newRoom,
        senderId,
      });
    }
  }

  let imageUrl;

  if (image) {
    const uploadRes = await cloudinary.uploader.upload(image, {
      folder: "hedwing/messages",
    });
    imageUrl = uploadRes.secure_url;
  }

  const roomId = room ? room?._id : newRoom?._id;

  // Create and save message
  const newMessage = await messageModel.create({
    senderId,
    receiverId,
    chatId: roomId,
    text,
    image: imageUrl || "",
    readBy: [senderId],
  });

  await chatModel.findByIdAndUpdate(
    roomId,
    {
      lastMessage: newMessage?._id,
      // $inc: { unseenCount: 1 }, // 🔥 Increment unseenCount by 1 directly in DB
    },
    { new: true }
  );

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

  const receiverSocketId = getReceiverSocketId(theMessage?.receiverId);

  if (receiverSocketId) {
    io.to(receiverSocketId).emit("deleteMessage", msgId);
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

  const editedMessage = await messageModel.findByIdAndUpdate(
    updatedMessage._id,
    { text: updatedMessage.text, edited: true },
    { new: true }
  );

  const receiverSocketId = getReceiverSocketId(updatedMessage?.receiverId);

  if (receiverSocketId) {
    // console.log("updating message: ", editedMessage);
    io.to(receiverSocketId).emit("updateMessage", editedMessage);
  }

  res.status(200).json({
    success: true,
    message: "Message updated successfully.",
    updatedMessage: editedMessage,
  });
});

/**
 * markMessageAsSeen
 */
const markMessageAsSeen = async (messageId, userId) => {
  const message = await messageModel.findById(messageId);

  // Check if the user has already marked the message as seen
  if (!message.readBy.includes(userId)) {
    message.readBy.push(userId);
    await message.save();
  }
};
