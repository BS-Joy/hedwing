import chatModel from "../models/chat.model.js";
import userModel from "../models/user.model.js";
import catchAsync from "../utils/catchAsync.js";

// block a chat room
export const blockChat = catchAsync(async (req, res) => {
  const { toBlock } = req.body;
  const currentUser = req.user;

  if (toBlock === currentUser?._id.toString()) {
    return res
      .status(422)
      .json({ success: false, message: "You can't block yourself🤣!" });
  }

  const myData = await userModel.findById(currentUser._id).select("-password");

  const chatRoom = await chatModel.findOne({
    users: { $all: [currentUser._id, toBlock] },
  });

  if (myData.blockList.includes(toBlock)) {
    return res
      .status(422)
      .json({ success: false, message: "You have already blocked this user!" });
  }

  myData.blockList.push(toBlock);
  chatRoom.roomStatus = "blocked";
  chatRoom.blockdBy = currentUser._id;

  myData.save();
  chatRoom.save();

  res.status(200).json({
    success: true,
    message: "Successfull",
  });
});

// unblock a chat room
export const unblockChat = catchAsync(async (req, res) => {
  const { toUnblock } = req.body;
  const currentUser = req.user;

  // Prevent self-unblocking (not necessary, but for consistency)
  if (toUnblock === currentUser?._id.toString()) {
    return res
      .status(422)
      .json({ success: false, message: "You can't unblock yourself🤣!" });
  }

  const myData = await userModel.findById(currentUser._id).select("-password");

  const chatRoom = await chatModel.findOne({
    users: { $all: [currentUser._id, toUnblock] },
  });

  if (!myData.blockList.includes(toUnblock)) {
    return res
      .status(422)
      .json({ success: false, message: "This user is not blocked!" });
  }

  // Remove user from blockList
  myData.blockList = myData.blockList.filter(
    (blockedUser) => blockedUser.toString() !== toUnblock
  );

  // Reset chat room status if it was blocked by the current user
  if (chatRoom.blockdBy.toString() === currentUser._id.toString()) {
    chatRoom.roomStatus = "okay";
    chatRoom.blockdBy = null;
  }

  await myData.save();
  await chatRoom.save();

  res.status(200).json({
    success: true,
    message: "User successfully unblocked!",
  });
});
