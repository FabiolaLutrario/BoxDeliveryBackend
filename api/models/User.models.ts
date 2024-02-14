import S, { INTEGER } from "sequelize";
import db from "../config/db";
import Value from "./Value.models";

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
    confirmation_id: {
      type: INTEGER,
      allowNull: false,
      references: {
        model: Value,
        key: "id",
      },
    },
    user_type_id: {
      type: INTEGER,
      allowNull: false,
      references: {
        model: Value,
        key: "id",
      },
    },
  },
  { sequelize: db, modelName: "user", tableName: "user" }
);

export default User;
