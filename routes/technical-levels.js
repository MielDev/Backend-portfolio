const express = require('express');
const router = express.Router();
const technicalLevelController = require('../controllers/technicalLevelController');
const auth = require('../middleware/auth');
const { body } = require('express-validator');
const validate = require('../middleware/validate');

const levelValidation = [
  body('type').isIn(['hard', 'soft']).withMessage('Type must be hard or soft'),
  body('title').notEmpty().withMessage('Title is required'),
  body('percent').optional({ nullable: true }).isInt({ min: 0, max: 100 }).withMessage('Percent must be between 0 and 100'),
  body('sort_order').optional({ nullable: true }).isInt().withMessage('Sort order must be an integer'),
  validate
];

router.get('/', technicalLevelController.getAll);
router.get('/:id', technicalLevelController.getById);

router.post('/', auth, levelValidation, technicalLevelController.create);
router.put('/:id', auth, levelValidation, technicalLevelController.update);
router.delete('/:id', auth, technicalLevelController.remove);

module.exports = router;

