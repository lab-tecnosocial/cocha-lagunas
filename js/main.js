/*
 * Orquestación del scroll con GSAP ScrollTrigger.
 *
 * El mapa queda fijo con `position: sticky` (CSS); ScrollTrigger detecta
 * qué paso del texto está activo y le pide al mapa ir a esa escena.
 */

/* global gsap, ScrollTrigger, Mapa, Galeria */

gsap.registerPlugin(ScrollTrigger);

const escritorio = matchMedia("(min-width: 900px)");
const pasos = gsap.utils.toArray(".paso");

/* Línea de activación: en móvil más abajo, porque el mapa ocupa la parte de arriba */
const linea = () => (escritorio.matches ? "62%" : "85%");

/* Estado inicial del mapa */
Mapa.ir(0, { inmediato: true });

const disparadores = pasos.map((paso, i) =>
  ScrollTrigger.create({
    trigger: paso,
    start: () => `top ${linea()}`,
    end: () => `bottom ${linea()}`,
    invalidateOnRefresh: true,
    onToggle: (self) => {
      if (self.isActive) Mapa.ir(i);
    },
  })
);

/* Si la página carga a mitad del recorrido, sincroniza sin animar */
requestAnimationFrame(() => {
  const activo = disparadores.findLastIndex((t) => t.isActive);
  if (activo >= 0) Mapa.ir(activo, { inmediato: true });
  else if (disparadores.at(-1).progress === 1) Mapa.ir(pasos.length - 1, { inmediato: true });
});

/* Parallax suave en la portada */
gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
  gsap.to(".portada__imagen", {
    scale: 1.12,
    yPercent: 8,
    ease: "none",
    scrollTrigger: { trigger: ".portada", start: "top top", end: "bottom top", scrub: true },
  });
  gsap.to(".portada__titulo", {
    yPercent: -35,
    autoAlpha: 0,
    ease: "none",
    scrollTrigger: { trigger: ".portada", start: "top top", end: "bottom 15%", scrub: true },
  });
});

/* Galerías: lagunas del mapa (click o teclado) */
document.querySelectorAll(".lago-foto").forEach((lago) => {
  const abrir = () => Galeria.abrir(Mapa.galeriaDeLago(lago.dataset.lake));
  lago.addEventListener("click", abrir);
  lago.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      abrir();
    }
  });
});

/* Recalcular cuando cargan las tipografías (cambian las alturas del texto) */
document.fonts?.ready.then(() => ScrollTrigger.refresh());
