import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    users: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
    },
    roomStatus: {
      type: String,
      enum: ["okay", "blocked"],
      default: "okay",
    },
    blockedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  },
  {
    timestamps: true, // Keeps track of when the request was made/updated
  }
);

const chatModel = mongoose.models.Chat ?? mongoose.model("Chat", chatSchema);

export default chatModel;
