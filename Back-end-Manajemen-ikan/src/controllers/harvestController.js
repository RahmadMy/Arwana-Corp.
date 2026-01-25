import Harvest from "../models/Harvest.js";
import FishGrowth from "../models/FishGrowth.js";

export const createHarvest = async (req, res) => {
  try {
    const { tanggalPanen, jumlah, ukuranRata, tujuan, fishGrowthId } = req.body;

    if (!tanggalPanen || !fishGrowthId) {
      return res
        .status(400)
        .json({ message: "tanggalPanen dan fishGrowthId wajib diisi" });
    }

    const growth = await FishGrowth.findByPk(fishGrowthId);
    if (!growth) {
      return res.status(404).json({ message: "Data pertumbuhan tidak ditemukan" });
    }

    // Constraint check removed for One-to-Many
    // const existing = await Harvest.findOne({ where: { fishGrowthId } });
    // if (existing) {
    //   return res
    //     .status(400)
    //     .json({ message: "Data pertumbuhan ini sudah memiliki data panen" });
    // }

    const harvest = await Harvest.create({
      tanggalPanen,
      jumlah,
      ukuranRata,
      tujuan,
      fishGrowthId,
    });

    // 2️⃣ UPDATE FISH GROWTH (Optional: keep track of latest harvest, or remove if not needed)
    if (growth.harvestId !== undefined) {
      await growth.update({
        harvestId: harvest.id,
      });
    }

    res.status(201).json({
      message: "Data panen berhasil dibuat dan Fish Growth berhasil diperbarui",
      data: harvest,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllHarvests = async (_req, res) => {
  try {
    const data = await Harvest.findAll({
      include: [{ model: FishGrowth, as: "growth" }],
    });
    res.json({ message: "Daftar panen berhasil diambil", data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getHarvestById = async (req, res) => {
  try {
    const { id } = req.params;
    const harvest = await Harvest.findByPk(id, {
      include: [{ model: FishGrowth, as: "growth" }],
    });

    if (!harvest) {
      return res.status(404).json({ message: "Data panen tidak ditemukan" });
    }

    res.json({ message: "Detail panen berhasil diambil", data: harvest });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateHarvest = async (req, res) => {
  try {
    const { id } = req.params;
    const { tanggalPanen, jumlah, ukuranRata, tujuan, fishGrowthId } = req.body;

    const harvest = await Harvest.findByPk(id);
    if (!harvest) {
      return res.status(404).json({ message: "Data panen tidak ditemukan" });
    }

    if (fishGrowthId) {
      const growth = await FishGrowth.findByPk(fishGrowthId);
      if (!growth) {
        return res.status(404).json({ message: "Data pertumbuhan tidak ditemukan" });
      }
      // Constraint check removed for One-to-Many
      // const exists = await Harvest.findOne({ where: { fishGrowthId } });
      // if (exists && exists.id !== harvest.id) {
      //   return res
      //     .status(400)
      //     .json({ message: "Data pertumbuhan ini sudah memiliki data panen" });
      // }
      harvest.fishGrowthId = fishGrowthId;
    }

    if (tanggalPanen !== undefined) harvest.tanggalPanen = tanggalPanen;
    if (jumlah !== undefined) harvest.jumlah = jumlah;
    if (ukuranRata !== undefined) harvest.ukuranRata = ukuranRata;
    if (tujuan !== undefined) harvest.tujuan = tujuan;

    await harvest.save();
    res.json({ message: "Data panen berhasil diperbarui", data: harvest });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteHarvest = async (req, res) => {
  try {
    const { id } = req.params;
    const harvest = await Harvest.findByPk(id);
    const growth = await FishGrowth.findByPk(harvest.fishGrowthId);

    if (!harvest) {
      return res.status(404).json({ message: "Data panen tidak ditemukan" });
    }
    if (growth) {
      await growth.update({ harvestId: null });
    }

    await harvest.destroy();
    res.json({ message: "Data panen berhasil dihapus dan Fish Growth berhasil diperbarui" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

