import S from "sequelize";
import db from "../config/db.config";
import User from "./User.models";

class Package extends S.Model {
  id: string | undefined;
  receiver_name!: string;
  date!: Date;
  weight!: number;
  address!: string;
  status!: "in-progress" | "delivered" | "pending";
  user_id!: number;
}

Package.init(
  {
    id: {
      type: S.CHAR,
      primaryKey: true,
    },
    receiver_name: {
      type: S.STRING,
      allowNull: false,
    },
    date: {
      type: S.DATEONLY,
      allowNull: false,
    },
    weight: {
      type: S.FLOAT,
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
    user_id: {
      type: S.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
  },
  { sequelize: db, modelName: "package", tableName: "package" }
);

Package.beforeCreate((packages) => {
  let uniqueCode = "#";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const charactersLength = characters.length;
  const randomNumber = Math.floor(Math.random() * 1000) + "";
  uniqueCode +=
    characters.charAt(Math.floor(Math.random() * charactersLength)) +
    randomNumber;
  packages.id = uniqueCode;
});

export default Package;
