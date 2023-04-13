const Sequelize = require("sequelize");
const sequelize = require("../database/index.js");

// Define Expense model

const Order = sequelize.define("Order", {
  orderId: Sequelize.STRING,
  paymentId: Sequelize.STRING,
  status: Sequelize.STRING,
});

module.exports = Order;
