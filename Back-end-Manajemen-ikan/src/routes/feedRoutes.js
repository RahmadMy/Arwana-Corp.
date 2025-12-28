import express from "express";
import {
  createFeed,
  getAllFeeds,
  getFeedById,
  updateFeed,
  deleteFeed,
} from "../controllers/feedController.js";
import { authMiddleware,adminOnly } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/feeds", authMiddleware ,getAllFeeds);
router.get("/feeds/:id", authMiddleware ,getFeedById);
router.post("/feeds", authMiddleware ,adminOnly ,createFeed);
router.put("/feeds/:id", authMiddleware ,adminOnly ,updateFeed);
router.delete("/feeds/:id", authMiddleware ,adminOnly ,deleteFeed);

export default router;

