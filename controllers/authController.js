const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Student   = require('../models/student');
const Staff     = require('../models/staff');
const HOD       = require('../models/hod');
const Principal = require('../models/principal');
const Admin     = require('../models/admin');

const principalCredentials = {
  email: 'principal@school.com',
  password: 'principal123',
};

const adminCredentials = {
  email: 'admin@school.com',
  password: 'admin123',
};

// Utility: Get model based on role
const getModelByRole = (role) => {
  switch (role) {
    case 'Student':   return Student;
    case 'Staff':     return Staff;
    case 'HOD':       return HOD;
    case 'Principal': return Principal;
    case 'Admin':     return Admin;
    default:          return null;
  }
};

// ──────────────────────────────────────────────────────────────
// REGISTER CONTROLLER
// ──────────────────────────────────────────────────────────────
exports.register = async (req, res) => {
  const {
    role,
    name,
    email,
    password,
    confirmPassword,
    regNo,
    department,
    section,
    photoLink,
  } = req.body;

  if (!role || !['Student', 'Staff', 'HOD', 'Principal', 'Admin'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role provided' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  const Model = getModelByRole(role);

  try {
    const emailExists = await Model.findOne({ where: { email } });
    if (emailExists) return res.status(409).json({ message: 'Email already registered' });

    if (role === 'Student' && regNo) {
      const regExists = await Student.findOne({ where: { regNo } });
      if (regExists) return res.status(409).json({ message: 'Registration number already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Prepare base fields
    const baseFields = {
      name,
      email,
      password: hashedPassword,
    };

    // Merge role-specific fields conditionally
    if (role === 'Student') {
      baseFields.regNo = regNo;
      baseFields.profileUrl = photoLink;
      baseFields.department = department;
      if (section?.trim()) {
        baseFields.section = section;
      }
    }

    if (role === 'Staff') {
      baseFields.department = department;
      if (section?.trim()) {
        baseFields.section = section;
      }
    }

    if (role === 'HOD') {
      baseFields.department = department;
    }

    const newUser = await Model.create(baseFields);

    res.status(201).json({ message: 'User registered successfully!' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


// ──────────────────────────────────────────────────────────────
// LOGIN CONTROLLER
// ──────────────────────────────────────────────────────────────
exports.login = async (req, res) => {
  const { emailOrRegNo, password } = req.body;

  // Principal hardcoded login
  if (emailOrRegNo === principalCredentials.email && password === principalCredentials.password) {
    const token = jwt.sign(
      { role: 'Principal', name: 'Principal' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    return res.json({ token });
  }

  // Admin hardcoded login
  if (emailOrRegNo === adminCredentials.email && password === adminCredentials.password) {
    const token = jwt.sign(
      { role: 'Admin', name: 'Admin' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    return res.json({ token });
  }

  // Find user in models
  const models = [Student, Staff, HOD];
  let user = null;
  let role = '';

  for (const model of models) {
    const field = model === Student ? 'regNo' : 'email';
    user = await model.findOne({ where: { [field]: emailOrRegNo } });
    if (user) {
      role = model.name;
      break;
    }
  }

  if (!user) return res.status(404).json({ message: 'User not found' });

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return res.status(401).json({ message: 'Invalid credentials' });

  // Unverified block for each type
  if (role === 'Student' && !user.verified) {
    return res.status(403).json({ message: 'Your registration is pending staff approval' });
  }

  if (role === 'Staff' && !user.verified) {
    return res.status(403).json({ message: 'Your account is waiting for HOD approval' });
  }

  if (role === 'HOD' && !user.verified) {
    return res.status(403).json({ message: 'Your account is waiting for admin approval' });
  }

  // Create JWT token payload
  const tokenPayload = { id: user.id, role };

  if (role === 'Student') {
    tokenPayload.name       = user.name;
    tokenPayload.regNo      = user.regNo;
    tokenPayload.department = user.department;
    tokenPayload.section    = user.section;
  } else if (role === 'Staff') {
    tokenPayload.name       = user.name;
    tokenPayload.department = user.department;
    tokenPayload.section    = user.section;
  } else if (role === 'HOD') {
    tokenPayload.name       = user.name;
    tokenPayload.department = user.department;
  }

  const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1h' });

  return res.json({
    token,
    ...(role === 'Student' && { regNo: user.regNo }),
  });
};
