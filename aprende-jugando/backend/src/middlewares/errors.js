function notFound(req, res) {
  res.status(404).json({ error: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  if (err.message && err.message.startsWith('Origen no permitido por CORS')) {
    return res.status(403).json({ error: err.message });
  }
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'JSON inválido en el cuerpo de la petición' });
  }
  if (err.code === 'ER_NO_REFERENCED_ROW_2' || err.code === 'ER_NO_REFERENCED_ROW') {
    return res.status(400).json({ error: 'El estudiante o la actividad no existe' });
  }
  console.error('❌', err);
  res.status(500).json({ error: 'Error interno del servidor' });
}

module.exports = { notFound, errorHandler };
