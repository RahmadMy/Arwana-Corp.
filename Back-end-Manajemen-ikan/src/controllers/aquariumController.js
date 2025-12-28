import Aquarium from "../models/Aquarium.js";
import User from "../models/User.js";
import FishGrowth from "../models/FishGrowth.js";

/* ================= CREATE ================= */
export const createAquarium = async (req, res) => {
  try {
    const { namaAquarium, lokasi, kapasitas, ukuran, catatan } = req.body;

    if (!namaAquarium) {
      return res.status(400).json({
        message: "namaAquarium wajib diisi",
      });
    }

    const aquarium = await Aquarium.create({
      namaAquarium,
      lokasi,
      kapasitas,
      ukuran,
      catatan,
      userId: req.user.id,
    });

    res.status(201).json({
      message: "Aquarium berhasil dibuat",
      data: aquarium,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= GET ALL ================= */
export const getAllAquariums = async (req, res) => {
  try {
    const { userId } = req.query;
    const where = {};
    if (userId) where.userId = userId;

    const aquariums = await Aquarium.findAll({
      where,
      include: [
        { model: User, as: "owner" },
        {
          model: FishGrowth,
          as: "growth",
          required: false, // 🔹 penting
        },
      ],
    });

    res.json({
      message: "Daftar aquarium berhasil diambil",
      data: aquariums,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= GET BY ID ================= */
export const getAquariumById = async (req, res) => {
  try {
    const { id } = req.params;

    const aquarium = await Aquarium.findByPk(id, {
      include: [
        { model: User, as: "owner" },
        { model: FishGrowth, as: "growth" }, // 🔥 TAMBAHAN
      ],
    });

    if (!aquarium) {
      return res.status(404).json({ message: "Aquarium tidak ditemukan" });
    }

    res.json({
      message: "Detail aquarium berhasil diambil",
      data: aquarium,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= UPDATE ================= */
export const updateAquarium = async (req, res) => {
  try {
    const { id } = req.params;
    const { namaAquarium, lokasi, kapasitas, ukuran, catatan, userId } =
      req.body;

    const aquarium = await Aquarium.findByPk(id);
    if (!aquarium) {
      return res.status(404).json({ message: "Aquarium tidak ditemukan" });
    }

    if (userId) {
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: "User tidak ditemukan" });
      }
      aquarium.userId = userId;
    }

    if (namaAquarium !== undefined) aquarium.namaAquarium = namaAquarium;
    if (lokasi !== undefined) aquarium.lokasi = lokasi;
    if (kapasitas !== undefined) aquarium.kapasitas = kapasitas;
    if (ukuran !== undefined) aquarium.ukuran = ukuran;
    if (catatan !== undefined) aquarium.catatan = catatan;

    await aquarium.save();

    res.json({
      message: "Aquarium berhasil diperbarui",
      data: aquarium,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= DELETE (AMAN) ================= */
export const deleteAquarium = async (req, res) => {
  try {
    const { id } = req.params;

    const aquarium = await Aquarium.findByPk(id, {
      include: [{ model: FishGrowth, as: "growth" }],
    });

    if (!aquarium) {
      return res.status(404).json({ message: "Aquarium tidak ditemukan" });
    }

    // ⛔ CEGAH HAPUS JIKA ADA IKAN
    if (aquarium.growth) {
      return res.status(400).json({
        message: "Aquarium tidak dapat dihapus karena masih memiliki ikan",
        fishGrowthId: aquarium.growth.id,
      });
    }

    await aquarium.destroy();

    res.json({ message: "Aquarium berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
