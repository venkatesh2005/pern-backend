/* ------------  Imports & helpers ------------- */
const Student = require('../models/student');

/* 🔹 1.  STATS  ───────────────────────────────── */
exports.getStats = async (req, res) => {
  const { department, section } = req.user;
  try {
    const [total, approved, pending] = await Promise.all([
      Student.count({ where: { department, section } }),
      Student.count({ where: { department, section, verified: true  } }),
      Student.count({ where: { department, section, verified: false } }),
    ]);
    res.json({ total, approved, pending });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

/* 🔹 2.  PENDING LIST  ───────────────────────── */
exports.getPending = async (req, res) => {
  const { department, section } = req.user;
  try {
    const list = await Student.findAll({
      where : { verified:false, department, section },
      order : [['regNo','ASC']],
    });
    res.json(list);
  } catch {
    res.status(500).json({ message:'Server error' });
  }
};

/* 🔹 3.  APPROVED LIST  ──────────────────────── */
exports.getApproved = async (req, res) => {
  const { department, section } = req.user;
  try {
    const list = await Student.findAll({
      where : { verified:true, department, section },
      order : [['regNo','ASC']],
    });
    res.json(list);
  } catch {
    res.status(500).json({ message:'Server error' });
  }
};

/* 🔹 4.  APPROVE  ────────────────────────────── */
exports.approveStudent = async (req, res) => {
  const { id } = req.params;
  try {
    const st = await Student.findByPk(id);
    if (!st) return res.status(404).json({ message:'Student not found' });
    if (st.department !== req.user.department || st.section !== req.user.section)
      return res.status(403).json({ message:'Not your student' });

    st.verified = true;
    await st.save();
    res.json({ message:'Student verified!' });
  } catch {
    res.status(500).json({ message:'Server error' });
  }
};

/* 🔹 5.  REJECT + DELETE  ────────────────────── */
exports.rejectStudent = async (req, res) => {
  const { id } = req.params;
  try {
    const st = await Student.findByPk(id);
    if (!st) return res.status(404).json({ message:'Student not found' });
    if (st.department !== req.user.department || st.section !== req.user.section)
      return res.status(403).json({ message:'Not your student' });

    await st.destroy();
    res.json({ message:'Student record removed' });
  } catch {
    res.status(500).json({ message:'Server error' });
  }
};


exports.updateStudent = async (req, res) => {
  const { id } = req.params;
  const { department, section } = req.user;

  try {
    const student = await Student.findByPk(id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    if (student.department !== department || student.section !== section)
      return res.status(403).json({ message: 'Not your student' });

    // Update only allowed fields
    const updatableFields = Object.keys(Student.rawAttributes).filter(k => k !== 'id' && k !== 'createdAt' && k !== 'updatedAt');
    updatableFields.forEach(field => {
      if (req.body[field] !== undefined) {
        student[field] = req.body[field];
      }
    });

    await student.save();
    res.json({ message: 'Student updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteStudent = async (req, res) => {
  const { id } = req.params;
  const { department, section } = req.user;

  try {
    const student = await Student.findByPk(id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    if (student.department !== department || student.section !== section)
      return res.status(403).json({ message: 'Not your student' });

    await student.destroy();
    res.json({ message: 'Student deleted successfully' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

