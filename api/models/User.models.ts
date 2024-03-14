import S from "sequelize";
import db from "../config/db.config";
import bcrypt from "bcryptjs";

class User extends S.Model {
  id?: number;
  email!: string;
  name!: string;
  last_name!: string;
  password!: string;
  salt?: string;
  token?: string | null;
  profile_photo?: string;
  is_admin?: boolean;
  is_confirmed?: boolean;
  is_enabled?: boolean;

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
    id: {
      type: S.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: S.STRING,
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
      type: S.STRING(1024),
    },
    profile_photo: {
      type: S.STRING,
    },
    is_admin: {
      type: S.BOOLEAN,
      defaultValue: false,
    },
    is_confirmed: {
      type: S.BOOLEAN,
      defaultValue: false,
    },
    is_enabled: {
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
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
  } catch (error) {
    throw new Error("Hashing error");
  }
});

const hashPasswordHook = async (user: User) => {
  try {
    // Verificar si el usuario ya existe en la base de datos
    const existingUser = await User.findByPk(user.id);
    if (existingUser) {
      // Si el usuario existe, aplicar el hash a la contraseña
      const salt = await bcrypt.genSalt(10);
      user.salt = salt;
      const hash = await bcrypt.hash(user.password, salt);
      user.password = hash;
    }
  } catch (error) {
    throw new Error("Hashing error");
  }
};

User.addHook("beforeSave", "hashPasswordBeforeSave", hashPasswordHook);

export default User;
