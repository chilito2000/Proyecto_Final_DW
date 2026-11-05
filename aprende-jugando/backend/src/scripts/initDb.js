// Crea las tablas y datos iniciales ejecutando database/schema.sql
// Uso: npm run db:init   (usa las variables del archivo .env)
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const { configuracion } = require('../config/db');

(async () => {
  const file = path.join(__dirname, '..', '..', '..', 'database', 'schema.sql');
  let sql = fs.readFileSync(file, 'utf8');
  const cfg = configuracion();
  const local = !process.env.DATABASE_URL;

  if (local) {
    // En local se crea la base si no existe
    const tmp = await mysql.createConnection({ ...cfg, database: undefined });
    await tmp.query(`CREATE DATABASE IF NOT EXISTS \`${cfg.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    await tmp.end();
  }
  // Se usa la base indicada en la configuración (en hostings no se permite CREATE DATABASE)
  sql = sql.replace(/^CREATE DATABASE[\s\S]*?;\s*$/m, '').replace(/^USE\s+\w+;\s*$/m, '');

  const conn = await mysql.createConnection({ ...cfg, multipleStatements: true });
  await conn.query(sql);
  const [[{ n }]] = await conn.query('SELECT COUNT(*) AS n FROM actividades');
  console.log(`✅ Base de datos "${cfg.database}" lista. Actividades cargadas: ${n}`);
  await conn.end();
})().catch((e) => {
  console.error('❌ No se pudo inicializar la base de datos:', e.message);
  process.exit(1);
});
