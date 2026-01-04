import FishHealth from "../models/FishHealth.js";
import FishGrowth from "../models/FishGrowth.js";

export const createFishHealth = async (req, res) => {
  try {
    const { tanggalPemerikasaan, kondisi, tindakan, deskripsi, fishGrowthId } =
      req.body;

    if (!tanggalPemerikasaan || !fishGrowthId) {
      return res.status(400).json({
        message: "tanggalPemerikasaan dan fishGrowthId wajib diisi",
      });
    }

    const growth = await FishGrowth.findByPk(fishGrowthId);
    if (!growth) {
      return res
        .status(404)
        .json({ message: "Data pertumbuhan tidak ditemukan" });
    }

    // Constraint check removed for One-to-Many relationship
    // const existing = await FishHealth.findOne({ where: { fishGrowthId } });
    // if (existing) {
    //   return res.status(400).json({
    //     message: "Data pertumbuhan ini sudah memiliki data kesehatan",
    //   });
    // }

    // 1️⃣ CREATE FISH HEALTH
    const health = await FishHealth.create({
      tanggalPemerikasaan,
      kondisi,
      tindakan,
      deskripsi,
      fishGrowthId,
    });

    // 2️⃣ UPDATE FISH GROWTH (Removed specific 1-to-1 link update if not needed, or keep for 'latest' status)
    // For One-to-Many, we might not need to update a single fishHealthId on Growth unless it tracks the "status"
    if (growth.fishHealthId !== undefined) {
      await growth.update({
        fishHealthId: health.id,
      });
    }

    res.status(201).json({
      message:
        "Data kesehatan berhasil dibuat dan Fish Growth berhasil diperbarui",
      data: health,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getAllFishHealth = async (_req, res) => {
  try {
    const data = await FishHealth.findAll({
      include: [{ model: FishGrowth, as: "growth" }],
    });
    res.json({ message: "Daftar kesehatan berhasil diambil", data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFishHealthById = async (req, res) => {
  try {
    const { id } = req.params;
    const health = await FishHealth.findByPk(id, {
      include: [{ model: FishGrowth, as: "growth" }],
    });

    if (!health) {
      return res.status(404).json({ message: "Data kesehatan tidak ditemukan" });
    }

    res.json({ message: "Detail kesehatan berhasil diambil", data: health });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateFishHealth = async (req, res) => {
  try {
    const { id } = req.params;
    const { tanggalPemerikasaan, kondisi, tindakan, deskripsi, fishGrowthId } =
      req.body;

    const health = await FishHealth.findByPk(id);
    if (!health) {
      return res.status(404).json({ message: "Data kesehatan tidak ditemukan" });
    }

    if (fishGrowthId) {
      const growth = await FishGrowth.findByPk(fishGrowthId);
      if (!growth) {
        return res.status(404).json({ message: "Data pertumbuhan tidak ditemukan" });
      }
      // ensure one-to-one uniqueness
      // Constraint check removed for One-to-Many relationship
      // const exists = await FishHealth.findOne({
      //   where: { fishGrowthId },
      // });
      // if (exists && exists.id !== health.id) {
      //   return res
      //     .status(400)
      //     .json({ message: "Data pertumbuhan ini sudah memiliki data kesehatan" });
      // }
      health.fishGrowthId = fishGrowthId;
    }

    if (tanggalPemerikasaan !== undefined)
      health.tanggalPemerikasaan = tanggalPemerikasaan;
    if (kondisi !== undefined) health.kondisi = kondisi;
    if (tindakan !== undefined) health.tindakan = tindakan;
    if (deskripsi !== undefined) health.deskripsi = deskripsi;

    await health.save();

    res.json({ message: "Data kesehatan berhasil diperbarui", data: health });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteFishHealth = async (req, res) => {
  try {
    const { id } = req.params;
    const health = await FishHealth.findByPk(id);

    if (!health) {
      return res
        .status(404)
        .json({ message: "Data kesehatan tidak ditemukan" });
    }

    // ambil growth terkait
    const growth = await FishGrowth.findByPk(health.fishGrowthId);

    await health.destroy();

    // kosongkan relasi di fish growth
    if (growth) {
      await growth.update({ fishHealthId: null });
    }

    res.json({
      message:
        "Data kesehatan berhasil dihapus dan Fish Growth berhasil diperbarui",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


