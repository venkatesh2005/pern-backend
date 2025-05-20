const express = require('express');
const router = express.Router();
const adminCtrl = require('../controllers/adminController');

// Dashboard Stats
router.get('/stats', adminCtrl.getStats);

// Department Management
router.get('/departments', adminCtrl.getDepartments);
router.post('/departments', adminCtrl.createDepartment);

// Student Management
router.get('/students', adminCtrl.getAllStudents);

// HOD Management
router.get('/hods', adminCtrl.getHODs);                      // Verified HODs
router.get('/pendingHODs', adminCtrl.getPendingHODs);        // Pending HODs
router.put('/approveHOD/:id', adminCtrl.approveHOD);         // Approve
router.delete('/rejectHOD/:id', adminCtrl.rejectHOD);        // Reject/Delete

module.exports = router;
