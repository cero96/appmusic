const express = require('express');
const cancionControler = require('../controlador/cancionControler');
const router = express.Router();

router.post('/', cancionControler.guardarcancion);
router.get('/', cancionControler.obtenerCanciones);
router.put('/votar/:id', cancionControler.votarCancion); // Ruta para votar una canción
router.get('/aleatoria', cancionControler.obtenerCancionAleatoria); // Nueva ruta para obtener canción aleatoria




module.exports = router;