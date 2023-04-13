const Sequelize = require('sequelize');
const sequelize = require('../database/index.js')

const File = sequelize.define('File', {
    url: {
      type: Sequelize.STRING,
      allowNull: false
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
        },
  });
  
  module.exports = File;