const S = require("sequelize");
const db = require("../models/db");

class Values extends S.Model {}

Values.init(
  {
    id: {
      type: S.BOOLEAN,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
  },
  { sequelize: db, modelName: "values" }
);

module.exports = Values;
