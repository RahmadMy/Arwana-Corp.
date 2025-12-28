import express from "express";
import {
  createFishHealth,
  getAllFishHealth,
  getFishHealthById,
  updateFishHealth,
  deleteFishHealth,
} from "../controllers/fishHealthController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET routes → bisa diakses semua user login
router.get("/fish-healths", authMiddleware, getAllFishHealth);
router.get("/fish-healths/:id", authMiddleware, getFishHealthById);

// Protected routes → hanya admin yang bisa mengubah data
router.post("/fish-healths", authMiddleware, createFishHealth);
router.put("/fish-healths/:id", authMiddleware, updateFishHealth);
router.delete("/fish-healths/:id", authMiddleware, deleteFishHealth);

export default router;
