const S = require("sequelize");
const db = require("../models/db");

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
  },
  { sequelize: db, modelName: "package" }
);

module.exports = Package;
