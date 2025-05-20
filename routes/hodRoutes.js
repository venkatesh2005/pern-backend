const router = require('express').Router();
const ctrl   = require('../controllers/hodController');
const auth   = require('../middlewares/auth');

router.use(auth.verifyToken);
router.use(auth.requireRole('HOD'));

router.get('/stats',           ctrl.getStats);
router.get('/pendingStaff',    ctrl.getPending);
router.get('/staff',           ctrl.getApproved);
router.put('/approve/:id',     ctrl.approveStaff);
router.delete('/reject/:id',   ctrl.rejectStaff);
router.get('/students', ctrl.getStudents);
router.delete('/removeStaff/:id', ctrl.removeStaff); // This route is never declared

module.exports = router;
