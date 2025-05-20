const Section = require('../models/section');

exports.getSections = async (req, res) => {
  try {
    const list = await Section.findAll({ where: { DepartmentId: req.params.departmentId } });
    res.json(list);
  } catch {
    res.status(500).json({ message: 'Failed to fetch sections' });
  }
};

exports.addSection = async (req, res) => {
  const { name, DepartmentId } = req.body;
  if (!name || !DepartmentId)
    return res.status(400).json({ message: 'Name and DepartmentId required' });

  try {
    const exists = await Section.findOne({ where: { name, DepartmentId } });
    if (exists) return res.status(409).json({ message: 'Section already exists for this department' });

    const section = await Section.create({ name, DepartmentId });
    res.status(201).json(section);
  } catch {
    res.status(500).json({ message: 'Failed to add section' });
  }
};

exports.deleteSection = async (req, res) => {
  try {
    const deleted = await Section.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ message: 'Section not found' });
    res.json({ message: 'Section deleted' });
  } catch {
    res.status(500).json({ message: 'Error deleting section' });
  }
};