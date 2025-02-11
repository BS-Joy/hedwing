import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/index.js";

export const signupController = async (req, res) => {
  const { email, fullName, password } = req.body;
  console.log(req.body);
  try {
    // hash password
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters or more." });
    }

    const user = await userModel.findOne({ email });

    if (user) {
      return res.status(400).json({ message: "Email already exists." });
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await userModel.create({
      email,
      fullName,
      password: hashedPassword,
    });

    if (newUser) {
      generateToken(newUser?._id, res);
      console.log(newUser);
      res.status(201).json(newUser);
    } else {
      res.status(400).json({ message: "Failed to create user." });
    }
  } catch (err) {
    throw new Error(err);
  }
};

export const loginController = (req, res) => {
  res.send("Sign up route");
};

export const logoutController = (req, res) => {
  res.send("Sign up route");
};
