const pool = require('../config/db');

const OrderItem = {
  async createMany(orderId, items) {
    const values = items.map((item) => [orderId, item.product_id, item.quantity, item.price]);
    await pool.query(
      'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ?',
      [values]
    );
  },

  async findByOrderId(orderId) {
    const [rows] = await pool.query(
      `SELECT oi.*, p.name as product_name, p.image_url 
       FROM order_items oi 
       JOIN products p ON oi.product_id = p.id 
       WHERE oi.order_id = ?`,
      [orderId]
    );
    return rows;
  },
};

module.exports = OrderItem;
