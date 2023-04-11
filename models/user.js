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

  } 
});

module.exports = User;