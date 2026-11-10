/*
 * Datos del recorrido: galerías de fotos, etiquetas del mapa y escenas.
 *
 * Coordenadas del "mundo": las del mapa de la provincia Cercado (0–500).
 * El mapa del departamento de Cochabamba se dibuja con sus propias
 * coordenadas y se escala con COCHA_A_MUNDO para que su Cercado coincida
 * exactamente con el mapa detallado del Cercado.
 */

/* eslint-disable no-unused-vars */

const COCHA_A_MUNDO = { s: 13.0435, tx: -2098.264, ty: -3385.265 };

/*
 * Galerías (texto original del artículo)
 */
const GALERIAS = {
  cuellar: [
    {
      src: "img/cuellar-1.jpg",
      title: "Los cisnes de la Laguna Cuellar",
      credits: '—Revista "Ahora: Historias y Leyendas de Cochabamba"',
    },
    {
      src: "img/cuellar-2.jpg",
      title: "Laguna Cuellar",
      credits: "—Autor desconocido. Cochabamba, 1925",
      figcaption: "Había una pequeña isla con un quiosco al medio de la laguna.",
    },
  ],
  estadio: [
    {
      src: "img/estadio-1.jpg",
      title: "Estadio Félix Capriles",
      credits: '—Blog "Los Estadios del Mundo"',
    },
  ],
  sarco: [
    {
      src: "img/sarco-1.jpg",
      title: "El espejo de la Laguna Sarco",
      credits: "—Rodolfo Torrico Zamudio (ca. 1940-1950)",
    },
  ],
  complejoSarco: [
    {
      src: "img/complejo-sarco-1.jpg",
      title: "Gimnasio Polifuncional Sarco",
      credits: "—Los Tiempos. Daniel James.",
    },
    {
      src: "img/complejo-sarco-2.png",
      title: "Gimnasio Polifuncional Sarco",
      credits: "—Google maps (2015)",
    },
  ],
  cuadras: [{ src: "", credits: "—No se tienen fotos de la Laguna Cuadras" }],
  teleferico: [
    {
      src: "img/estacion-teleferico-1.png",
      title: "Parque de la Autonomía",
      credits: "—Google maps (2015)",
    },
    {
      src: "img/estacion-teleferico-2.png",
      title: "Estación Teleférico",
      credits: "—Google maps (2015)",
    },
  ],
  quenamari: [
    {
      src: "img/quenamari-1.jpg",
      title: "Laguna Quenamari",
      credits: "—Los Tiempos. Carlos López (2016)",
      figcaption:
        "Ya en el 2015, se presentó un <a href='https://www.lostiempos.com/actualidad/cochabamba/20190504/tres-anos-no-hay-ley-proteccion-quenamari' target='_blank'>proyecto de Ley</a> para hacer de la Laguna Quenamari un área protegida. No ha sido aprobado hasta la fecha.",
    },
    {
      src: "img/quenamari-2.jpg",
      title: "Laguna Quenamari",
      credits: "—Los Tiempos. José Rocha (2017)",
      figcaption:
        "El agua que ingresaba a la laguna desde los rebalses del río Rocha y Tamborada ha sido <a href='https://www.lostiempos.com/actualidad/cochabamba/20171122/30-anos-ciudad-perdio-4-lagunas-urbanas-hay-3-riesgo' target='_blank'>desviado</a>.",
    },
    {
      src: "img/quenamari-3.jpg",
      title: "Laguna Quenamari avasallada",
      credits: "—Opinión (2019)",
      figcaption:
        "Poco a poco, los terrenos de la laguna son <a href='https://www.opinion.com.bo/articulo/cochabamba/construcciones-invaden-laguna-quenamari-entes-buscan-frenar/20190321060800644802.html' target='_blank'>rellenados</a> para cultivar o incluso para construir.",
    },
    {
      src: "img/quenamari-4.jpg",
      title: "Aves de la laguna Quenamari",
      credits:
        "—Captura de pantall del Documental 'La Laguna de Quenamari' (TVU-2014)",
      figcaption:
        "Más de 100 especes de aves podían encontrarse en la Laguna de Quenamari.",
    },
  ],
};

/*
 * Lagunas con foto: estado "antes" (laguna) y "ahora" (lo que hay hoy).
 */
const LAGOS = {
  cuellar: {
    antes: { fill: "url(#cuellar-cover)", galeria: "cuellar", texto: "Laguna Cuellar", tipo: "agua" },
    ahora: { fill: "url(#estadio-cover)", galeria: "estadio", texto: "Estadio Félix Capriles", tipo: "lugar" },
  },
  sarco: {
    antes: { fill: "url(#sarco-cover)", galeria: "sarco", texto: "Laguna Sarco", tipo: "agua" },
    ahora: { fill: "url(#complejo-sarco-cover)", galeria: "complejoSarco", texto: "Complejo Deportivo Sarco", tipo: "lugar" },
  },
  cuadras: {
    antes: { fill: null, galeria: "cuadras", texto: "Laguna Cuadras", tipo: "agua" },
    ahora: { fill: "url(#estacion-teleferico-cover)", galeria: "teleferico", texto: "Estación Parque Teleférico", tipo: "lugar" },
  },
  quenamari: {
    antes: { fill: "url(#lag-quenamari-cover)", galeria: "quenamari", texto: "Laguna Quenamari", tipo: "agua" },
  },
};

/*
 * Etiquetas del mapa: punto de anclaje en coordenadas del mundo.
 * `cocha: true` indica que el punto está en coordenadas del mapa de
 * Cochabamba y se convierte al mundo.
 */
const ETIQUETAS = {
  cercado: { x: 183, y: 250, cocha: true, texto: "Cercado", tipo: "region" },
  rocha: { x: 319, y: 198, texto: "Río Rocha", tipo: "agua" },
  recoleta: { x: 285.9, y: 203.7, texto: "Recoleta", tipo: "lugar" },
  libertadores: { x: 274, y: 207, texto: "Av. Libertadores", tipo: "calle", rot: 75 },
  "juan-rosa": { x: 250, y: 203, texto: "Av. Juan de la Rosa", tipo: "calle", rot: 28 },
  cuellar: { x: 261, y: 223, lago: "cuellar" },
  quillacollo: { x: 261.6, y: 244, texto: "Puente Quillacollo", tipo: "lugar" },
  america: { x: 258, y: 203, texto: "Av. América", tipo: "calle", rot: 3 },
  "melchor-perez": { x: 243.5, y: 217, texto: "Av. Melchor Pérez", tipo: "calle", rot: -85 },
  sarco: { x: 240, y: 188, lago: "sarco" },
  belzu: { x: 309, y: 241, texto: "Av. Belzu", tipo: "calle", rot: 65 },
  "campus-umss": { x: 297, y: 237, texto: "UMSS", tipo: "edificio", rot: -10 },
  heroinas: { x: 280, y: 231, texto: "Av. Heroínas", tipo: "calle", rot: -10 },
  cuadras: { x: 305, y: 220, lago: "cuadras" },
  "cona-cona": { x: 196.4, y: 216.5, texto: "Laguna Coña Coña", tipo: "agua" },
  alalay: { x: 315, y: 281, texto: "Laguna Alalay", tipo: "agua" },
  quenamari: { x: 173, y: 324, texto: "Laguna Quenamari", tipo: "agua" },
  aeropuerto: { x: 245.2, y: 278, texto: "Aeropuerto", tipo: "edificio", rot: 40 },
  tamborada: { x: 252.1, y: 317.1, texto: "La Tamborada", tipo: "agua" },
};

/*
 * Escenas: una por cada paso del texto. Cada escena describe el estado
 * completo del mapa (declarativo), así se puede saltar a cualquier paso.
 *
 *  encuadre: ids de elementos que la cámara debe encuadrar
 *  minimo:   tamaño mínimo del encuadre (unidades del mundo)
 *  cocha:    { region, cercado } colores del mapa departamental
 *  detalle:  si se muestra el mapa del Cercado
 *  mostrar:  elementos del Cercado visibles
 *  ahora:    lagunas que muestran lo que hay hoy en su lugar
 *  etiquetas, ondas (laguna enfocada), dibujarRios
 */
const BASE_CERCADO = ["rio-rocha", "rio-tamborada", "p-recoleta", "p-quillacollo"];

const ESCENAS = [
  // La provincia de Cercado, tierra de lagunas
  {
    encuadre: ["cocha-region"],
    cocha: { region: "--map-land", cercado: "--map-water" },
    detalle: false,
    mostrar: [],
    etiquetas: ["cercado"],
  },
  // El morir y renacer de las lagunas ha cesado (el Cercado se seca)
  {
    encuadre: ["cocha-region"],
    cocha: { region: "--map-land", cercado: "--map-dry" },
    lento: true,
    detalle: false,
    mostrar: [],
    etiquetas: ["cercado"],
  },
  // Laguna Cuellar
  {
    encuadre: ["lag-cuellar", "p-recoleta", "p-quillacollo", "libertadores", "juan-rosa"],
    minimo: 64,
    cocha: { region: "--map-land", cercado: null },
    detalle: true,
    mostrar: [...BASE_CERCADO, "lag-cuellar", "libertadores", "juan-rosa"],
    etiquetas: ["recoleta", "quillacollo", "cuellar", "rocha", "tamborada", "libertadores", "juan-rosa"],
    ondas: "lag-cuellar",
  },
  // Estadio Félix Capriles
  {
    encuadre: ["lag-cuellar", "p-recoleta", "p-quillacollo", "libertadores", "juan-rosa"],
    minimo: 64,
    cocha: { region: "--map-land", cercado: null },
    detalle: true,
    mostrar: [...BASE_CERCADO, "lag-cuellar", "libertadores", "juan-rosa"],
    ahora: ["cuellar"],
    etiquetas: ["recoleta", "quillacollo", "cuellar", "rocha", "tamborada", "libertadores", "juan-rosa"],
  },
  // Laguna Sarco
  {
    encuadre: ["lag-sarco", "america", "melchor-perez"],
    minimo: 64,
    cocha: { region: "--map-land", cercado: null },
    detalle: true,
    mostrar: [...BASE_CERCADO, "lag-sarco", "america", "melchor-perez"],
    etiquetas: ["sarco", "america", "melchor-perez", "recoleta", "quillacollo", "rocha", "tamborada"],
    ondas: "lag-sarco",
  },
  // Gimnasio Polifuncional Sarco
  {
    encuadre: ["lag-sarco", "america", "melchor-perez"],
    minimo: 64,
    cocha: { region: "--map-land", cercado: null },
    detalle: true,
    mostrar: [...BASE_CERCADO, "lag-sarco", "america", "melchor-perez"],
    ahora: ["sarco"],
    etiquetas: ["sarco", "america", "melchor-perez", "recoleta", "quillacollo", "rocha", "tamborada"],
  },
  // Laguna Cuadras
  {
    encuadre: ["lag-cuadras", "heroinas", "belzu", "campus-umss"],
    minimo: 64,
    cocha: { region: "--map-land", cercado: null },
    detalle: true,
    mostrar: [...BASE_CERCADO, "lag-cuadras", "heroinas", "belzu", "campus-umss"],
    etiquetas: ["cuadras", "heroinas", "belzu", "quillacollo", "campus-umss"],
    ondas: "lag-cuadras",
  },
  // Estación del teleférico
  {
    encuadre: ["lag-cuadras", "heroinas", "belzu", "campus-umss"],
    minimo: 64,
    cocha: { region: "--map-land", cercado: null },
    detalle: true,
    mostrar: [...BASE_CERCADO, "lag-cuadras", "heroinas", "belzu", "campus-umss"],
    ahora: ["cuadras"],
    etiquetas: ["cuadras", "heroinas", "belzu", "quillacollo", "campus-umss"],
  },
  // Quedan tres lagunas
  {
    encuadre: ["lag-alalay", "lag-quenamari", "lag-cona-cona", "aeropuerto"],
    cocha: { region: "--map-land", cercado: null },
    detalle: true,
    mostrar: [...BASE_CERCADO, "lag-alalay", "lag-quenamari", "lag-cona-cona", "aeropuerto"],
    etiquetas: ["alalay", "cona-cona", "quenamari", "quillacollo", "tamborada", "recoleta", "rocha", "aeropuerto"],
    dibujarRios: true,
  },
  // Quenamari, la más preocupante
  {
    encuadre: ["lag-quenamari-circle"],
    minimo: 120,
    cocha: { region: "--map-land", cercado: null },
    detalle: true,
    mostrar: [...BASE_CERCADO, "lag-alalay", "lag-quenamari", "lag-cona-cona", "aeropuerto", "lag-quenamari-circle"],
    etiquetas: ["alalay", "cona-cona", "quenamari", "quillacollo", "tamborada", "recoleta", "rocha", "aeropuerto"],
    ondas: "lag-quenamari-circle",
  },
];
