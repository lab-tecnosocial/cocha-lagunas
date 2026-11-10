/*
 * Galería de fotos con <dialog> nativo: foco, tecla Esc y fondo
 * los maneja el navegador. Flechas del teclado para navegar.
 */

/* global GALERIAS */
/* eslint-disable no-unused-vars */

const Galeria = (() => {
  const dialogo = document.getElementById("galeria");
  const titulo = dialogo.querySelector(".galeria__titulo");
  const img = dialogo.querySelector(".galeria__img");
  const vacio = dialogo.querySelector(".galeria__vacio");
  const creditos = dialogo.querySelector(".galeria__creditos");
  const texto = dialogo.querySelector(".galeria__texto");
  const contador = dialogo.querySelector(".galeria__contador");
  const prev = dialogo.querySelector(".galeria__flecha--prev");
  const next = dialogo.querySelector(".galeria__flecha--next");

  let fotos = [];
  let indice = 0;
  let solicitud = 0;
  const cache = new Map();

  const precargar = (src) => {
    if (!src) return Promise.resolve();
    if (!cache.has(src)) {
      const im = new Image();
      im.src = src;
      cache.set(src, im.decode().catch(() => {}));
    }
    return cache.get(src);
  };

  const mostrar = async () => {
    const { src, title = "", credits = "", figcaption = "" } = fotos[indice];
    const id = ++solicitud;

    titulo.textContent = title;
    creditos.textContent = credits;
    texto.innerHTML = figcaption;
    contador.textContent = fotos.length > 1 ? `${indice + 1} / ${fotos.length}` : "";
    prev.hidden = indice === 0;
    next.hidden = indice >= fotos.length - 1;

    if (!src) {
      img.hidden = true;
      vacio.hidden = false;
      return;
    }
    vacio.hidden = true;
    img.hidden = false;
    img.classList.add("cargando");
    await precargar(src);
    if (id !== solicitud) return; // otra foto fue pedida mientras cargaba
    img.src = src;
    img.alt = title;
    img.classList.remove("cargando");

    // precarga la siguiente
    if (fotos[indice + 1]) precargar(fotos[indice + 1].src);
  };

  const abrir = (clave) => {
    fotos = GALERIAS[clave] ?? [];
    if (!fotos.length) return;
    indice = 0;
    mostrar();
    if (!dialogo.open) dialogo.showModal();
  };

  const mover = (paso) => {
    const nuevo = indice + paso;
    if (nuevo < 0 || nuevo >= fotos.length) return;
    indice = nuevo;
    mostrar();
  };

  prev.addEventListener("click", () => mover(-1));
  next.addEventListener("click", () => mover(1));

  dialogo.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") mover(-1);
    if (e.key === "ArrowRight") mover(1);
  });

  // click fuera de la foto cierra la galería
  dialogo.addEventListener("click", (e) => {
    if (
      e.target === dialogo ||
      e.target.classList.contains("galeria__figura") ||
      e.target.classList.contains("galeria__marco")
    ) {
      dialogo.close();
    }
  });

  return { abrir };
})();
