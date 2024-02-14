import S from "sequelize";
import db from "../config/db";

class Values extends S.Model {}

Values.init(
  {
    id: {
      type: S.INTEGER,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
  },
  { sequelize: db, modelName: "values" }
);

export default Values;
