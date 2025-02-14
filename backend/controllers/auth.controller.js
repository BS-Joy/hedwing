import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/index.js";
import cloudinary from "../lib/cloudinary.js";
import catchAsync from "../utils/catchAsync.js";

/**
 * User Signup Controller
 */
export const signupController = catchAsync(async (req, res) => {
  const { email, fullName, password } = req.body;

  // *** Validation ***
  if (!fullName) {
    return res
      .status(400)
      .json({ success: false, message: "Full name is required." });
  }

  if (!email) {
    return res
      .status(400)
      .json({ success: false, message: "Email is required." });
  }

  if (!password) {
    return res
      .status(400)
      .json({ success: false, message: "Password is required." });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 6 characters or more.",
    });
  }

  // *** Check for existing user ***
  const existingUser = await userModel.findOne({ email });

  if (existingUser) {
    return res
      .status(409)
      .json({ success: false, message: "Email already exists." }); // 409 Conflict
  }

  // *** Hash password ***
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);

  // *** Create new user ***
  const newUser = new userModel({
    email,
    fullName,
    password: hashedPassword,
  });

  const savedUser = await newUser.save(); // Save the user

  if (savedUser) {
    generateToken(savedUser._id, res);

    // *** Selectively return user data ***
    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        _id: savedUser._id,
        fullName: savedUser.fullName,
        email: savedUser.email,
      },
    });
  } else {
    res.status(400).json({
      success: false,
      message: "Failed to create user.",
    });
  }
});

/**
 * User Login Controller
 */
export const loginController = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email }).lean();

  if (!user || !password) {
    return res
      .status(404)
      .json({ success: false, message: "Invalid credentials." });
  }

  const isPassValid = await bcrypt.compare(password, user?.password);
  if (!isPassValid) {
    return res
      .status(404)
      .json({ success: false, message: "Invalid credentials." });
  }

  generateToken(user?._id, res);

  const { password: _, ...userWithoutPassword } = user;
  res.status(200).json({
    success: true,
    message: "Log In Successful.",
    user: userWithoutPassword,
  });
});

/**
 * User Logout Controller
 */
export const logoutController = catchAsync(async (req, res) => {
  res.cookie("jwt", "", {
    maxAge: 0,
  });

  res.status(200).json({
    success: true,
    message: "Log Out Successful.",
  });
});

/**
 * Update User Profile Picture
 */
export const updateProfile = catchAsync(async (req, res) => {
  const { profilePic } = req.body;
  const userId = req.user._id;

  if (!profilePic) {
    return res
      .status(400)
      .json({ success: false, message: "Profile Pic is required." });
  }

  const cloudinaryRes = await cloudinary.uploader.upload(profilePic, {
    folder: "hedwing/user",
  });

  const updateUser = await userModel
    .findByIdAndUpdate(
      userId,
      { profilePic: cloudinaryRes.secure_url },
      { new: true }
    )
    .select("-password");

  res.status(200).json({
    success: true,
    message: "Profile pic updated successfully.",
    user: updateUser,
  });
});

/*
 * chek auth controller
 */

export const checkAuth = catchAsync((req, res) => {
  res.status(200).json(req.user);
});
