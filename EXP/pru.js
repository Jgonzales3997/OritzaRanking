var text = document.getElementById("text");
var newDom = "";
var animationDelay = 6;

// Dividir el texto en palabras
var words = text.innerText.split(" ");

for (let i = 0; i < words.length; i++) {
  // Crear un span para cada palabra
  newDom +=
    '<span class="word">' +
    words[i]
      .split("") // Dividir cada palabra en caracteres
      .map((char) =>
        char === " " ? "&nbsp;" : `<span class="char">${char}</span>`
      )
      .join("") +
    "</span>&nbsp;"; // Agregar espacio entre palabras
}

text.innerHTML = newDom;

// Seleccionar todos los caracteres para animarlos
var chars = text.querySelectorAll(".char");

chars.forEach((char, i) => {
  char.style["animation-delay"] = animationDelay * i + "ms";
});
