// Función para obtener las canciones desde el servidor
async function obtenerCanciones() {
    try {
        const response = await fetch('http://localhost:3000/api/canciones'); // Realiza una solicitud GET para obtener las canciones
        if (!response.ok) { // Si la respuesta no es exitosa (código no es 200)
            throw new Error('Error al obtener las canciones');
        }
        const canciones = await response.json(); // Convierte la respuesta en JSON
        mostrarCanciones(canciones); // Llama a la función que muestra las canciones
    } catch (error) {
        console.error('Error al obtener canciones:', error); // Muestra el error en la consola si algo falla
        alert('Hubo un problema al cargar las canciones.');
    }
}
// Función para votar por una canción
async function votarCancion(id) {
    try {
        const response = await fetch(`http://localhost:3000/api/canciones/votar/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Error al votar por la canción');
        }

        const cancion = await response.json(); // Obtener la canción actualizada
        actualizarVotos(cancion); // Actualizar los votos en la interfaz
    } catch (error) {
        console.error('Error al votar:', error);
        alert('Hubo un problema al votar por la canción.');
    }
}

// Función para actualizar los votos en la interfaz
function actualizarVotos(cancion) {
    const voteCountElement = document.querySelector(`[data-id="${cancion._id}"] .vote-count`);
    if (voteCountElement) {
        voteCountElement.textContent = cancion.votos; // Actualizar el contador de votos
    }
}
// Función para obtener una canción aleatoria desde el servidor
async function obtenerCancionAleatoria() {
    try {
        const response = await fetch('http://localhost:3000/api/canciones/aleatoria'); // Solicitar canción aleatoria
        if (!response.ok) {
            throw new Error('Error al obtener la canción aleatoria');
        }
        const cancionAleatoria = await response.json(); // Convertir respuesta en JSON
        mostrarCancionAleatoria(cancionAleatoria); // Mostrar la canción aleatoria
    } catch (error) {
        console.error('Error al obtener canción aleatoria:', error);
        alert('Hubo un problema al obtener una canción aleatoria.');
    }
}

function mostrarCancionAleatoria(cancion) {
    const container = document.getElementById('randomSongContainer');
    
    // Limpiar el contenedor antes de agregar la nueva canción
    if (container.children.length === 0) {
        // Si no hay canciones previas, agregamos una fila
        const row = document.createElement('div');
        row.classList.add('row', 'g-4'); // 'g-4' agrega un espacio entre las columnas
        container.appendChild(row);
    }

    const row = container.querySelector('.row'); // Obtener la fila actual
    
    // Crear la tarjeta para la canción
    const divCard = document.createElement('div');
    divCard.classList.add('col-md-6'); // Usar 6 columnas de Bootstrap (2 columnas = 12 / 6)
    divCard.classList.add('mb-3');
    
    divCard.innerHTML = `
        <div class="card">
            <div class="card-body">
                <h5 class="card-title">Canción Aleatoria: ${cancion.nombre}</h5>
                <h6 class="card-subtitle mb-2 text-muted">Artista: ${cancion.artista}</h6>
                <p class="card-text"><strong>Votos:</strong> <span class="vote-count">${cancion.votos}</span></p>
                <p class="card-text">
                    <strong>URL:</strong> <a href="${cancion.url_video}" target="_blank">Escuchar</a>
                </p>
            </div>
        </div>
    `;

    // Agregar la tarjeta a la fila
    row.appendChild(divCard);
}


// Asociar el evento al botón de obtener canción aleatoria
document.getElementById('randomSongBtn').addEventListener('click', obtenerCancionAleatoria);

// Función para mostrar las canciones en la interfaz de usuario
function mostrarCanciones(canciones) {
    const container = document.getElementById('songList');
    container.innerHTML = ''; // Limpiar el contenedor antes de agregar nuevas canciones

    // Crear una fila para las canciones
    const row = document.createElement('div');
    row.classList.add('row', 'g-4'); // 'g-4' agrega un espacio entre las columnas
    container.appendChild(row);

    canciones.forEach(cancion => {
        const divCard = document.createElement('div');
        divCard.classList.add('col-md-6'); // Usar 6 columnas de Bootstrap para 2 canciones por fila
        divCard.classList.add('mb-3');
        
        divCard.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">Canción: ${cancion.nombre}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">Artista: ${cancion.artista}</h6>
                    <p class="card-text"><strong>Votos:</strong> <span class="vote-count">${cancion.votos}</span></p>
                    <p class="card-text">
                        <strong>URL:</strong> <a href="${cancion.url_video}" target="_blank">Escuchar</a>
                    </p>
                    <div class="d-flex justify-content-between">
                        <button class="btn btn-primary vote" data-id="${cancion._id}">Votar</button>
                    </div>
                </div>
            </div>
        `;

        // Agregar la funcionalidad al botón de votar
        divCard.querySelector('.vote').addEventListener('click', function() {
            votarCancion(cancion._id); // Llamar a la función para votar
        });

        row.appendChild(divCard); // Agregar la tarjeta a la fila
    });
}



// Manejo del formulario para agregar una nueva canción
document.getElementById('songForm').addEventListener('submit', async function(event) {
    event.preventDefault();  // Evitar el comportamiento por defecto del formulario

    const artist = document.getElementById('artist').value;
    const songName = document.getElementById('songName').value;
    const url = document.getElementById('url').value;

    const songData = {
        artista: artist,
        nombre: songName,
        url_video: url
    };

    try {
        const response = await fetch('http://localhost:3000/api/canciones', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(songData)  // Enviar los datos de la canción como JSON
        });

        if (!response.ok) {
            throw new Error('Error al agregar la canción');
        }

        const data = await response.json();
        mostrarCanciones([data]); // Mostrar solo la nueva canción añadida
        document.getElementById('songForm').reset(); // Limpiar el formulario
    } catch (error) {
        console.error('Error al agregar la canción:', error);
        alert('Hubo un problema al agregar la canción.');
    }
});

// Cargar canciones al iniciar la página
document.addEventListener('DOMContentLoaded', obtenerCanciones); // Llama a la función para obtener las canciones al cargar la página
