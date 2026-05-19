import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { generateTokens } from "../utils/generateToken.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    const { accessToken, refreshToken } = generateTokens(user);
    
    // Store refresh token securely
    user.refreshToken = refreshToken;
    await user.save();

    res.status(201).json({
      success: true,
      message: "User registered",
      user: { ...user._doc, password: undefined },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const { accessToken, refreshToken } = generateTokens(user);
    
    // Store refresh token securely (refresh token rotation)
    user.refreshToken = refreshToken;
    await user.save();

    res.json({
      success: true,
      user: { ...user._doc, password: undefined },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token required",
      });
    }

    // Verify refresh token
    const jwt = await import("jsonwebtoken");
    const decoded = jwt.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    // Find user and check if refresh token matches
    const user = await User.findById(decoded.id);
    
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    // Generate new tokens (refresh token rotation)
    const tokens = generateTokens(user);
    
    // Update refresh token
    user.refreshToken = tokens.refreshToken;
    await user.save();

    res.json({
      success: true,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid or expired refresh token",
    });
  }
};

export const logoutUser = async (req, res) => {
  try {
    // Get user ID from token if available, otherwise try body/header
    const userId = req.user?.id || req.body?.userId || req.headers["x-user-id"];
    
    if (userId) {
      const user = await User.findById(userId);
      if (user) {
        user.refreshToken = null;
        await user.save();
      }
    }
    
    res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getProfile = async (req, res) => {
  const user = await User.findById(req.user.id).select("-password -refreshToken");
  res.json({
    success: true,
    user,
  });
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password -refreshToken");
    res.json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid role value" 
      });
    }
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }
    user.role = role;
    await user.save();
    res.json({ 
      success: true,
      message: "User role updated successfully", 
      user: { ...user._doc, password: undefined, refreshToken: undefined } 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }
    await User.findByIdAndDelete(req.params.id);
    res.json({ 
      success: true,
      message: "User deleted successfully" 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};