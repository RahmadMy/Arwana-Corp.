import { DataTypes } from "sequelize";
import db from "../config/database.js";
import Aquarium from "./Aquarium.js";
import FishSpecies from "./FishSpecies.js";

const FishGrowth = db.define("fish_growths", {
  slug: DataTypes.STRING,
  jumlah: DataTypes.INTEGER,
  umur: DataTypes.INTEGER,
  ukuran: DataTypes.STRING,
  catatan: DataTypes.TEXT,
  // match enum('male', 'female') in DB
  gender: DataTypes.ENUM("male", "female"),
  // optional grading & purpose fields from current table
  grade: DataTypes.ENUM("A", "B", "C", "PREMIUM", "EXPORT"),
  purpose: DataTypes.ENUM("JUAL", "BREEDING", "KONTES", "DISPLAY", "EXPORT"),
  aquariumId: {
    type: DataTypes.INTEGER,
    references: {
      model: Aquarium,
      key: "id",
    },
    unique: true, // one-to-one
  },
  speciesId: {
    type: DataTypes.INTEGER,
    references: {
      model: FishSpecies,
      key: "id",
    },
  },
  // one-to-one links stored directly on this table (no Sequelize association to avoid circular imports)
  fishHealthId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  harvestId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  feedingScheduleId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});

FishGrowth.belongsTo(Aquarium, { foreignKey: "aquariumId", as: "aquarium" });
Aquarium.hasOne(FishGrowth, { foreignKey: "aquariumId", as: "growth" });

FishGrowth.belongsTo(FishSpecies, { foreignKey: "speciesId", as: "species" });
FishSpecies.hasMany(FishGrowth, { foreignKey: "speciesId", as: "growths" });

export default FishGrowth;

