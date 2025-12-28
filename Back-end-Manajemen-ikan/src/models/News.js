import { DataTypes } from "sequelize";
import db from "../config/database.js";
import User from "./User.js";

const News = db.define("news", {
  title: DataTypes.STRING,
  slug: DataTypes.STRING,
  image: DataTypes.STRING,
  description: DataTypes.TEXT,
  status: {
    type: DataTypes.ENUM("draft", "publish"),
    defaultValue: "draft",
  },
  tanggal_publikasi: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: "id",
    },
  },
});

// Relasi many-to-one: banyak berita dimiliki satu user
News.belongsTo(User, { foreignKey: "userId", as: "author" });

export default News;

