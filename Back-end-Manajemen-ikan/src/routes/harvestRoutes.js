import express from "express";
import {
  createHarvest,
  getAllHarvests,
  getHarvestById,
  updateHarvest,
  deleteHarvest,
} from "../controllers/harvestController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET route
// Bisa diakses semua orang, atau ubah jadi authMiddleware jika ingin login dulu
router.get("/harvests", authMiddleware, getAllHarvests);
router.get("/harvests/:id", authMiddleware, getHarvestById);

// Protected routes: hanya admin yang bisa membuat, update, delete
router.post("/harvests", authMiddleware, createHarvest);
router.put("/harvests/:id", authMiddleware, updateHarvest);
router.delete("/harvests/:id", authMiddleware, deleteHarvest);

export default router;
