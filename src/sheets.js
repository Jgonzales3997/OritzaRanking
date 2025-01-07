const hoja = "PeliculasVistas";
const optionsTMDB = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2NTliOTk2Yjg0YjRkMWUyMDQxOTdhNmY5YTBlODEyYSIsIm5iZiI6MTczMzg0NTUzOC4xMiwic3ViIjoiNjc1ODYyMjI3YWNmZDI3OGM2ZGQ5ZTg3Iiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.xBP3pB4pABqt20E8AUr3cmU0IjQl6TK94bVuvwX25BM",
  },
};

async function getPeliculas() {
  try {
    const response = await gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: "1V9ss3uxjZcz7fAI4b00JAWidzN9GbqaD2oZA1R4rWls",
      range: hoja + "!B:G",
    });

    const range = response.result;
    if (!range || !range.values || range.values.length === 0) {
      console.log("No se encontraron valores.");
      return;
    }

    // Filtrar todas las películas y categorizar por puntaje
    const peliculas = range.values
      .filter((fila) => fila[0]) // Asegurarse de que hay un puntaje
      .map((fila) => ({
        puntaje: fila[0],
        duracion: fila[1],
        anio: fila[2],
        nombre: fila[3],
        perspectiva: fila[4],
        personajeHistorico: fila[5],
      }));

    await mostrarPeliculasConPosters(peliculas);
  } catch (err) {
    console.error("Error al obtener las películas:", err.message);
  }
}

async function mostrarPeliculasConPosters(peliculas) {
  // Limpiar contenido previo
  document.querySelectorAll(".peliculas-container").forEach((container) => {
    container.innerHTML = "";
  });

  for (const pelicula of peliculas) {
    const posterUrl = await fetchPosterUrl(pelicula.nombre);

    // Crear la tarjeta de la película
    const tarjeta = `
      <div class="card">
        <div class="content">
          <div class="back">
            <div class="back-content">
              ${
                posterUrl
                  ? `<img src="${posterUrl}" alt="Poster de ${pelicula.nombre}" class="rounded-lg w-full h-full object-cover">`
                  : `<img src="https://media1.tenor.com/m/tw2n_40V3_0AAAAd/gatito-llorando.gif" alt="Póster no disponible" class="rounded-lg w-full h-full object-cover">`
              }
            </div>
          </div>
          <div class="front">
            <div class="front-content">
                 ${
                   posterUrl
                     ? `<img src="${posterUrl}" alt="Poster de ${pelicula.nombre}" class="rounded-lg w-full h-full object-cover">`
                     : `<img src="https://media1.tenor.com/m/tw2n_40V3_0AAAAd/gatito-llorando.gif" alt="Póster no disponible" class="rounded-lg w-full h-full object-cover">`
                 }
            </div>
            <div class="front-content">
              <small class="badge">${pelicula.anio}</small>
              <div class="description">
                <div class="title">
                  <p class="title">
                    <strong>${pelicula.nombre}</strong>
                  </p>
                </div>
                <p class="card-footer">
                  ${pelicula.duracion} min
                  ${
                    pelicula.personajeHistorico
                      ? `&nbsp; | &nbsp; ${pelicula.personajeHistorico}`
                      : ""
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Determinar el contenedor según el puntaje
    let sectionId;
    const puntaje = parseFloat(pelicula.puntaje);

    if (puntaje >= 9.9) {
      sectionId = "puntaje-9-9";
    } else if (puntaje >= 9.5) {
      sectionId = "puntaje-9-5";
    } else if (puntaje >= 9.0) {
      sectionId = "puntaje-9-0";
    } else if (puntaje >= 8.5) {
      sectionId = "puntaje-8-5";
    } else if (puntaje >= 8.0) {
      sectionId = "puntaje-8-0";
    } else if (puntaje >= 7.5) {
      sectionId = "puntaje-7-5";
    } else if (puntaje >= 7.0) {
      sectionId = "puntaje-7-0";
    } else if (puntaje <= 6.5) {
      sectionId = "puntaje-6-5";
    } else {
      sectionId = "otro"; // Cualquier caso que no encaje
    }

    // Insertar la tarjeta en la sección correspondiente
    document
      .querySelector(`#${sectionId} .peliculas-container`)
      .insertAdjacentHTML("beforeend", tarjeta);
  }
}

// Buscar el primer póster de la película en TMDB
async function fetchPosterUrl(nombrePeliculaOserie) {
  try {
    // Buscar si es una película o una serie
    const searchMovieResponse = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
        nombrePeliculaOserie
      )}&language=en-US`, // Búsqueda en inglés
      optionsTMDB
    );

    const searchTvResponse = await fetch(
      `https://api.themoviedb.org/3/search/tv?query=${encodeURIComponent(
        nombrePeliculaOserie
      )}&language=en-US`, // Búsqueda de series en inglés
      optionsTMDB
    );

    const searchMovieData = await searchMovieResponse.json();
    const searchTvData = await searchTvResponse.json();

    // Si encuentra la película
    if (searchMovieData.results && searchMovieData.results.length > 0) {
      const movieId = searchMovieData.results[0].id;
      // Obtener imágenes de la película
      const imageResponse = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/images?language=en-US&include_image_language=en,null`,
        optionsTMDB
      );
      const imageData = await imageResponse.json();

      if (imageData.posters && imageData.posters.length > 0) {
        const posterInEnglish =
          imageData.posters.find((poster) => poster.iso_639_1 === "en") ||
          imageData.posters[0]; // Si no se encuentra uno en inglés, tomar el primero disponible

        return `https://image.tmdb.org/t/p/w185${posterInEnglish.file_path}`;
      }
    }

    // Si encuentra la serie
    if (searchTvData.results && searchTvData.results.length > 0) {
      const tvId = searchTvData.results[0].id;
      // Obtener imágenes de la serie
      const tvImageResponse = await fetch(
        `https://api.themoviedb.org/3/tv/${tvId}/images?language=en-US&include_image_language=en,null`,
        optionsTMDB
      );
      const tvImageData = await tvImageResponse.json();

      if (tvImageData.posters && tvImageData.posters.length > 0) {
        const posterInEnglish =
          tvImageData.posters.find((poster) => poster.iso_639_1 === "en") ||
          tvImageData.posters[0]; // Si no se encuentra uno en inglés, tomar el primero disponible

        return `https://image.tmdb.org/t/p/w185${posterInEnglish.file_path}`;
      }
    }
  } catch (err) {
    console.error(
      `Error al buscar póster para "${nombrePeliculaOserie}":`,
      err
    );
  }

  return null; // Si no se encuentra un póster
}
