import { DataTypes } from "sequelize";
import db from "../config/database.js";
import FishGrowth from "./FishGrowth.js";

const FishHealth = db.define("fish_healths", {
  tanggalPemerikasaan: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  kondisi: DataTypes.STRING,
  tindakan: DataTypes.TEXT,
  deskripsi: DataTypes.TEXT,
  fishGrowthId: {
    type: DataTypes.INTEGER,
    references: {
      model: FishGrowth,
      key: "id",
    },
    unique: true, // one-to-one
  },
});

FishHealth.belongsTo(FishGrowth, { foreignKey: "fishGrowthId", as: "growth" });
FishGrowth.hasOne(FishHealth, { foreignKey: "fishGrowthId", as: "health" });

export default FishHealth;

