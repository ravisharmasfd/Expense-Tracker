const Sequelize = require("sequelize");
const sequelize = require("../database/index.js");

// Define Expense model

const Expense = sequelize.define("Expense", {
  description: Sequelize.STRING,
  category: Sequelize.STRING,
  amount: Sequelize.FLOAT,
});

module.exports = Expense;
