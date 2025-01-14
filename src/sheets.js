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
      range: hoja + "!B2:I",
    });

    const range = response.result;
    if (!range || !range.values || range.values.length === 0) {
      console.log("No se encontraron valores.");
      return;
    }

    const peliculas = range.values
      .filter((fila) => fila[4] && fila[5]) // Filtrar filas con ID y tipo válidos
      .map((fila) => ({
        puntaje: fila[0],
        duracion: fila[1],
        anio: fila[2],
        nombre: fila[3],
        idTMDB: fila[4],
        tipo: fila[5],
        perspectiva: fila[6],
        personajeHistorico: fila[7],
      }));

    await mostrarPeliculasConPosters(peliculas);
  } catch (err) {
    console.error("Error al obtener las películas:", err.message);
  }
}

async function fetchPosterUrlById(id, type = "movie") {
  try {
    const imageResponse = await fetch(
      `https://api.themoviedb.org/3/${type}/${id}/images?language=en-US&include_image_language=en,null`,
      optionsTMDB
    );
    const imageData = await imageResponse.json();

    if (imageData.posters && imageData.posters.length > 0) {
      const posterInEnglish =
        imageData.posters.find((poster) => poster.iso_639_1 === "en") ||
        imageData.posters[0];

      return `https://image.tmdb.org/t/p/w185${posterInEnglish.file_path}`;
    }
  } catch (err) {
    console.error(
      `Error al buscar póster por ID (${id}) y tipo (${type}):`,
      err
    );
  }

  return null;
}

async function mostrarPeliculasConPosters(peliculas) {
  document.querySelectorAll(".peliculas-container").forEach((container) => {
    container.innerHTML = "";
  });

  for (const pelicula of peliculas) {
    const posterUrl = await fetchPosterUrlById(pelicula.idTMDB, pelicula.tipo);

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
                  ${pelicula.duracion} hrs
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

    let sectionId;
    const puntaje = parseFloat(pelicula.puntaje);

    if (!pelicula.puntaje || pelicula.puntaje.trim() === "") {
      sectionId = "otro";
    } else if (puntaje >= 9.9) {
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
      sectionId = "otro";
    }

    document
      .querySelector(`#${sectionId} .peliculas-container`)
      .insertAdjacentHTML("beforeend", tarjeta);
  }
}

getPeliculas();
