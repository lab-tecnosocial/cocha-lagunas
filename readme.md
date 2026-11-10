# cocha-lagunas

Historia gráfica de las lagunas perdidas de Cochabamba.

Accede a la presentación [aquí](https://labtecnosocial.org/cocha-lagunas/).

## Tecnología

Sitio estático, sin paso de compilación:

- **Scroll**: el mapa queda fijo con `position: sticky`; [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) (vía CDN) detecta el paso activo.
- **Mapa**: un solo SVG cuya "cámara" es el `viewBox`, con zoom suave (van Wijk & Nuij). Cada paso es una escena declarativa en `js/data.js`.
- **Detalles nativos**: barra de progreso y aparición de tarjetas con animaciones CSS ligadas al scroll (`animation-timeline`), galería con `<dialog>`, respeto de `prefers-reduced-motion`.

Archivos principales: `index.html`, `css/style.css`, `js/data.js` (galerías, etiquetas y escenas), `js/map.js` (mapa y cámara), `js/slideshow.js` (galería), `js/main.js` (scroll).

Para verlo en local basta abrir `index.html` o servir la carpeta (`npm start`).

---

Icons made by [Freepick](https://www.freepik.com), [Pixel Buddha](https://www.flaticon.com/authors/pixel-buddha), and [Pixel Perfect](https://www.flaticon.com/authors/pixel-perfect) from [www.flaticon.com](https://www.flaticon.com/).
