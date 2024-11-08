import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";
import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";


export const handleSignup = async (req, res) => {
  try {
    const { username, fullName, email, password } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (!username || !fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ message: "Username already taken" });
    }

    const existingEmail = await User.findOne({ email });

    if (existingEmail) {
      return res.status(400).json({ message: "Email already taken" });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = new User({
      username,
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res);
      await newUser.save();
      return res.status(201).json({
        _id: newUser._id,
        username: newUser.username,
        fullName: newUser.fullName,
        email: newUser.email,
        followers: newUser.followers,
        following: newUser.following,
        profileImg: newUser.profileImg,
        coverImg: newUser.coverImg,
      });
    } else {
      return res.status(400).json({ error: "Invalid user data" });
    }
  } catch (error) {
    console.log("error in signup controller", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const handleLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username && !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = User.findOne({ username });
    const isPasswordCorrent = await bcryptjs.compare(
      password,
      user?.password || ""
    );

    if (!user || !isPasswordCorrent) {
      return res
        .status(404)
        .json({ message: "Username and password is not correct" });
    }

    generateTokenAndSetCookie(user._id, res);
    res.status(200).json({
      _id: user._id,
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      followers: user.followers,
      following: user.following,
      profileImg: user.profileImg,
      coverImg: user.coverImg,
    });
  } catch (error) {
    console.log("error in login controller", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const handleLogout = (req, res) => {
  try {
    res.clearCookie("jwt", "", { maxAge: 0 });
    return res.status(200).json({ message: "Successfully logged out" });
  } catch (error) {
    console.log("error in logout controller", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json(user);
  }catch (error) {

    console.log("error in getMe controller", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
}