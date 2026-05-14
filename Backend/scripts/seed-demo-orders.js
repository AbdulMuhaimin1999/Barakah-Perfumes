require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const pool = require('../config/db');

async function main() {
  const [orders] = await pool.query('SELECT COUNT(*) AS c FROM orders');
  if (orders[0].c > 0) {
    console.log(`Orders already exist (${orders[0].c}). Skipping demo seed.`);
    process.exit(0);
  }

  const [[user]] = await pool.query("SELECT id FROM users WHERE role = 'user' LIMIT 1");
  const [[product]] = await pool.query('SELECT id, price, name FROM products LIMIT 1');

  if (!user || !product) {
    console.log('Need at least one customer user and one product to seed demo orders.');
    process.exit(1);
  }

  const [orderResult] = await pool.query(
    `INSERT INTO orders (user_id, full_name, phone, address, payment_method, total_amount, status)
     VALUES (?, ?, ?, ?, 'cod', ?, 'Pending')`,
    [user.id, 'Demo Customer', '03001234567', 'House 12, Model Town, Lahore', product.price]
  );

  await pool.query(
    'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, 1, ?)',
    [orderResult.insertId, product.id, product.price]
  );

  console.log(`Demo order #${orderResult.insertId} created (${product.name}).`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
