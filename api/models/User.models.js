const S = require("sequelize");
const db = require("./db");
// const Values = require("./Values.models");

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
    // confirmation_id: {
    //   type: S.BOOLEAN,
    //   allowNull: false,
    //   defaultValue: false,
    //   references: {
    //     model: Values,
    //     key: "id",
    //   },
    // },
    // user_type_id: {
    //   type: S.BOOLEAN, //en el SD dice STRING pero tira error si lo dejamos en string
    //   allowNull: false,
    //   references: {
    //     model: Values,
    //     key: "id",
    //   },
    // },
  },
  { sequelize: db, modelName: "users" }
);

module.exports = User;
