import chatModel from "../models/chat.model.js";
import userModel from "../models/user.model.js";
import catchAsync from "../utils/catchAsync.js";

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
