import express from "express";
import {
  createSpecies,
  getAllSpecies,
  getSpeciesById,
  updateSpecies,
  deleteSpecies,
  getGrowthsBySpecies,
} from "../controllers/fishSpeciesController.js";
import { authMiddleware, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET routes
// Bisa diakses semua user login
router.get("/fish-species", getAllSpecies);
router.get("/fish-species/:id", authMiddleware, getSpeciesById);
router.get("/fish-species/:id/growths", authMiddleware, getGrowthsBySpecies);

// Protected routes: hanya admin yang bisa membuat, update, delete
router.post("/fish-species", authMiddleware, adminOnly, createSpecies);
router.put("/fish-species/:id", authMiddleware, adminOnly, updateSpecies);
router.delete("/fish-species/:id", authMiddleware, adminOnly, deleteSpecies);

export default router;
