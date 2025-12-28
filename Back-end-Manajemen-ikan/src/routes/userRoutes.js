import express from "express";
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  login,
} from "../controllers/userController.js";
import { authMiddleware, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public route: login
router.post("/login", login);

// Protected routes: hanya user login bisa akses
router.get("/users", authMiddleware, adminOnly, getUsers); // hanya admin
router.get("/users/:id", authMiddleware, adminOnly, getUserById); // hanya admin

// Protected routes: admin-only
router.post("/users", authMiddleware, adminOnly, createUser);
router.put("/users/:id", authMiddleware, adminOnly, updateUser);
router.delete("/users/:id", authMiddleware, adminOnly, deleteUser);

export default router;
