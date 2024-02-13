const S = require("sequelize");
const db = require("../models/db");
const City = require("./City.models");
const State = require("./State.models");

class Package extends S.Model {}

Package.init(
  {
    receiver_name: {
      type: S.STRING,
      allowNull: false,
    },
    date: {
      type: S.DATE,
      allowNull: false,
    },
    weight: {
      type: S.STRING,
      allowNull: false,
    },
    adress: {
      type: S.STRING,
      allowNull: false,
    },
    city_id: {
      type: S.INTEGER,
      allowNull: false,
      references: {
        model: City,
        key: "id",
      },
    },
    state_id: {
      type: S.STRING,
      allowNull: false,
      references: {
        model: State,
        key: "id",
      },
    },
  },
  { sequelize: db, modelName: "package" }
);

//Esto despues va en index.models
Package.belongsTo(City, { foreignKey: "city_id" });

module.exports = Package;
