import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/index.js";

export const signupController = async (req, res) => {
  const { email, fullName, password } = req.body;

  try {
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
      // Use 'new' keyword
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
      res
        .status(400)
        .json({ success: false, message: "Failed to create user." });
    }
  } catch (error) {
    console.error("Error in signupController:", error); // Log the error
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    }); // Generic error message
  }
};

export const loginController = (req, res) => {
  res.send("Sign up route");
};

export const logoutController = (req, res) => {
  res.send("Sign up route");
};
