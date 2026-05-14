const pool = require('../config/db');

const Product = {
  async findAll({ category, search }) {
    let sql = `SELECT p.*, c.name as category_name, c.slug as category_slug
               FROM products p 
               LEFT JOIN categories c ON p.category_id = c.id`;
    const params = [];
    const conditions = [];

    if (category) {
      conditions.push('c.slug = ?');
      params.push(category);
    }
    if (search) {
      conditions.push('(p.name LIKE ? OR p.description LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }
    sql += ' ORDER BY p.created_at DESC';

    const [rows] = await pool.query(sql, params);
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query(
      `SELECT p.*, c.name as category_name, c.slug as category_slug
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       WHERE p.id = ?`,
      [id]
    );
    return rows[0];
  },

  async create({ name, description, price, stock, image_url, category_id }) {
    const [result] = await pool.query(
      'INSERT INTO products (name, description, price, stock, image_url, category_id) VALUES (?, ?, ?, ?, ?, ?)',
      [name, description, price, stock, image_url, category_id]
    );
    return result.insertId;
  },

  async update(id, fields) {
    const keys = Object.keys(fields);
    const values = Object.values(fields);
    const setClause = keys.map((k) => `${k} = ?`).join(', ');
    await pool.query(`UPDATE products SET ${setClause} WHERE id = ?`, [...values, id]);
  },

  async delete(id) {
    await pool.query('DELETE FROM products WHERE id = ?', [id]);
  },

  async count() {
    const [rows] = await pool.query('SELECT COUNT(*) as total FROM products');
    return rows[0].total;
  },
};

module.exports = Product;
