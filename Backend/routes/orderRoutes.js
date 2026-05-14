const express = require('express');
const { body } = require('express-validator');
const orderController = require('../controllers/orderController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();

router.post(
  '/',
  auth,
  [
    body('full_name').trim().notEmpty().withMessage('Full name is required'),
    body('phone').trim().notEmpty().withMessage('Phone number is required'),
    body('address').trim().notEmpty().withMessage('Address is required'),
    body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  ],
  orderController.placeOrder
);

router.get('/my', auth, orderController.getMyOrders);
router.get('/stats', auth, admin, orderController.getStats);
router.get('/', auth, admin, orderController.getAllOrders);
router.put('/:id/status', auth, admin, orderController.updateStatus);

module.exports = router;
