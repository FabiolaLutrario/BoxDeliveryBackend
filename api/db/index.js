const Sequelize = require("sequelize");

// const db = new Sequelize("appbox", "postgres", "appbox", {
const db = new Sequelize("appbox", null, null, {
  host: "localhost",
  dialect: "postgres",
  logging: false,
});

module.exports = db;
