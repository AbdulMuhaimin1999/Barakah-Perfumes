const pool = require('../config/db');

const Category = {
  async findAll() {
    const [rows] = await pool.query('SELECT * FROM categories ORDER BY name');
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM categories WHERE id = ?', [id]);
    return rows[0];
  },

  async create({ name, slug }) {
    const [result] = await pool.query(
      'INSERT INTO categories (name, slug) VALUES (?, ?)',
      [name, slug]
    );
    return result.insertId;
  },

  async update(id, { name, slug }) {
    await pool.query('UPDATE categories SET name = ?, slug = ? WHERE id = ?', [name, slug, id]);
  },

  async delete(id) {
    await pool.query('DELETE FROM categories WHERE id = ?', [id]);
  },
};

module.exports = Category;
