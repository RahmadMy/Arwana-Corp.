import { DataTypes } from "sequelize";
import db from "../config/database.js";
import FishGrowth from "./FishGrowth.js";
import Feed from "./Feed.js";

const FeedingSchedule = db.define("feeding_schedules", {
  waktuPemberian: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  jumlahPakan: DataTypes.STRING,
  fishGrowthId: {
    type: DataTypes.INTEGER,
    references: {
      model: FishGrowth,
      key: "id",
    },
    // unique: true // one-to-one
  },
  feedId: {
    type: DataTypes.INTEGER,
    references: {
      model: Feed,
      key: "id",
    },
  },
});

FeedingSchedule.belongsTo(FishGrowth, {
  foreignKey: "fishGrowthId",
  as: "growth",
});
FishGrowth.hasMany(FeedingSchedule, {
  foreignKey: "fishGrowthId",
  as: "feedingSchedule",
});

FeedingSchedule.belongsTo(Feed, { foreignKey: "feedId", as: "feed" });
Feed.hasMany(FeedingSchedule, { foreignKey: "feedId", as: "schedules" });

export default FeedingSchedule;

