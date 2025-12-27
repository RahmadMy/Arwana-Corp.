import { DataTypes } from "sequelize";
import db from "../config/database.js";

const Feed = db.define("feeds", {
  nama: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  slug: DataTypes.STRING,
  deskripsi: DataTypes.TEXT,
  stock: DataTypes.INTEGER,
});

export default Feed;

