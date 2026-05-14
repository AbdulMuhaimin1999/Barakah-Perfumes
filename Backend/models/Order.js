const pool = require('../config/db');

const Order = {
  async create({ user_id, full_name, phone, address, payment_method, total_amount }) {
    const [result] = await pool.query(
      `INSERT INTO orders (user_id, full_name, phone, address, payment_method, total_amount) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [user_id, full_name, phone, address, payment_method, total_amount]
    );
    return result.insertId;
  },

  async findByUserId(userId) {
    const [rows] = await pool.query(
      `SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC`,
      [userId]
    );
    return rows;
  },

  async findAll() {
    const [rows] = await pool.query(
      `SELECT o.*, u.name as user_name, u.email as user_email 
       FROM orders o 
       JOIN users u ON o.user_id = u.id 
       ORDER BY o.created_at DESC`
    );
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query(
      `SELECT o.*, u.name as user_name, u.email as user_email 
       FROM orders o 
       JOIN users u ON o.user_id = u.id 
       WHERE o.id = ?`,
      [id]
    );
    return rows[0];
  },

  /**
   * Workflow: Pending → Shipped → Delivered. Delivery is confirmed by an admin (Manage Orders).
   * When status becomes Delivered we store delivered_at so customers see when it was recorded.
   * Status is always updated first so databases without migrated delivered_at still work.
   */
  async updateStatus(id, status) {
    await pool.query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
    try {
      await pool.query(
        `UPDATE orders SET delivered_at = CASE WHEN ? = 'Delivered' THEN NOW() ELSE NULL END WHERE id = ?`,
        [status, id]
      );
    } catch (err) {
      if (err.code !== 'ER_BAD_FIELD_ERROR' && err.errno !== 1054) throw err;
    }
  },

  async count() {
    const [rows] = await pool.query('SELECT COUNT(*) as total FROM orders');
    return rows[0].total;
  },

  async totalRevenue() {
    const [rows] = await pool.query("SELECT COALESCE(SUM(total_amount), 0) as revenue FROM orders WHERE status != 'Pending'");
    return rows[0].revenue;
  },
};

module.exports = Order;
