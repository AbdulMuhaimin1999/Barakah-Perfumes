const express = require('express');
const { body } = require('express-validator');
const categoryController = require('../controllers/categoryController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();

router.get('/', categoryController.getAll);

router.post(
  '/',
  auth,
  admin,
  [body('name').trim().notEmpty().withMessage('Category name is required')],
  categoryController.create
);

router.put(
  '/:id',
  auth,
  admin,
  [body('name').trim().notEmpty().withMessage('Category name is required')],
  categoryController.update
);

router.delete('/:id', auth, admin, categoryController.delete);

module.exports = router;
