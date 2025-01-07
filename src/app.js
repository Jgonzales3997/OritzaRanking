import { getMovieByTitle, getPosterUrl } from "./tmdb.js";

async function integrarDatosPeliculas(peliculas) {
  const peliculasConPosters = [];

  for (const pelicula of peliculas) {
    const datosTmdb = await getMovieByTitle(pelicula.nombre);

    if (datosTmdb) {
      peliculasConPosters.push({
        ...pelicula,
        posterUrl: getPosterUrl(datosTmdb),
      });
    } else {
      peliculasConPosters.push({
        ...pelicula,
        posterUrl: null, // Sin póster disponible
      });
    }
  }

  mostrarPeliculas(peliculasConPosters);
}

function mostrarPeliculas(peliculas) {
  const peliculasContainer = document.getElementById("peliculasContainer");
  peliculasContainer.innerHTML = "";

  peliculas.forEach((pelicula) => {
    const tarjeta = document.createElement("div");
    tarjeta.classList.add("tarjeta");

    // Generar contenido dinámico
    let tarjetaContenido = `
      <div class="img">
        <div class="circle"></div>
        <div class="circle" id="right"></div>
        <div class="circle" id="bottom"></div>
        <img src="${
          pelicula.posterUrl || "./placeholder.jpg"
        }" alt="Póster de ${pelicula.nombre}" />
      </div>
      <div class="front-content">
        <small class="badge">Año</small>
        <div class="description">
          <div class="title">
            <p class="title"><strong>${pelicula.nombre}</strong></p>
          </div>
          <p class="card-footer">Duración: ${pelicula.duracion} min</p>
          ${
            pelicula.personajeHistorico
              ? `<p>Personaje Histórico: ${pelicula.personajeHistorico}</p>`
              : ""
          }
        </div>
      </div>
    `;

    tarjeta.innerHTML = tarjetaContenido;
    peliculasContainer.appendChild(tarjeta);
  });
}

// Llama a esta función después de cargar las películas desde Google Sheets.
async function cargarPeliculas() {
  const peliculas = [
    { nombre: "La vida es bella", duracion: "116", anio: "1997" },
    { nombre: "Hasta el último hombre", duracion: "139", anio: "2016" },
  ];
  await integrarDatosPeliculas(peliculas);
}

cargarPeliculas();
