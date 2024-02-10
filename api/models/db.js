const Sequelize = require("sequelize");
require("dotenv").config();

const db = new Sequelize(
  process.env.POSTGRES_DB_NAME,
  process.env.POSTGRES_DB_USER,
  process.env.POSTGRES_DB_PASSWORD,
  {
    host: "localhost",
    port: process.env.POSTGRES_DB_DOCKER_PORT,
    dialect: "postgres",
    logging: false,
  }
);

db.authenticate()
  .then(() => {
    console.log(`Successfully conected to database ${`appbox`}`);
  })
  .catch((err) => {
    console.error("No se pudo conectar a la base de datos", err);
  });

module.exports = db;
