import News from "../models/News.js";
import User from "../models/User.js";
import { makeSlug } from "../utils/slugify.js";

export const createNews = async (req, res) => {
  try {
    const { title, image, description } = req.body;

    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "title dan description wajib diisi" });
    }

    const news = await News.create({
      title,
      slug: makeSlug(title),
      image,
      description,
      userId: req.user.id, // dari middleware auth
    });

    res.status(201).json({
      message: "Berita berhasil dibuat",
      data: news,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllNews = async (req, res) => {
  try {
    const { userId } = req.query;

    const where = {};
    if (userId) {
      where.userId = userId;
    }

    const news = await News.findAll({
      where,
      include: [{ model: User, as: "author" }],
    });
    res.json({
      message: "Daftar berita berhasil diambil",
      data: news,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getNewsById = async (req, res) => {
  try {
    const { id } = req.params;
    const news = await News.findByPk(id, { include: [{ model: User, as: "author" }] });

    if (!news) {
      return res.status(404).json({ message: "Berita tidak ditemukan" });
    }

    res.json({
      message: "Detail berita berhasil diambil",
      data: news,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateNews = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, image, description } = req.body;

    const news = await News.findByPk(id);
    if (!news) {
      return res.status(404).json({ message: "Berita tidak ditemukan" });
    }

    if (title) {
      news.title = title;
      news.slug = makeSlug(title);
    }
    if (image !== undefined) news.image = image;
    if (description !== undefined) news.description = description;

    await news.save();

    res.json({
      message: "Berita berhasil diperbarui",
      data: news,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteNews = async (req, res) => {
  try {
    const { id } = req.params;
    const news = await News.findByPk(id);

    if (!news) {
      return res.status(404).json({ message: "Berita tidak ditemukan" });
    }

    await news.destroy();

    res.json({ message: "Berita berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

