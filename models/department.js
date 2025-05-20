const { DataTypes } = require('sequelize');
const sequelize     = require('../config/db');
const Section       = require('./section');

const Department = sequelize.define('Department', {
  name: {
    type      : DataTypes.STRING,
    allowNull : false,
    unique    : true,
  },
});

// ➕ relations
Department.hasMany(Section, { onDelete: 'CASCADE' });
Section.belongsTo(Department);

module.exports = Department;
