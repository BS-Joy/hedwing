import mongoose from "mongoose";

const friendSchema = new mongoose.Schema(
  {
    requestSender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "blocked"],
      default: "pending",
    },
  },
  {
    timestamps: true, // Keeps track of when the request was made/updated
  }
);

const friendModel =
  mongoose.models.Friend ?? mongoose.model("Friend", friendSchema);

export default friendModel;
