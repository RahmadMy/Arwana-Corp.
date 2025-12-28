import express from "express";
import {
  createNews,
  getAllNews,
  getNewsById,
  getPublishedNews,
  updateNews,
  deleteNews,
} from "../controllers/newsController.js";
import { authMiddleware, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Siapa saja boleh melihat daftar/detail berita
router.get("/news", authMiddleware,getAllNews);
router.get("/news/published", getPublishedNews);
router.get("/news/:id", authMiddleware,getNewsById);


// Hanya admin yang boleh membuat, mengubah, dan menghapus berita
router.post("/news", authMiddleware, adminOnly, createNews);
router.put("/news/:id", authMiddleware, adminOnly, updateNews);
router.delete("/news/:id", authMiddleware, adminOnly, deleteNews);

export default router;

