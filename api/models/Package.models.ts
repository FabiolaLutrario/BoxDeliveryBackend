import S from "sequelize";
import db from "../config/db.config";
import User from "./User.models";

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
    address: {
      type: S.STRING,
      allowNull: false,
    },
    status: {
      type: S.ENUM(`in-progress`, `delivered`, `pending`),
      allowNull: false,
    },
    email_id: {
      type: S.STRING,
      allowNull: false,
      references: {
        model: User,
        key: "email",
      },
    },
  },
  { sequelize: db, modelName: "package", tableName: "package" }
);

export default Package;
