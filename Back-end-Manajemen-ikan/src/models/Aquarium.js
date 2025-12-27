import { DataTypes } from "sequelize";
import db from "../config/database.js";
import User from "./User.js";

const Aquarium = db.define("aquariums", {
  namaAquarium: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lokasi: DataTypes.STRING,
  kapasitas: DataTypes.INTEGER,
  ukuran: DataTypes.STRING,
  catatan: DataTypes.TEXT,

  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: "id",
    },
  },

  fishGrowthId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: "Label / penanda Fish Growth yang ada di aquarium",
  },
});

// Relasi many-to-one: satu user memiliki banyak aquarium
Aquarium.belongsTo(User, { foreignKey: "userId", as: "owner" });

export default Aquarium;
