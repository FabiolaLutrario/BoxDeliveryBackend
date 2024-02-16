import S from "sequelize";
import db from "../config/db";
import bcrypt from "bcrypt";

class User extends S.Model {
  email!: string;
  name!: string;
  last_name!: string;
  password!: string;
  salt?: string;
  token?: string;
  profile_photo?: string;
  isAdmin!: boolean;
  isConfirmed!: boolean;

  hash(password: string, salt: string) {
    return bcrypt.hash(password, salt);
  }

  async validatePassword(password: string) {
    if (this.salt && this.password) {
      const hash = await this.hash(password, this.salt);
      return hash === this.password;
    }
    return;
  }
}

User.init(
  {
    email: {
      type: S.STRING,
      primaryKey: true,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
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
      defaultValue: false,
    },
    isConfirmed: {
      type: S.BOOLEAN,
      defaultValue: false,
    },
  },
  { sequelize: db, modelName: "user", tableName: "user" }
);

User.beforeCreate(async (user) => {
  try {
    const salt = await bcrypt.genSalt(10);
    user.salt = salt;
    const hash = await user.hash(user.password, salt);
    user.password = hash;
  } catch (error) {
    throw new Error("Hashing error");
  }
});

export default User;
