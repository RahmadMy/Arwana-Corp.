import { DataTypes } from "sequelize";
import db from "../config/database.js";
import FishGrowth from "./FishGrowth.js";

const Harvest = db.define("harvests", {
  tanggalPanen: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  jumlah: DataTypes.INTEGER,
  ukuranRata: DataTypes.STRING,
  tujuan: DataTypes.STRING,
  fishGrowthId: {
    type: DataTypes.INTEGER,
    references: {
      model: FishGrowth,
      key: "id",
    },
    unique: true, // one-to-one
  },
});

Harvest.belongsTo(FishGrowth, { foreignKey: "fishGrowthId", as: "growth" });
FishGrowth.hasOne(Harvest, { foreignKey: "fishGrowthId", as: "harvest" });

export default Harvest;

