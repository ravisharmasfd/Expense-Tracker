const Sequelize = require('sequelize');
const sequelize = require('../database/index.js')

// Define user model
const User = sequelize.define('User', {
  email: Sequelize.STRING,
  password: Sequelize.STRING,
});

module.exports = User;