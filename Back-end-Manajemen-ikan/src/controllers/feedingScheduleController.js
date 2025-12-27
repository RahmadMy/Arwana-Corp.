import FeedingSchedule from "../models/FeedingSchedule.js";
import FishGrowth from "../models/FishGrowth.js";
import Feed from "../models/Feed.js";

export const createFeedingSchedule = async (req, res) => {
  try {
    const { waktuPemberian, jumlahPakan, fishGrowthId, feedId } = req.body;

    if (!waktuPemberian || !fishGrowthId || !feedId) {
      return res
        .status(400)
        .json({ message: "waktuPemberian, fishGrowthId, dan feedId wajib diisi" });
    }

    const growth = await FishGrowth.findByPk(fishGrowthId);
    if (!growth) {
      return res.status(404).json({ message: "Data pertumbuhan tidak ditemukan" });
    }

    const feed = await Feed.findByPk(feedId);
    if (!feed) {
      return res.status(404).json({ message: "Pakan tidak ditemukan" });
    }

    const existing = await FeedingSchedule.findOne({ where: { fishGrowthId } });
    if (existing) {
      return res
        .status(400)
        .json({ message: "Data pertumbuhan ini sudah memiliki jadwal pakan" });
    }

    const schedule = await FeedingSchedule.create({
      waktuPemberian,
      jumlahPakan,
      fishGrowthId,
      feedId,
    });
  
    await growth.update({
      feedingScheduleId: schedule.id,
    });
    
    res.status(201).json({
      message: "Jadwal pakan berhasil dibuat dan Fish Growth berhasil diperbarui",
      data: schedule,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllFeedingSchedules = async (_req, res) => {
  try {
    const data = await FeedingSchedule.findAll({
      include: [
        { model: FishGrowth, as: "growth" },
        { model: Feed, as: "feed" },
      ],
    });
    res.json({ message: "Daftar jadwal pakan berhasil diambil", data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFeedingScheduleById = async (req, res) => {
  try {
    const { id } = req.params;
    const schedule = await FeedingSchedule.findByPk(id, {
      include: [
        { model: FishGrowth, as: "growth" },
        { model: Feed, as: "feed" },
      ],
    });

    if (!schedule) {
      return res.status(404).json({ message: "Jadwal pakan tidak ditemukan" });
    }

    res.json({ message: "Detail jadwal pakan berhasil diambil", data: schedule });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateFeedingSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const { waktuPemberian, jumlahPakan, fishGrowthId, feedId } = req.body;

    const schedule = await FeedingSchedule.findByPk(id);
    if (!schedule) {
      return res.status(404).json({ message: "Jadwal pakan tidak ditemukan" });
    }

    if (fishGrowthId) {
      const growth = await FishGrowth.findByPk(fishGrowthId);
      if (!growth) {
        return res.status(404).json({ message: "Data pertumbuhan tidak ditemukan" });
      }
      const exists = await FeedingSchedule.findOne({ where: { fishGrowthId } });
      if (exists && exists.id !== schedule.id) {
        return res
          .status(400)
          .json({ message: "Data pertumbuhan ini sudah memiliki jadwal pakan" });
      }
      schedule.fishGrowthId = fishGrowthId;
    }

    if (feedId) {
      const feed = await Feed.findByPk(feedId);
      if (!feed) {
        return res.status(404).json({ message: "Pakan tidak ditemukan" });
      }
      schedule.feedId = feedId;
    }

    if (waktuPemberian !== undefined) schedule.waktuPemberian = waktuPemberian;
    if (jumlahPakan !== undefined) schedule.jumlahPakan = jumlahPakan;

    await schedule.save();

    res.json({ message: "Jadwal pakan berhasil diperbarui", data: schedule });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteFeedingSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const schedule = await FeedingSchedule.findByPk(id);

    if (!schedule) {
      return res.status(404).json({ message: "Jadwal pakan tidak ditemukan" });
    }
    // ambil growth terkait
    const growth = await FishGrowth.findByPk(schedule.fishGrowthId);

    await schedule.destroy();

    // kosongkan relasi di fish growth
    if (growth) {
      await growth.update({ feedingScheduleId: null });
    }
    res.json({ message: "Jadwal pakan berhasil dihapus dan Fish Growth berhasil diperbarui" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

