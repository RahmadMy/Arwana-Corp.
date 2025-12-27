import express from "express";
import {
  createAquarium,
  getAllAquariums,
  getAquariumById,
  updateAquarium,
  deleteAquarium,
} from "../controllers/aquariumController.js";
import { authMiddleware, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/aquariums", getAllAquariums);
router.get("/aquariums/:id", getAquariumById);

// Hanya admin yang boleh membuat, mengubah, dan menghapus Aquarium
router.post("/aquariums", authMiddleware, adminOnly, createAquarium);
router.put("/aquariums/:id", authMiddleware, adminOnly, updateAquarium);
router.delete("/aquariums/:id", authMiddleware, adminOnly, deleteAquarium);

export default router;

