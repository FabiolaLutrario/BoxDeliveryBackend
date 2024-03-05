import S from "sequelize";
import db from "../config/db.config";
import User from "./User.models";

class Package extends S.Model {
  id!: string;
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
      type: S.STRING,
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
      references: {
        model: User,
        key: "id",
      },
    },
  },
  { sequelize: db, modelName: "package", tableName: "package" }
);

// Función para generar un ID único con el prefijo "#" y un número aleatorio
const generateUniqueID = (): string => {
  let uniqueCode = "#";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const charactersLength = characters.length;
  const randomNumber = Math.floor(Math.random() * 1000);
  uniqueCode +=
    characters.charAt(Math.floor(Math.random() * charactersLength)) +
    randomNumber;
  // Elimina espacios en blanco al final del ID generado
  return uniqueCode.trim();
};

Package.beforeCreate((packages) => {
  // Genera un ID único y sin espacios en blanco al final
  packages.id = generateUniqueID();
});

export default Package;
