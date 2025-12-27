import express from "express";
import {
  createFishGrowth,
  getAllFishGrowth,
  getFishGrowthById,
  updateFishGrowth,
  deleteFishGrowth,
} from "../controllers/fishGrowthController.js";

const router = express.Router();

router.get("/fish-growths", getAllFishGrowth);
router.get("/fish-growths/:id", getFishGrowthById);
router.post("/fish-growths", createFishGrowth);
router.put("/fish-growths/:id", updateFishGrowth);
router.delete("/fish-growths/:id", deleteFishGrowth);

export default router;

