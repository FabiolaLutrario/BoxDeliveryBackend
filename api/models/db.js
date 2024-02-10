const Sequelize = require("sequelize");

const db = new Sequelize(
  process.env.POSTGRES_DB_NAME,
  process.env.POSTGRES_DB_USER,
  process.env.POSTGRES_DB_PASSWORD,
  {
    host: "postgres-db",
    port: process.env.POSTGRES_DB_DOCKER_PORT,
    dialect: "postgres",
    logging: false,
  }
);

module.exports = db;
