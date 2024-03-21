import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const db = new Sequelize(
  process.env.POSTGRES_DB_NAME ?? "appbox",
  process.env.POSTGRES_DB_USER ?? "postgres",
  process.env.POSTGRES_DB_PASSWORD ?? "appbox",
  {
    host: "postgres-db",
    //port: process.env.POSTGRES_DB_DOCKER_PORT,
    dialect: "postgres",
    logging: false,
  }
);

/* const db = new Sequelize(
  "postgresql://uyw3zp4yythtmky2itkk:UzUqOZsvKFxjBKeRTgCn9x5JEYVC8v@bjuqfle74brsz7bhh74l-postgresql.services.clever-cloud.com:50013/bjuqfle74brsz7bhh74l",
  {
    dialect: "postgres",
    logging: false,
  }
); */

db.authenticate()
  .then(() => {
    console.log(`Successfully conected to database ${`appbox`}`); // eslint-disable-line
  })
  .catch((err: Error) => {
    console.error("No se pudo conectar a la base de datos", err); // eslint-disable-line
  });

export default db;
