const Staff = require('../models/staff');

/* 1.  STATS ( all staff in my department ) */
exports.getStats = async (req,res)=>{
  const { department } = req.user;
  try{
    const [total, approved, pending] = await Promise.all([
      Staff.count({ where:{ department             } }),
      Staff.count({ where:{ department, verified:true  } }),
      Staff.count({ where:{ department, verified:false } })
    ]);
    res.json({ total, approved, pending });
  }catch{ res.status(500).json({ message:'Server error'}); }
};

/* 2.  PENDING staff list */
exports.getPending = async (req,res)=>{
  try{
    const list = await Staff.findAll({
      where:{ department:req.user.department, verified:false },
      order:[['name','ASC']]
    });
    res.json(list);
  }catch{ res.status(500).json({ message:'Server error'}); }
};

/* 3.  APPROVED staff list */
exports.getApproved = async (req,res)=>{
  try{
    const list = await Staff.findAll({
      where:{ department:req.user.department, verified:true },
      order:[['name','ASC']]
    });
    res.json(list);
  }catch{ res.status(500).json({ message:'Server error'}); }
};

/* 4.  APPROVE staff */
exports.approveStaff = async (req,res)=>{
  const st = await Staff.findByPk(req.params.id);
  if (!st) return res.status(404).json({ message:'Staff not found' });
  if (st.department !== req.user.department)
    return res.status(403).json({ message:'Not your department' });

  st.verified = true; await st.save();
  res.json({ message:'Staff verified' });
};

/* 5.  REJECT / delete staff */
exports.rejectStaff = async (req,res)=>{
  const st = await Staff.findByPk(req.params.id);
  if (!st) return res.status(404).json({ message:'Staff not found' });
  if (st.department !== req.user.department)
    return res.status(403).json({ message:'Not your department' });

  await st.destroy();
  res.json({ message:'Staff record removed' });
};


const Student = require('../models/student'); // make sure this import exists

// 🔹 6. Get verified students in the HOD's department
exports.getStudents = async (req, res) => {
  try {
    const list = await Student.findAll({
      where: { department: req.user.department, verified: true },
      order: [['regNo', 'ASC']]
    });
    res.json(list);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.removeStaff = async (req, res) => {
  try {
    const staff = await Staff.findByPk(req.params.id);
    if (!staff) return res.status(404).json({ message: 'Staff not found' });

    // Optional: ensure HOD is not deleting outside their department
    if (staff.department !== req.user.department) {
      return res.status(403).json({ message: 'Not your department' });
    }

    await staff.destroy();
    res.json({ message: 'Staff removed successfully' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};
