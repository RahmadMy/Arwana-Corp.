import express from "express";
import {
  createFeedingSchedule,
  getAllFeedingSchedules,
  getFeedingScheduleById,
  updateFeedingSchedule,
  deleteFeedingSchedule,
} from "../controllers/feedingScheduleController.js";

const router = express.Router();

router.get("/feeding-schedules", getAllFeedingSchedules);
router.get("/feeding-schedules/:id", getFeedingScheduleById);
router.post("/feeding-schedules", createFeedingSchedule);
router.put("/feeding-schedules/:id", updateFeedingSchedule);
router.delete("/feeding-schedules/:id", deleteFeedingSchedule);

export default router;

