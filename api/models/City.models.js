const S = require("sequelize");
const db = require("../models/db");

class City extends S.Model {}

City.init(
  {
    id: {
      type: S.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    city_name: {
      type: S.STRING,
      allowNull: false,
      unique: true,
    },
  },
  { sequelize: db, modelName: "city" }
);

module.exports = City;
