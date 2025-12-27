import { DataTypes } from "sequelize";
import db from "../config/database.js";

const User = db.define("users", {
    name: DataTypes.STRING,
    slug: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING,
    },
    {
    timestamps: false, // ⬅ wajib agar tidak buat createdAt/updatedAt
    }
);

export default User;
