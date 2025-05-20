const Department = require('../models/department');
const Staff = require('../models/staff');
const Student = require('../models/student');

exports.getOverview = async (req, res) => {
  try {
    const departments = await Department.findAll();
    const totalStaff = await Staff.count();
    const approvedStaff = await Staff.count({ where: { verified: true } });
    const pendingStaff = totalStaff - approvedStaff;
    const totalStudents = await Student.count();

    res.json({
      departments: departments.map(dep => dep.name),
      totalStaff,
      approvedStaff,
      pendingStaff,
      totalStudents
    });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};
