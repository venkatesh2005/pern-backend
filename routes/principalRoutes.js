const router = require('express').Router();
const ctrl = require('../controllers/principalController');
const auth = require('../middlewares/auth');

router.use(auth.verifyToken);
router.use(auth.requireRole('Principal'));

router.get('/overview', ctrl.getOverview);

module.exports = router;
