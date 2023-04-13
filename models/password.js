const Sequelize = require("sequelize");
const sequelize = require("../database/index.js");

// Define user model
const PasswordReset = sequelize.define("PasswordReset", {
  email: Sequelize.STRING,
  token: Sequelize.STRING,
  expire: Sequelize.DATE,
});

module.exports = PasswordReset;
