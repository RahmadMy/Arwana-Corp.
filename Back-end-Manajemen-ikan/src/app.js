import express from "express";
import cors from 'cors'

import userRoutes from "./routes/userRoutes.js";
import newsRoutes from "./routes/newsRoutes.js";
import aquariumRoutes from "./routes/aquariumRoutes.js";
import fishGrowthRoutes from "./routes/fishGrowthRoutes.js";
import fishSpeciesRoutes from "./routes/fishSpeciesRoutes.js";
import fishHealthRoutes from "./routes/fishHealthRoutes.js";
import harvestRoutes from "./routes/harvestRoutes.js";
import feedingScheduleRoutes from "./routes/feedingScheduleRoutes.js";
import feedRoutes from "./routes/feedRoutes.js";


const app = express();
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Selamat Datang di API Manajemen Ikan Arwana");
});

app.use("/api", userRoutes);
app.use("/api", newsRoutes);
app.use("/api", aquariumRoutes);
app.use("/api", fishGrowthRoutes);
app.use("/api", fishSpeciesRoutes);
app.use("/api", fishHealthRoutes);
app.use("/api", harvestRoutes);
app.use("/api", feedingScheduleRoutes);
app.use("/api", feedRoutes);

app.use((_req, res) => {
  res.status(404).json({ message: "404 Not Found - halaman tidak ditemukan" });
});

export default app;