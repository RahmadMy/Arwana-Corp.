import express from "express";
import {
  createFishHealth,
  getAllFishHealth,
  getFishHealthById,
  updateFishHealth,
  deleteFishHealth,
} from "../controllers/fishHealthController.js";

const router = express.Router();

router.get("/fish-healths", getAllFishHealth);
router.get("/fish-healths/:id", getFishHealthById);
router.post("/fish-healths", createFishHealth);
router.put("/fish-healths/:id", updateFishHealth);
router.delete("/fish-healths/:id", deleteFishHealth);

export default router;

