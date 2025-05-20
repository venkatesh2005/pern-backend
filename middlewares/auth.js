const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message:'Login required' });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);   // now contains dept/section for staff
    next();
  } catch { return res.status(403).json({ message:'Invalid token' }); }
};

exports.requireRole = role => (req, res, next) => {
  if (req.user?.role !== role) return res.status(403).json({ message:'Forbidden' });
  next();
};
