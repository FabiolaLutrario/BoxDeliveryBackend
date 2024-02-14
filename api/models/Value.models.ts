import S, { BOOLEAN } from "sequelize";
import db from "../config/db";

class Value extends S.Model {}

Value.init(
  {
    id: {
      type: S.INTEGER,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    value: {
      type: BOOLEAN,
      allowNull: false,
    },
  },
  { sequelize: db, modelName: "value", tableName: "value" }
);

export default Value;
