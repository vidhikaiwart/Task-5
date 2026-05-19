import express from "express";
import { registerUser, loginUser, getProfile, getAllUsers, updateUserRole, deleteUser, logoutUser, refreshToken } from "../controllers/authController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import { registerValidation, loginValidation, validate } from "../validators/authValidator.js";

const router = express.Router();

router.post("/register", registerValidation, validate, registerUser);
router.post("/login", loginValidation, validate, loginUser);
router.post("/refresh", refreshToken);
router.post("/logout", logoutUser);
router.get("/profile", protect, getProfile);

// Admin Routes
router.get("/users", protect, admin, getAllUsers);
router.put("/users/:id/role", protect, admin, updateUserRole);
router.delete("/users/:id", protect, admin, deleteUser);

export default router;