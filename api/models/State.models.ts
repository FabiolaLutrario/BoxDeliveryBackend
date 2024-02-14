import S from "sequelize";
import db from "../config/db";

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
  { sequelize: db, modelName: "state", tableName: "state" }
);

export default State;
