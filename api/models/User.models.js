const S = require("sequelize");
const db = require("./db");

class User extends S.Model {}

User.init(
  {
    email: {
      type: S.STRING,
      allowNull: false,
    },
    name: {
      type: S.STRING,
      allowNull: false,
    },
    last_name: {
      type: S.STRING,
      allowNull: false,
    },
    password: {
      type: S.STRING,
      allowNull: false,
    },
    salt: {
      type: S.STRING,
    },
    token: {
      type: S.STRING,
    },
    profile_photo: {
      type: S.STRING,
    },
  },
  { sequelize: db, modelName: "user" }
);

module.exports = User;
