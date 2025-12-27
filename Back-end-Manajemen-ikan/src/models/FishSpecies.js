import { DataTypes } from "sequelize";
import db from "../config/database.js";

const FishSpecies = db.define("fish_species", {
  namaVarietas: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  namaSaint: DataTypes.STRING,
  asal: DataTypes.STRING,
  deskripsi: DataTypes.TEXT,
  slug: DataTypes.STRING,
});

export default FishSpecies;

