require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const bcrypt = require('bcryptjs');
const pool = require('../config/db');

async function main() {
  const email = process.argv[2] || 'admin@essential.com';
  const password = process.argv[3] || 'admin123';
  const hash = await bcrypt.hash(password, 10);
  await pool.query('UPDATE users SET password = ? WHERE email = ?', [hash, email]);
  console.log(`Password updated for ${email}`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
