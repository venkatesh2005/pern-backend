// routes/departmentRoutes.js
const express = require('express');
const router = express.Router();
const {
  getDepartments,
  addDepartment,
  deleteDepartment,
  seedDepartmentsIfEmpty,
} = require('../controllers/departmentController');

const { getSections } = require('../controllers/sectionController'); // 👈 Import

// 🔁 Automatically seed departments once when server starts
seedDepartmentsIfEmpty();

router.get('/', getDepartments);
router.post('/', addDepartment);
router.delete('/:id', deleteDepartment);

// 👇 Add this route to support GET /api/departments/:id/sections
router.get('/:departmentId/sections', getSections); // 👈 FIXED

module.exports = router;
