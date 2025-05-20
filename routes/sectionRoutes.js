const router               = require('express').Router();
const sectionController     = require('../controllers/sectionController');

router.get('/:departmentId', sectionController.getSections);
router.post('/',            sectionController.addSection);
router.delete('/:id',       sectionController.deleteSection);

module.exports = router;
