import express from "express";
import {
  createFeedingSchedule,
  getAllFeedingSchedules,
  getFeedingScheduleById,
  updateFeedingSchedule,
  deleteFeedingSchedule,
} from "../controllers/feedingScheduleController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/feeding-schedules", authMiddleware, getAllFeedingSchedules);
router.get("/feeding-schedules/:id", authMiddleware, getFeedingScheduleById);
router.post("/feeding-schedules", authMiddleware, createFeedingSchedule);
router.put("/feeding-schedules/:id", authMiddleware, updateFeedingSchedule);
router.delete("/feeding-schedules/:id", authMiddleware, deleteFeedingSchedule);

export default router;

