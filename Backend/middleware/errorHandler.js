function friendlyMessage(err) {
  const msg = String(err.message || err.sqlMessage || '');
  const code = err.code;
  const errno = err.errno;

  if (msg.includes('auth_gssapi') || msg.includes('unknown plugin')) {
    return (
      'Database login uses an unsupported auth plugin (often GSSAPI on MariaDB/MySQL). ' +
      'Fix: run ALTER USER for your DB user to use caching_sha2_password or mysql_native_password, then restart the API.'
    );
  }
  if (code === 'ER_ACCESS_DENIED_ERROR' || errno === 1045) {
    return 'Database access denied. Check DB_USER and DB_PASSWORD in Backend/.env.';
  }
  if (code === 'ER_BAD_DB_ERROR' || errno === 1049) {
    return 'Unknown database. Import Backend/database/schema.sql to create essential_perfume.';
  }
  if (code === 'ECONNREFUSED' || code === 'ENOTFOUND') {
    return 'Cannot reach MySQL. Start the database service and verify DB_HOST in Backend/.env.';
  }
  if (code === 'ER_DUP_ENTRY' || errno === 1062) {
    return 'That email is already registered.';
  }
  return null;
}

const errorHandler = (err, req, res, next) => {
  console.error(err.stack || err);

  const mapped = friendlyMessage(err);
  if (mapped) {
    return res.status(500).json({ success: false, message: mapped });
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
};

module.exports = errorHandler;
