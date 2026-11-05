const { Router } = require('express');
const c = require('../controllers/actividades.controller');

const router = Router();

router.get('/', c.listar);            // GET /api/actividades?nivel=preprimaria  (RF-07)
router.get('/:codigo', c.obtener);    // GET /api/actividades/tablas

module.exports = router;
