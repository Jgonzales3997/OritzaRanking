var text = document.getElementById("text");
var newDom = "";
var animationDelay = 6;

var words = text.innerText.split(" "); // Dividimos el texto en palabras

for (let i = 0; i < words.length; i++) {
  newDom +=
    '<span class="word">' +
    words[i]
      .split("")
      .map((char) =>
        char === " " ? "&nbsp;" : `<span class="char">${char}</span>`
      )
      .join("") +
    "</span>&nbsp;";
}

text.innerHTML = newDom;

var chars = text.querySelectorAll(".char");

chars.forEach((char, i) => {
  char.style["animation-delay"] = animationDelay * i + "ms";
});
