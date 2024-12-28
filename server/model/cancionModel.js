const mongoose = require('mongoose');

const cancionSchema = new mongoose.Schema({
    artista: { type: String, required: true },
    nombre: { type: String, required: true },
    url_video: { type: String, required: true },
    votos: { type: Number, default: 0 }  });

const Cancion = mongoose.model('Cancion', cancionSchema);

module.exports = Cancion;