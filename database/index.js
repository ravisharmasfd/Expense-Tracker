const Sequelize = require("sequelize");
const mysql2 = require("mysql2");
const { dbName, dbUser, dbPass, dbHost } = require("../config/env");
// Configure database connection
const sequelize = new Sequelize(dbName, dbUser, dbPass, {
  host: dbHost,
  dialect: "mysql",
  dialectModule: mysql2,
});
module.exports = sequelize;
