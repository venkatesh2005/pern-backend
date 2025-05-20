
const { Sequelize } = require('sequelize');
const Department    = require('../models/department');
const Student       = require('../models/student');
const HOD           = require('../models/hod');

// ─────────────────────────────────────────────
// DASHBOARD STATS  (+ dept‑wise counts)
// ─────────────────────────────────────────────
exports.getStats = async (req, res) => {
  try {
    const [
      totalStudents,
      totalDepartments,
      totalHODs,
      pendingHODs,
      deptCounts,
    ] = await Promise.all([
      Student.count(),
      Department.count(),
      HOD.count({ where: { verified: true } }),
      HOD.count({ where: { verified: false } }),
      // group students by department
      Student.findAll({
        attributes: [
          'department',
          [Sequelize.fn('COUNT', Sequelize.col('id')), 'count'],
        ],
        group : ['department'],
        order : [['department', 'ASC']],
        raw   : true,
      }),
    ]);

    res.json({
      totalStudents,
      totalDepartments,
      totalHODs,
      pendingHODs,
      deptCounts,          // ←  e.g. [{ department:"CSE", count:120 }, …]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch dashboard stats' });
  }
};


// ─────────────────────────────────────────────
// GET all departments
// ─────────────────────────────────────────────
exports.getDepartments = async (req, res) => {
  try {
    const depts = await Department.findAll();
    res.json(depts);
  } catch {
    res.status(500).json({ message: 'Error fetching departments' });
  }
};

// ─────────────────────────────────────────────
// ADD new department
// ─────────────────────────────────────────────
exports.createDepartment = async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: 'Department name is required' });

  try {
    const newDept = await Department.create({ name });
    res.status(201).json(newDept);
  } catch {
    res.status(500).json({ message: 'Error creating department' });
  }
};

// ─────────────────────────────────────────────
// GET all students
// ─────────────────────────────────────────────
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.findAll();
    res.json(students);
  } catch {
    res.status(500).json({ message: 'Error fetching students' });
  }
};

// ─────────────────────────────────────────────
// GET verified HODs
// ─────────────────────────────────────────────
exports.getHODs = async (req, res) => {
  try {
    const list = await HOD.findAll({ where: { verified: true }, order: [['name', 'ASC']] });
    res.json(list);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

// ─────────────────────────────────────────────
// GET pending HODs
// ─────────────────────────────────────────────
exports.getPendingHODs = async (req, res) => {
  try {
    const list = await HOD.findAll({ where: { verified: false }, order: [['name', 'ASC']] });
    res.json(list);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

// ─────────────────────────────────────────────
// APPROVE HOD
// ─────────────────────────────────────────────
exports.approveHOD = async (req, res) => {
  try {
    const hod = await HOD.findByPk(req.params.id);
    if (!hod) return res.status(404).json({ message: 'HOD not found' });

    hod.verified = true;
    await hod.save();
    res.json({ message: 'HOD approved successfully' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

// ─────────────────────────────────────────────
// DELETE/REJECT HOD
// ─────────────────────────────────────────────
exports.rejectHOD = async (req, res) => {
  try {
    const hod = await HOD.findByPk(req.params.id);
    if (!hod) return res.status(404).json({ message: 'HOD not found' });

    await hod.destroy();
    res.json({ message: 'HOD account deleted' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};
