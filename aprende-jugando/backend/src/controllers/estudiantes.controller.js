const pool = require('../config/db');

const toId = (v) => {
  const n = Number(v);
  return Number.isInteger(n) && n > 0 ? n : null;
};

async function listar(req, res, next) {
  try {
    const [rows] = await pool.query(
      `SELECT e.id, e.nombre, e.edad, e.creado_en,
              COUNT(p.id) AS partidas, COALESCE(SUM(p.puntaje),0) AS puntaje_total
         FROM estudiantes e
         LEFT JOIN progresos p ON p.estudiante_id = e.id
        GROUP BY e.id
        ORDER BY e.nombre`
    );
    res.json(rows.map((r) => ({ ...r, partidas: Number(r.partidas), puntaje_total: Number(r.puntaje_total) })));
  } catch (e) { next(e); }
}

async function obtener(req, res, next) {
  try {
    const id = toId(req.params.id);
    if (!id) return res.status(400).json({ error: 'id inválido' });
    const [rows] = await pool.query('SELECT id, nombre, edad, creado_en FROM estudiantes WHERE id = ?', [id]);
    if (!rows.length) return res.status(404).json({ error: 'Estudiante no encontrado' });
    res.json(rows[0]);
  } catch (e) { next(e); }
}

async function crear(req, res, next) {
  try {
    const nombre = String(req.body?.nombre ?? '').trim().replace(/\s+/g, ' ');
    const edad = Number(req.body?.edad);
    const errores = [];
    if (nombre.length < 2 || nombre.length > 80) errores.push('El nombre debe tener entre 2 y 80 caracteres');
    if (!Number.isInteger(edad) || edad < 3 || edad > 15) errores.push('La edad debe ser un número entre 3 y 15');
    if (errores.length) return res.status(400).json({ error: errores.join('. ') });

    const [r] = await pool.query('INSERT INTO estudiantes (nombre, edad) VALUES (?, ?)', [nombre, edad]);
    const [rows] = await pool.query('SELECT id, nombre, edad, creado_en FROM estudiantes WHERE id = ?', [r.insertId]);
    res.status(201).json(rows[0]);
  } catch (e) { next(e); }
}

async function eliminar(req, res, next) {
  try {
    const id = toId(req.params.id);
    if (!id) return res.status(400).json({ error: 'id inválido' });
    const [r] = await pool.query('DELETE FROM estudiantes WHERE id = ?', [id]);
    if (!r.affectedRows) return res.status(404).json({ error: 'Estudiante no encontrado' });
    res.status(204).end();
  } catch (e) { next(e); }
}

module.exports = { listar, obtener, crear, eliminar };
