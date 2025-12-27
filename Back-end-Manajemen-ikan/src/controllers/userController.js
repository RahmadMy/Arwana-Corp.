import User from "../models/User.js";
import { makeSlug } from "../utils/slugify.js";
import { hashPass } from "../utils/hashPassword.js";
import bcrypt from "bcryptjs";

/* =====================================================
   CREATE USER (ADMIN / STAFF)
===================================================== */
export const createUser = async (req, res) => {
  try {
    let { name, email, password, role } = req.body;

    // ===== VALIDATION =====
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    // Default role is 'petugas' (staff) if not provided
    if (!role) {
      role = "petugas";
    }

    // Only allow roles used in the app
    const allowedRoles = ["admin", "petugas"];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Role is not valid",
      });
    }

    // ===== CHECK EMAIL =====
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email is already registered",
      });
    }

    // ===== CREATE USER =====
    const slug = makeSlug(name);
    const hashedPassword = await hashPass(password);

    const newUser = await User.create({
      name,
      slug,
      email,
      password: hashedPassword,
      role,
    });

    // ===== RESPONSE =====
    res.status(201).json({
      success: true,
      message: "User has been created successfully",
      data: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        slug: newUser.slug,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "An error occurred while creating user",
    });
  }
};

/* =====================================================
   GET ALL USERS
===================================================== */
export const getUsers = async (_req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "name", "email", "role", "slug"],
    });

    res.json({
      success: true,
      message: "User list fetched successfully",
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =====================================================
   GET USER BY ID
===================================================== */
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      attributes: ["id", "name", "email", "role", "slug"],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =====================================================
   UPDATE USER
===================================================== */
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, role } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ===== UPDATE DATA =====
    if (name) {
      user.name = name;
      user.slug = makeSlug(name);
    }

    if (email) {
      user.email = email;
    }

    if (role) {
      const allowedRoles = ["admin", "petugas"];
      if (!allowedRoles.includes(role)) {
        return res.status(400).json({
          success: false,
          message: "Role is not valid",
        });
      }
      user.role = role;
    }

    if (password) {
      user.password = await hashPass(password);
    }

    await user.save();

    res.json({
      success: true,
      message: "User has been updated successfully",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        slug: user.slug,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =====================================================
   DELETE USER
===================================================== */
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // OPTIONAL: prevent deleting admin
    if (user.role === "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin cannot be deleted",
      });
    }

    await user.destroy();

    res.json({
      success: true,
      message: "User has been deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =====================================================
   LOGIN
===================================================== */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email and password are required",
      });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password",
      });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        slug: user.slug,
      },
      token: String(user.id),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
