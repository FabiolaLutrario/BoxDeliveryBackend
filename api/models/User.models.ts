import S from "sequelize";
import db from "../config/db.config";

class User extends S.Model {
  email!: string;
  name!: string;
  last_name!: string;
  password!: string;
  salt?: string;
  token?: string | null;
  profile_photo?: string;
  is_admin!: boolean;
  is_confirmed!: boolean;

  static initModel(): void {
    this.init(
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
        is_admin: {
          type: S.BOOLEAN,
          allowNull: false,
        },
        is_confirmed: {
          type: S.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
      },
      { sequelize: db, modelName: "user", tableName: "user" }
    );
  }
}

User.initModel();

export default User;
