const S = require("sequelize");
const db = require("../models/db");
const Package = require("./Package.models");

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

City.hasMany(Package, { foreignKey: "city_id" });

module.exports = City;