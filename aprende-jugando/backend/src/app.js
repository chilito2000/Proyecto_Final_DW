const express = require('express');
const cors = require('cors');

const estudiantesRoutes = require('./routes/estudiantes.routes');
const actividadesRoutes = require('./routes/actividades.routes');
const progresosRoutes = require('./routes/progresos.routes');
const { notFound, errorHandler } = require('./middlewares/errors');

const app = express();

// ---------- CORS (RNF-03) ----------
const allowed = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim().replace(/\/$/, ''))
  .filter(Boolean);

app.use(
  cors({
    origin(origin, cb) {
      // Peticiones sin origen (curl, Postman) o con origen permitido
      if (!origin || allowed.includes('*') || allowed.includes(origin)) return cb(null, true);
      return cb(new Error(`Origen no permitido por CORS: ${origin}`));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
  })
);

app.use(express.json({ limit: '100kb' }));

// Medición del tiempo de respuesta (RNF-02)
app.use((req, res, next) => {
  const t0 = process.hrtime.bigint();
  const end = res.end;
  res.end = function (...args) {
    const ms = Number(process.hrtime.bigint() - t0) / 1e6;
    if (!res.headersSent) res.setHeader('X-Response-Time', `${ms.toFixed(1)}ms`);
    return end.apply(this, args);
  };
  next();
});

app.get('/', (req, res) => res.json({ api: 'Aprende Jugando', version: '1.0.0', docs: '/api/health' }));
app.get('/api/health', async (req, res) => {
  try {
    const pool = require('./config/db');
    await pool.query('SELECT 1');
    res.json({ ok: true, db: 'conectada', hora: new Date().toISOString() });
  } catch (e) {
    res.status(503).json({ ok: false, db: 'sin conexión', error: e.code || e.message });
  }
});

app.use('/api/estudiantes', estudiantesRoutes);
app.use('/api/actividades', actividadesRoutes);
app.use('/api/progresos', progresosRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
