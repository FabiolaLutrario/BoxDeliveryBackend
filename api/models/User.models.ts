import S from "sequelize";
import db from "../config/db";

class User extends S.Model {}

User.init(
  {
    email: {
      type: S.STRING,
      primaryKey: true,
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
    isAdmin: {
      type: S.BOOLEAN,
      allowNull: false,
    },
    isConfirmed: {
      type: S.BOOLEAN,
      defaultValue: false,
    },
  },
  { sequelize: db, modelName: "user", tableName: "user" }
);

export default User;
