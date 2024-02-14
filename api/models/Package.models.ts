import S from "sequelize";
import db from "../config/db";
import City from "./City.models";
import State from "./State.models";
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
    email_id: {
      type: S.STRING,
      allowNull: false,
      references: {
        model: User,
        key: "email",
      },
    },
  },
  { sequelize: db, modelName: "package" }
);

export default Package;
