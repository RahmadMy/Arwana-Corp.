import FishGrowth from "../models/FishGrowth.js";
import Aquarium from "../models/Aquarium.js";
import FishSpecies from "../models/FishSpecies.js";
import { makeSlug } from "../utils/slugify.js";

/* ================= CREATE ================= */
export const createFishGrowth = async (req, res) => {
  try {
    const {
      namaVarietas,
      jumlah,
      umur,
      ukuran,
      catatan,
      gender,
      grade,
      purpose,
      aquariumId,
      speciesId,
    } = req.body;

    if (!aquariumId || !speciesId) {
      return res
        .status(400)
        .json({ message: "aquariumId dan speciesId wajib diisi" });
    }

    const aquarium = await Aquarium.findByPk(aquariumId);
    if (!aquarium) {
      return res.status(404).json({ message: "Aquarium tidak ditemukan" });
    }

    // ⛔ cegah double fish growth
    const existing = await FishGrowth.findOne({ where: { aquariumId } });
    if (existing) {
      return res
        .status(400)
        .json({ message: "Aquarium ini sudah memiliki data pertumbuhan" });
    }

    const species = await FishSpecies.findByPk(speciesId);
    if (!species) {
      return res.status(404).json({ message: "Jenis ikan tidak ditemukan" });
    }

    const growth = await FishGrowth.create({
      slug: makeSlug(species.namaVarietas || namaVarietas || ""),
      jumlah,
      umur,
      ukuran,
      catatan,
      gender,
      grade,
      purpose,
      aquariumId,
      speciesId,
    });

    // 🔥 SINKRON KE AQUARIUM (WAJIB pakai update)
    await Aquarium.update(
      { fishGrowthId: growth.id },
      { where: { id: aquariumId } }
    );

    res.status(201).json({
      message: "Data pertumbuhan berhasil dibuat",
      data: growth,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= GET ALL ================= */
export const getAllFishGrowth = async (_req, res) => {
  try {
    const data = await FishGrowth.findAll({
      include: [
        { model: Aquarium, as: "aquarium" },
        { model: FishSpecies, as: "species" },
      ],
    });
    res.json({ message: "Daftar pertumbuhan berhasil diambil", data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= GET BY ID ================= */
export const getFishGrowthById = async (req, res) => {
  try {
    const { id } = req.params;
    const growth = await FishGrowth.findByPk(id, {
      include: [
        { model: Aquarium, as: "aquarium" },
        { model: FishSpecies, as: "species" },
      ],
    });

    if (!growth) {
      return res.status(404).json({ message: "Data pertumbuhan tidak ditemukan" });
    }

    res.json({ message: "Detail pertumbuhan berhasil diambil", data: growth });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= UPDATE ================= */
export const updateFishGrowth = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      namaVarietas,
      jumlah,
      umur,
      ukuran,
      catatan,
      gender,
      grade,
      purpose,
      aquariumId,
      speciesId,
    } = req.body;

    const growth = await FishGrowth.findByPk(id);
    if (!growth) {
      return res.status(404).json({ message: "Data pertumbuhan tidak ditemukan" });
    }

    /* 🔄 PINDAH AQUARIUM */
    if (aquariumId && aquariumId !== growth.aquariumId) {
      const newAquarium = await Aquarium.findByPk(aquariumId);
      if (!newAquarium) {
        return res.status(404).json({ message: "Aquarium tidak ditemukan" });
      }

      const exists = await FishGrowth.findOne({ where: { aquariumId } });
      if (exists) {
        return res
          .status(400)
          .json({ message: "Aquarium ini sudah memiliki data pertumbuhan" });
      }

      // kosongkan aquarium lama
      await Aquarium.update(
        { fishGrowthId: null },
        { where: { id: growth.aquariumId } }
      );

      // set aquarium baru
      await Aquarium.update(
        { fishGrowthId: growth.id },
        { where: { id: aquariumId } }
      );

      growth.aquariumId = aquariumId;
    }

    if (speciesId) {
      const species = await FishSpecies.findByPk(speciesId);
      if (!species) {
        return res.status(404).json({ message: "Jenis ikan tidak ditemukan" });
      }
      growth.speciesId = speciesId;
      growth.slug = makeSlug(species.namaVarietas || namaVarietas || "");
    } else if (namaVarietas !== undefined) {
      growth.slug = makeSlug(namaVarietas);
    }

    if (jumlah !== undefined) growth.jumlah = jumlah;
    if (umur !== undefined) growth.umur = umur;
    if (ukuran !== undefined) growth.ukuran = ukuran;
    if (catatan !== undefined) growth.catatan = catatan;
    if (gender !== undefined) growth.gender = gender;
    if (grade !== undefined) growth.grade = grade;
    if (purpose !== undefined) growth.purpose = purpose;

    await growth.save();

    res.json({
      message: "Data pertumbuhan berhasil diperbarui",
      data: growth,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= DELETE ================= */
export const deleteFishGrowth = async (req, res) => {
  try {
    const { id } = req.params;

    const growth = await FishGrowth.findByPk(id);
    if (!growth) {
      return res.status(404).json({ message: "Data pertumbuhan tidak ditemukan" });
    }

    // 🔥 KOSONGKAN LABEL DI AQUARIUM
    await Aquarium.update(
      { fishGrowthId: null },
      { where: { id: growth.aquariumId } }
    );

    await growth.destroy();

    res.json({ message: "Data pertumbuhan berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
