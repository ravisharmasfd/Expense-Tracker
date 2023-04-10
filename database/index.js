const Sequelize = require('sequelize');
const mysql2 = require('mysql2');
const { dbName, dbUser, dbPass, dbHost } = require('../config/env');
// Configure database connection
const sequelize = new Sequelize('expense-tracker', 'root', 'Safidon@2323', {
    host: "localhost",
    dialect: 'mysql',
    dialectModule: mysql2,
  });
module.exports  = sequelize;