const Sequelize = require("sequelize");

const db = new Sequelize("appbox", "postgres", "appbox", {
  host: "postgres-db",
  dialect: "postgres",
  logging: false,
});

module.exports = db;
