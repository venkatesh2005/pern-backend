const { DataTypes } = require('sequelize');
const sequelize     = require('../config/db');

const Section = sequelize.define('Section', {
  name: {
    type      : DataTypes.STRING,
    allowNull : false,
  },
});

module.exports = Section;
