import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    console.log("Token: ", token);
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - No Token Found!",
      });
    }

    // decode token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    if (!decodedToken) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - Invalid Token!",
      });
    }

    // find user
    const user = await userModel
      .findById(decodedToken.userId)
      .select("-password")
      .lean();

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "No user found!" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error in protectRoute middleware:", error.message); // Log the error
    res.status(500).json({
      success: false,
      message: "Internal Server Error!",
    });
  }
};
