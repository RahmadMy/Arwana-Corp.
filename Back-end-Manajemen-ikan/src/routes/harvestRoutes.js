import express from "express";
import {
  createHarvest,
  getAllHarvests,
  getHarvestById,
  updateHarvest,
  deleteHarvest,
} from "../controllers/harvestController.js";

const router = express.Router();

router.get("/harvests", getAllHarvests);
router.get("/harvests/:id", getHarvestById);
router.post("/harvests", createHarvest);
router.put("/harvests/:id", updateHarvest);
router.delete("/harvests/:id", deleteHarvest);

export default router;

