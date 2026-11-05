const { Router } = require('express');
const c = require('../controllers/estudiantes.controller');

const router = Router();

router.get('/', c.listar);          // GET  /api/estudiantes
router.get('/:id', c.obtener);      // GET  /api/estudiantes/:id
router.post('/', c.crear);          // POST /api/estudiantes   (RF-01)
router.delete('/:id', c.eliminar);  // DELETE /api/estudiantes/:id

module.exports = router;
