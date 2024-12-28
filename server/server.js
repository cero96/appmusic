const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

mongoose.connect('mongodb://localhost/music-db', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Conectado a la base de datos'))
    .catch(err => console.log('Error al conectar con la base de datos', err));

app.use(cors());
app.use(bodyParser.json());

const cancionesRoutes = require('./vista/cancionesRoutes');
app.use('/api/canciones', cancionesRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
