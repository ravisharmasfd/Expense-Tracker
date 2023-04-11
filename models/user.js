const Sequelize = require('sequelize');
const sequelize = require('../database/index.js')

// Define user model
const User = sequelize.define('User', {
  email: Sequelize.STRING,
  password: Sequelize.STRING,
  name : Sequelize.STRING,
  premium :{
    type: Sequelize.BOOLEAN,
    defaultValue: false,

  },
  type: Sequelize.VIRTUAL,
  get() {
    return this.Expenses.reduce((total, expense) => total + expense.amount, 0);
  },
  set(value) {
    throw new Error('Do not try to set the `totalExpense` value!');
  }
});

module.exports = User;