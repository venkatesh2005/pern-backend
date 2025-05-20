const Student = require('../models/student');

exports.getStudentById = async (req, res) => {
  const { id } = req.user; // From auth middleware
  try {
    const student = await Student.findByPk(id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch student', error: err });
  }
};

exports.updateStudentById = async (req, res) => {
  const { id } = req.user;
  try {
    const student = await Student.findByPk(id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    await student.update(req.body);
    res.json({ message: 'Profile updated successfully', student });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update profile', error: err });
  }
};
