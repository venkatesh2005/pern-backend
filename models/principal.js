const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Principal = sequelize.define('Principal', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Principal;
