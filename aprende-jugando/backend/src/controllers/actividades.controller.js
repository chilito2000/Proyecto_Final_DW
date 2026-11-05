const pool = require('../config/db');

const NIVELES = ['preprimaria', 'primaria'];

async function listar(req, res, next) {
  try {
    const { nivel } = req.query;
    if (nivel && !NIVELES.includes(nivel)) {
      return res.status(400).json({ error: `nivel debe ser: ${NIVELES.join(' o ')}` });
    }
    const [rows] = nivel
      ? await pool.query('SELECT * FROM actividades WHERE nivel = ? ORDER BY orden', [nivel])
      : await pool.query('SELECT * FROM actividades ORDER BY orden');
    res.json(rows);
  } catch (e) { next(e); }
}

async function obtener(req, res, next) {
  try {
    const [rows] = await pool.query('SELECT * FROM actividades WHERE codigo = ?', [req.params.codigo]);
    if (!rows.length) return res.status(404).json({ error: 'Actividad no encontrada' });
    res.json(rows[0]);
  } catch (e) { next(e); }
}

module.exports = { listar, obtener };
