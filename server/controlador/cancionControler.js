const Cancion = require('../model/cancionModel');
const { body, validationResult } = require('express-validator');

exports.guardarcancion = [
    body('artista').notEmpty().withMessage('El artista es obligatorio'),
    body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
    body('url_video').isURL().withMessage('La URL del video debe ser válida'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { artista, nombre, url_video } = req.body;
            const cancion = new Cancion({ artista, nombre, url_video });
            await cancion.save();
            res.status(201).json(cancion);
        } catch (err) {
            console.error('Error al guardar la canción:', err);
            res.status(500).json({ message: 'Error al guardar la canción', error: err.message });
        }
    }
];

exports.obtenerCanciones = async (req, res) => {
    try {
        const canciones = await Cancion.find();
        res.status(200).json(canciones);
    } catch (err) {
        console.error('Error al obtener las canciones:', err);
        res.status(500).json({ message: 'Error al obtener las canciones', error: err.message });
    }
};

// En el controlador (cancionControler.js)
exports.votarCancion = async (req, res) => {
    const { id } = req.params; // Obtener el id de la canción de la URL
    try {
        const cancion = await Cancion.findById(id); // Buscar la canción por ID
        if (!cancion) {
            return res.status(404).json({ message: 'Canción no encontrada' });
        }
        cancion.votos += 1; // Incrementar los votos
        await cancion.save(); // Guardar los cambios
        res.status(200).json(cancion); // Devolver la canción con los votos actualizados
    } catch (err) {
        console.error('Error al votar la canción:', err);
        res.status(500).json({ message: 'Error al votar la canción', error: err.message });
    }
};
exports.obtenerCancionAleatoria = async (req, res) => {
    try {
        const count = await Cancion.countDocuments(); // Obtener el número total de canciones
        const randomIndex = Math.floor(Math.random() * count); // Generar un índice aleatorio
        const cancionAleatoria = await Cancion.findOne().skip(randomIndex); // Obtener la canción en el índice aleatorio
        
        if (!cancionAleatoria) {
            return res.status(404).json({ message: 'No se encontró una canción aleatoria.' });
        }

        res.status(200).json(cancionAleatoria); // Devolver la canción aleatoria
    } catch (err) {
        console.error('Error al obtener la canción aleatoria:', err);
        res.status(500).json({ message: 'Error al obtener la canción aleatoria', error: err.message });
    }
};
