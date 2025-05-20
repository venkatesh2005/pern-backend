// controllers/departmentController.js
const Department = require('../models/department');

const defaultDepartments = [
  'Artificial Intelligence & Data Science',
  'Civil Engineering',
  'Computer Science & Engineering',
  'Computer Science and Engineering (Artificial Intelligence & Machine Learning)',
  'Computer Science and Engineering (Cyber Security)',
  'Electrical & Electronics Engineering',
  'Electronics & Communication Engineering',
  'Electronics Engineering (VLSI Design and Technology)',
  'Information Technology',
  'Mechanical Engineering',
  'Mechatronics Engineering',
  'Science & Humanities',
];

// ✅ Seed if empty
const seedDepartmentsIfEmpty = async () => {
  const count = await Department.count();
  if (count === 0) {
    await Department.bulkCreate(defaultDepartments.map(name => ({ name })));
    console.log('✅ Seeded default departments');
  }
};

// GET /api/departments
const getDepartments = async (req, res) => {
  try {
    const departments = await Department.findAll({ order: [['name', 'ASC']] });
    res.json(departments);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch departments' });
  }
};

// POST /api/departments
const addDepartment = async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: 'Department name is required' });

  try {
    const exists = await Department.findOne({ where: { name } });
    if (exists) return res.status(409).json({ message: 'Department already exists' });

    const department = await Department.create({ name });
    res.status(201).json(department);
  } catch (err) {
    res.status(500).json({ message: 'Error adding department' });
  }
};

// DELETE /api/departments/:id
const deleteDepartment = async (req, res) => {
  try {
    const deleted = await Department.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ message: 'Department not found' });
    res.json({ message: 'Department deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting department' });
  }
};

module.exports = {
  getDepartments,
  addDepartment,
  deleteDepartment,
  seedDepartmentsIfEmpty,
};
