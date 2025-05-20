const router = require('express').Router();
const ctrl   = require('../controllers/staffController');
const auth   = require('../middlewares/auth');

router.use(auth.verifyToken);
router.use(auth.requireRole('Staff'));

/* NEW: stats */
router.get('/stats',            ctrl.getStats);

/* existing */
router.get('/pendingStudents',  ctrl.getPending);
router.get('/students',         ctrl.getApproved);
router.put('/approve/:id',      ctrl.approveStudent);
router.delete('/reject/:id',    ctrl.rejectStudent);
// routes/staff.js
router.put('/update/:id', ctrl.updateStudent);  // To update a student
router.delete('/delete/:id', ctrl.deleteStudent);  // To delete a student

module.exports = router;
