const { Router } = require('express');
const c = require('../controllers/progresos.controller');

const router = Router();

router.get('/', c.listar);          // GET  /api/progresos?estudiante_id=1  (RF-06, RF-08)
router.get('/resumen', c.resumen);  // GET  /api/progresos/resumen?estudiante_id=1
router.post('/', c.registrar);      // POST /api/progresos                   (RF-05)

module.exports = router;
