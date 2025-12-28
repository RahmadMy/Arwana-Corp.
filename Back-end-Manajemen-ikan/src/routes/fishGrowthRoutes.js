import express from "express";
import {
  createFishGrowth,
  getAllFishGrowth,
  getFishGrowthById,
  updateFishGrowth,
  deleteFishGrowth,
} from "../controllers/fishGrowthController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

//routes → bisa diakses semua user login
router.get("/fish-growths", authMiddleware, getAllFishGrowth);
router.get("/fish-growths/:id", authMiddleware, getFishGrowthById);
router.post("/fish-growths", authMiddleware, createFishGrowth);
router.put("/fish-growths/:id", authMiddleware, updateFishGrowth);
router.delete("/fish-growths/:id", authMiddleware, deleteFishGrowth);

export default router;

