import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profilePic: {
      type: String,
      default: "",
    },
    friends: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Friend",
    },
    blockList: {
      type: Array,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.models.User ?? mongoose.model("User", userSchema);

export default userModel;
