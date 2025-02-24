import mongoose, { mongo } from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },
    text: {
      type: String,
    },
    image: {
      type: String,
    },
    edited: {
      type: Boolean,
      default: false,
    },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const messageModel =
  mongoose.models.Message ?? mongoose.model("Message", messageSchema);

export default messageModel;
