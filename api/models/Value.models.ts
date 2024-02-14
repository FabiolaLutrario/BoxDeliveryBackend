import S from "sequelize";
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
  },
  { sequelize: db, modelName: "value", tableName: "value" }
);

export default Value;
