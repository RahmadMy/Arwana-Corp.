import Feed from "../models/Feed.js";
import { makeSlug } from "../utils/slugify.js";

export const createFeed = async (req, res) => {
  try {
    const { nama, deskripsi, stock } = req.body;
    if (!nama) {
      return res.status(400).json({ message: "nama wajib diisi" });
    }

    const feed = await Feed.create({
      nama,
      slug: makeSlug(nama),
      deskripsi,
      stock,
    });

    res.status(201).json({ message: "Pakan berhasil dibuat", data: feed });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllFeeds = async (_req, res) => {
  try {
    const data = await Feed.findAll();
    res.json({ message: "Daftar pakan berhasil diambil", data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFeedById = async (req, res) => {
  try {
    const { id } = req.params;
    const feed = await Feed.findByPk(id);
    if (!feed) {
      return res.status(404).json({ message: "Pakan tidak ditemukan" });
    }
    res.json({ message: "Detail pakan berhasil diambil", data: feed });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateFeed = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama, deskripsi, stock } = req.body;

    const feed = await Feed.findByPk(id);
    if (!feed) {
      return res.status(404).json({ message: "Pakan tidak ditemukan" });
    }

    if (nama !== undefined) {
      feed.nama = nama;
      feed.slug = makeSlug(nama);
    }
    if (deskripsi !== undefined) feed.deskripsi = deskripsi;
    if (stock !== undefined) feed.stock = stock;

    await feed.save();
    res.json({ message: "Pakan berhasil diperbarui", data: feed });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteFeed = async (req, res) => {
  try {
    const { id } = req.params;
    const feed = await Feed.findByPk(id);
    if (!feed) {
      return res.status(404).json({ message: "Pakan tidak ditemukan" });
    }
    await feed.destroy();
    res.json({ message: "Pakan berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

