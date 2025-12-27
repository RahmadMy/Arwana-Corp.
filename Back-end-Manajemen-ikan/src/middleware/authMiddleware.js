import User from "../models/User.js";

// Middleware untuk autentikasi berbasis header Authorization: Bearer <userId>
export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Tidak ada token, akses ditolak" });
    }

    const token = authHeader.split(" ")[1];

    // Di sini token kita anggap berisi userId (sederhana, tanpa JWT)
    const user = await User.findByPk(token);

    if (!user) {
      return res.status(401).json({ message: "User tidak valid" });
    }

    req.user = {
      id: user.id,
      role: user.role,
      name: user.name,
      email: user.email,
    };

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({ message: "Terjadi kesalahan autentikasi" });
  }
};

// Middleware untuk membatasi hanya admin
export const adminOnly = (req, _res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return _res.status(403).json({ message: "Hanya admin yang dapat mengakses resource ini" });
  }
  next();
};


