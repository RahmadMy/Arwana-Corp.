import express from "express";
import {
  createFeed,
  getAllFeeds,
  getFeedById,
  updateFeed,
  deleteFeed,
} from "../controllers/feedController.js";

const router = express.Router();

router.get("/feeds", getAllFeeds);
router.get("/feeds/:id", getFeedById);
router.post("/feeds", createFeed);
router.put("/feeds/:id", updateFeed);
router.delete("/feeds/:id", deleteFeed);

export default router;

