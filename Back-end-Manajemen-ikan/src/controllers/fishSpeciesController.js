import FishSpecies from "../models/FishSpecies.js";
import FishGrowth from "../models/FishGrowth.js";
import Aquarium from "../models/Aquarium.js";
import { makeSlug } from "../utils/slugify.js";

export const createSpecies = async (req, res) => {
  try {
    const { namaVarietas, namaSaint, asal, deskripsi } = req.body;
    if (!namaVarietas) {
      return res.status(400).json({ message: "namaVarietas wajib diisi" });
    }

    const species = await FishSpecies.create({
      namaVarietas,
      namaSaint,
      asal,
      deskripsi,
      slug: makeSlug(namaVarietas),
    });

    res.status(201).json({ message: "Jenis ikan berhasil dibuat", data: species });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllSpecies = async (_req, res) => {
  try {
    const data = await FishSpecies.findAll();
    res.json({ message: "Daftar jenis ikan berhasil diambil", data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSpeciesById = async (req, res) => {
  try {
    const { id } = req.params;
    const species = await FishSpecies.findByPk(id);
    if (!species) {
      return res.status(404).json({ message: "Jenis ikan tidak ditemukan" });
    }
    res.json({ message: "Detail jenis ikan berhasil diambil", data: species });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSpecies = async (req, res) => {
  try {
    const { id } = req.params;
    const { namaVarietas, namaSaint, asal, deskripsi } = req.body;

    const species = await FishSpecies.findByPk(id);
    if (!species) {
      return res.status(404).json({ message: "Jenis ikan tidak ditemukan" });
    }

    if (namaVarietas !== undefined) {
      species.namaVarietas = namaVarietas;
      species.slug = makeSlug(namaVarietas);
    }
    if (namaSaint !== undefined) species.namaSaint = namaSaint;
    if (asal !== undefined) species.asal = asal;
    if (deskripsi !== undefined) species.deskripsi = deskripsi;

    await species.save();
    res.json({ message: "Jenis ikan berhasil diperbarui", data: species });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteSpecies = async (req, res) => {
  try {
    const { id } = req.params;
    const species = await FishSpecies.findByPk(id);
    if (!species) {
      return res.status(404).json({ message: "Jenis ikan tidak ditemukan" });
    }
    await species.destroy();
    res.json({ message: "Jenis ikan berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getGrowthsBySpecies = async (req, res) => {
  try {
    const { id } = req.params;
    const species = await FishSpecies.findByPk(id);
    if (!species) {
      return res.status(404).json({ message: "Jenis ikan tidak ditemukan" });
    }

    const growths = await FishGrowth.findAll({
      where: { speciesId: id },
      include: [
        { model: FishSpecies, as: "species" },
        { model: Aquarium, as: "aquarium" },
      ],
    });

    res.json({
      message: "Daftar pertumbuhan untuk spesies berhasil diambil",
      data: growths,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

