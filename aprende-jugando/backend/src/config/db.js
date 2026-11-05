const mysql = require('mysql2/promise');
require('dotenv').config();

/**
 * Construye la configuración de conexión a partir del .env.
 * Acepta DATABASE_URL (p. ej. la "Service URI" de Aiven:
 * mysql://usuario:clave@host:puerto/defaultdb?ssl-mode=REQUIRED)
 * o variables separadas DB_HOST, DB_USER, etc.
 */
function configuracion() {
  const url = process.env.DATABASE_URL;
  let sslRequerido = String(process.env.DB_SSL).toLowerCase() === 'true';

  if (url) {
    const u = new URL(url);
    if (/ssl-mode=(required|verify)/i.test(u.search) || u.searchParams.get('ssl') === 'true') sslRequerido = true;
    return {
      host: u.hostname,
      port: Number(u.port) || 3306,
      user: decodeURIComponent(u.username),
      password: decodeURIComponent(u.password),
      database: decodeURIComponent(u.pathname.replace(/^\//, '')) || undefined,
      ssl: sslRequerido ? { rejectUnauthorized: false } : undefined,
    };
  }
  return {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'aprende_jugando',
    ssl: sslRequerido ? { rejectUnauthorized: false } : undefined,
  };
}

const pool = mysql.createPool({
  ...configuracion(),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4',
  timezone: 'Z',
});

module.exports = pool;
module.exports.configuracion = configuracion;
