const S = require("sequelize");
const db = require("../models/db");

class State extends S.Model {}

State.init(
  {
    id: {
      type: S.STRING,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
  },
  { sequelize: db, modelName: "state" }
);

module.exports = State;
