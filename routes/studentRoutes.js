const express = require('express');
const router = express.Router();
const { getStudentById, updateStudentById } = require('../controllers/studentController');
const { verifyToken } = require('../middlewares/auth'); // ✅ fixed

router.get('/me', verifyToken, getStudentById);        // ✅ fixed
router.put('/me', verifyToken, updateStudentById);     // ✅ fixed

module.exports = router;
