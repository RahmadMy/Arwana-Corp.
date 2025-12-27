import express from "express";
import {
  createSpecies,
  getAllSpecies,
  getSpeciesById,
  updateSpecies,
  deleteSpecies,
  getGrowthsBySpecies,
} from "../controllers/fishSpeciesController.js";

const router = express.Router();

router.get("/fish-species", getAllSpecies);
router.get("/fish-species/:id", getSpeciesById);
router.get("/fish-species/:id/growths", getGrowthsBySpecies);
router.post("/fish-species", createSpecies);
router.put("/fish-species/:id", updateSpecies);
router.delete("/fish-species/:id", deleteSpecies);

export default router;

