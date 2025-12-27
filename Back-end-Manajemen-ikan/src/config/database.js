import { Sequelize } from "sequelize";

const sequelize = new Sequelize("ikans", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

export default sequelize;
