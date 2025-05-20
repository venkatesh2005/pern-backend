const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Student = sequelize.define("Student", {
  /* ---------- core ---------- */
  regNo:  { type: DataTypes.STRING, allowNull: false, unique: true },
  name:   { type: DataTypes.STRING, allowNull: false },
  gender: DataTypes.STRING,
  dob:    DataTypes.DATEONLY,
  department: DataTypes.STRING,
  year:   DataTypes.STRING,
  section:DataTypes.STRING,

  /* NEW */
  admissionType: DataTypes.STRING,         // Counselling / Management

  /* ---------- contact ---------- */
  mobile:       DataTypes.STRING,
  email:        { type: DataTypes.STRING, allowNull: false, unique: true },
  collegeEmail: DataTypes.STRING,

  /* ---------- schooling ---------- */
  tenthBoard:   DataTypes.STRING,
  tenthPercent: DataTypes.STRING,
  tenthYOP:     DataTypes.STRING,
  twelfthBoard:   DataTypes.STRING,
  twelfthPercent: DataTypes.STRING,
  twelfthYOP:     DataTypes.STRING,

  /* ---------- diploma ---------- */
  diplomaBranch:  DataTypes.STRING,
  diplomaPercent: DataTypes.STRING,
  diplomaYOP:     DataTypes.STRING,

  /* ---------- CGPA ---------- */
  cgpaSem1: DataTypes.STRING,
  cgpaSem2: DataTypes.STRING,
  cgpaSem3: DataTypes.STRING,
  cgpaSem4: DataTypes.STRING,
  cgpaSem5: DataTypes.STRING,
  cgpaSem6: DataTypes.STRING,
  cgpaSem7: DataTypes.STRING,
  cgpaSem8: DataTypes.STRING,
  cgpa:     DataTypes.STRING,

  /* ---------- arrears ---------- */
  standingArrears:      DataTypes.STRING,   // Yes / No
  standingArrearsCount: DataTypes.STRING,
  historyArrears:       DataTypes.STRING,   // Yes / No
  historyArrearCount:   DataTypes.STRING,

  /* ---------- placement ---------- */
  placementWilling: DataTypes.STRING,       // Yes / No
  residenceType:    DataTypes.STRING,       // Day Scholar / Hosteller

  /* ---------- parents ---------- */
  fatherName:         DataTypes.STRING,
  fatherOccupation:   DataTypes.STRING,
  motherName:         DataTypes.STRING,
  motherOccupation:   DataTypes.STRING,
  parentMobileFather: DataTypes.STRING,
  parentMobileMother: DataTypes.STRING,

  /* ---------- address ---------- */
  address:       DataTypes.TEXT,
  nativeDistrict:DataTypes.STRING,

  /* ---------- misc ---------- */
  skills:   DataTypes.TEXT,
  linkedin: DataTypes.STRING,
  github:   DataTypes.STRING,

  /* ---------- media ---------- */
  profileUrl: DataTypes.STRING,

  /* ---------- auth ---------- */
  password: { type: DataTypes.STRING, allowNull: false },
  /* ---------- status ---------- */
  verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
});

module.exports = Student;
