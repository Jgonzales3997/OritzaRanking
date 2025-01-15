document.addEventListener("DOMContentLoaded", () => {
  const actualizarBtn = document.getElementById("actualizar-datos");
  const pantallaInicial = document.getElementById("pantalla-inicial");
  const contenido = document.getElementById("contenido");

  actualizarBtn.addEventListener("click", () => {
    // Inicia la animación de desvanecimiento de la pantalla inicial
    pantallaInicial.classList.add("fade-out");

    // Muestra y desplaza el contenido desbloqueado
    setTimeout(() => {
      contenido.classList.add("show");

      // Llama a la función para cargar el contenido (si aplica)
      getPeliculas(); // Asegúrate de definir esta función en tu código
    }, 500); // Tiempo suficiente para completar la animación
  });
});
