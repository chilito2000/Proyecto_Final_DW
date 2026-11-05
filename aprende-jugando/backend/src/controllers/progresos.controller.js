const pool = require('../config/db');

const entero = (v, min = 0, max = 100000) => {
  const n = Number(v);
  return Number.isInteger(n) && n >= min && n <= max ? n : null;
};

// RF-06 / RF-08: historial (opcionalmente filtrado por estudiante y/o actividad)
async function listar(req, res, next) {
  try {
    const filtros = [];
    const params = [];
    if (req.query.estudiante_id) {
      const id = entero(req.query.estudiante_id, 1);
      if (!id) return res.status(400).json({ error: 'estudiante_id inválido' });
      filtros.push('p.estudiante_id = ?');
      params.push(id);
    }
    if (req.query.actividad) {
      filtros.push('a.codigo = ?');
      params.push(String(req.query.actividad));
    }
    const where = filtros.length ? `WHERE ${filtros.join(' AND ')}` : '';
    const [rows] = await pool.query(
      `SELECT p.id, p.puntaje, p.aciertos, p.total_preguntas, p.duracion_segundos, p.fecha,
              e.id AS estudiante_id, e.nombre AS estudiante, e.edad,
              a.id AS actividad_id, a.codigo, a.nombre AS actividad, a.nivel, a.area, a.icono
         FROM progresos p
         JOIN estudiantes e ON e.id = p.estudiante_id
         JOIN actividades a ON a.id = p.actividad_id
        ${where}
        ORDER BY p.fecha DESC, p.id DESC
        LIMIT 500`,
      params
    );
    res.json(rows);
  } catch (e) { next(e); }
}

// Resumen por actividad (promedios, mejor puntaje)
async function resumen(req, res, next) {
  try {
    const params = [];
    let where = '';
    if (req.query.estudiante_id) {
      const id = entero(req.query.estudiante_id, 1);
      if (!id) return res.status(400).json({ error: 'estudiante_id inválido' });
      where = 'WHERE p.estudiante_id = ?';
      params.push(id);
    }
    const [rows] = await pool.query(
      `SELECT a.codigo, a.nombre AS actividad, a.icono, a.nivel,
              COUNT(p.id) AS partidas,
              ROUND(AVG(p.puntaje), 1) AS promedio,
              MAX(p.puntaje) AS mejor,
              ROUND(100 * SUM(p.aciertos) / NULLIF(SUM(p.total_preguntas),0), 1) AS porcentaje_aciertos
         FROM progresos p
         JOIN actividades a ON a.id = p.actividad_id
        ${where}
        GROUP BY a.id
        ORDER BY a.orden`,
      params
    );
    res.json(rows.map((r) => ({
      ...r,
      partidas: Number(r.partidas),
      promedio: Number(r.promedio),
      mejor: Number(r.mejor),
      porcentaje_aciertos: r.porcentaje_aciertos === null ? null : Number(r.porcentaje_aciertos),
    })));
  } catch (e) { next(e); }
}

// RF-05: guardar resultado de una partida
async function registrar(req, res, next) {
  try {
    const b = req.body || {};
    const estudiante_id = entero(b.estudiante_id, 1);
    const puntaje = entero(b.puntaje, 0);
    const aciertos = entero(b.aciertos, 0, 1000);
    const total = entero(b.total_preguntas, 0, 1000);
    const duracion = entero(b.duracion_segundos ?? 0, 0, 86400);

    let actividad_id = entero(b.actividad_id, 1);
    if (!actividad_id && b.codigo) {
      const [a] = await pool.query('SELECT id FROM actividades WHERE codigo = ?', [String(b.codigo)]);
      actividad_id = a[0]?.id ?? null;
    }

    const errores = [];
    if (!estudiante_id) errores.push('estudiante_id es obligatorio');
    if (!actividad_id) errores.push('actividad_id o codigo válido es obligatorio');
    if (puntaje === null) errores.push('puntaje inválido');
    if (aciertos === null || total === null) errores.push('aciertos y total_preguntas deben ser enteros');
    else if (aciertos > total) errores.push('aciertos no puede ser mayor que total_preguntas');
    if (duracion === null) errores.push('duracion_segundos inválida');
    if (errores.length) return res.status(400).json({ error: errores.join('. ') });

    const [r] = await pool.query(
      `INSERT INTO progresos (estudiante_id, actividad_id, puntaje, aciertos, total_preguntas, duracion_segundos)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [estudiante_id, actividad_id, puntaje, aciertos, total, duracion]
    );
    res.status(201).json({ id: r.insertId, estudiante_id, actividad_id, puntaje, aciertos, total_preguntas: total, duracion_segundos: duracion });
  } catch (e) { next(e); }
}

module.exports = { listar, resumen, registrar };
