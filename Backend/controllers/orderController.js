const { validationResult } = require('express-validator');
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Product = require('../models/Product');
const User = require('../models/User');

exports.placeOrder = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { full_name, phone, address, payment_method, items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No items in order' });
    }

    let total_amount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product_id);
      if (!product) {
        return res.status(400).json({ success: false, message: `Product ${item.product_id} not found` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ success: false, message: `Insufficient stock for ${product.name}` });
      }

      const itemTotal = product.price * item.quantity;
      total_amount += itemTotal;
      orderItems.push({ product_id: item.product_id, quantity: item.quantity, price: product.price });
    }

    const orderId = await Order.create({
      user_id: req.user.id,
      full_name,
      phone,
      address,
      payment_method: payment_method || 'cod',
      total_amount,
    });

    await OrderItem.createMany(orderId, orderItems);

    for (const item of orderItems) {
      await Product.update(item.product_id, {
        stock: (await Product.findById(item.product_id)).stock - item.quantity,
      });
    }

    const order = await Order.findById(orderId);
    const orderItemsDetail = await OrderItem.findByOrderId(orderId);

    res.status(201).json({ success: true, order: { ...order, items: orderItemsDetail } });
  } catch (error) {
    next(error);
  }
};

exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.findByUserId(req.user.id);

    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const items = await OrderItem.findByOrderId(order.id);
        return { ...order, items };
      })
    );

    res.json({ success: true, orders: ordersWithItems });
  } catch (error) {
    next(error);
  }
};

exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.findAll();

    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const items = await OrderItem.findByOrderId(order.id);
        return { ...order, items };
      })
    );

    res.json({ success: true, orders: ordersWithItems });
  } catch (error) {
    next(error);
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['Pending', 'Shipped', 'Delivered'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    await Order.updateStatus(id, status);
    const updated = await Order.findById(id);
    res.json({
      success: true,
      message: status === 'Delivered' ? 'Order marked delivered to customer' : 'Order status updated',
      order: updated,
    });
  } catch (error) {
    next(error);
  }
};

exports.getStats = async (req, res, next) => {
  try {
    const totalOrders = await Order.count();
    const totalProducts = await Product.count();
    const totalUsers = await User.count();
    const totalRevenue = await Order.totalRevenue();

    res.json({ success: true, stats: { totalOrders, totalProducts, totalUsers, totalRevenue } });
  } catch (error) {
    next(error);
  }
};
