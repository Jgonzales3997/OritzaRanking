// Función para obtener los detalles de la película "La vida es bella"
function fetchPelicula() {
  const apiKey = "TU_API_KEY"; // Reemplaza con tu API Key de TMDB
  const movieId = 551; // El ID de "La vida es bella" en TMDB (se puede buscar o usar un ID conocido)

  const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=es-ES`;

  // Realizamos la solicitud a la API
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      // Extraemos la información necesaria de la película
      const pelicula = {
        nombre: data.title,
        anio: data.release_date.split("-")[0],
        duracion: `${data.runtime} min`,
        puntaje: data.vote_average,
        posterUrl: `https://image.tmdb.org/t/p/w500${data.poster_path}`,
        personajeHistorico: null, // Si no hay personaje histórico, se deja null
      };

      // Mostrar la película en la tarjeta
      mostrarPelicula(pelicula);
    })
    .catch((error) =>
      console.error("Error al obtener datos de la API:", error)
    );
}

// Función para mostrar la película en la tarjeta
function mostrarPelicula(pelicula) {
  const peliculasContainer = document.getElementById("peliculasContainer");
  peliculasContainer.innerHTML = ""; // Limpiar el contenido previo

  // Crear la tarjeta
  const tarjeta = document.createElement("div");
  tarjeta.classList.add("card");

  // Contenido de la tarjeta
  tarjeta.innerHTML = `
      <div class="content">
        <div class="back">
          <div class="back-content">
            <strong>${pelicula.puntaje}</strong>
          </div>
        </div>
        <div class="front">
          <!-- Imagen -->
          <div class="img">
            <div class="circle"></div>
            <div class="circle" id="right"></div>
            <div class="circle" id="bottom"></div>
            <img src="${pelicula.posterUrl}" alt="Póster de ${
    pelicula.nombre
  }" />
          </div>
          <!-- Información -->
          <div class="front-content">
            <small class="badge">${pelicula.anio}</small>
            <div class="description">
              <div class="title">
                <p class="title"><strong>${pelicula.nombre}</strong></p>
              </div>
              <p class="card-footer">
                Duración: ${pelicula.duracion}
                ${
                  pelicula.personajeHistorico
                    ? ` | ${pelicula.personajeHistorico}`
                    : ""
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    `;

  // Agregar tarjeta al contenedor
  peliculasContainer.appendChild(tarjeta);
}

// Llamar la función cuando cargue la página
document.addEventListener("DOMContentLoaded", fetchPelicula);
