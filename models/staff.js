const { DataTypes } = require('sequelize');
const sequelize     = require('../config/db');

const Staff = sequelize.define('Staff', {
  /* identity */
  name       : { type: DataTypes.STRING,  allowNull: false },
  department : { type: DataTypes.STRING,  allowNull: false },
  section:    { type: DataTypes.STRING }, // optional

  /* login */
  email    : { type: DataTypes.STRING, allowNull: false, unique: true },
  password : { type: DataTypes.STRING, allowNull: false },

  /* status */
  verified : { type: DataTypes.BOOLEAN, defaultValue: false }   // ⬅️ HOD must flip to true
});

module.exports = Staff;
