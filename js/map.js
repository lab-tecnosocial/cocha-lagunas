/*
 * Mapa del recorrido.
 *
 * - Un único SVG con dos capas: el departamento de Cochabamba y la provincia
 *   Cercado, unidas en el mismo sistema de coordenadas. La "cámara" es el
 *   viewBox del SVG, así el zoom de Cochabamba al Cercado es continuo y nítido.
 * - Los desplazamientos de cámara usan el zoom suave de van Wijk & Nuij
 *   (el mismo que d3.interpolateZoom): se aleja y se acerca con naturalidad.
 * - Cada escena es declarativa (ver ESCENAS en data.js): ir a una escena
 *   lleva el mapa a ese estado desde cualquier otro, sin importar el orden.
 * - Las etiquetas son HTML proyectado sobre el SVG para que su tamaño sea
 *   constante mientras la cámara se mueve.
 */

/* global gsap, COCHA_A_MUNDO, LAGOS, ETIQUETAS, ESCENAS */
/* eslint-disable no-unused-vars */

const Mapa = (() => {
  const contenedor = document.querySelector(".mapa");
  const svg = document.getElementById("mapa");
  const capaEtiquetas = contenedor.querySelector(".mapa__etiquetas");
  const capaCocha = document.getElementById("capa-cocha");
  const capaCercado = document.getElementById("capa-cercado");
  const detalle = document.getElementById("cercado-detalle");
  const cochaRegion = document.getElementById("cocha-region");
  const cochaCercado = document.getElementById("cocha-cercado");
  const ondas = document.getElementById("ondas");
  const rios = [...document.querySelectorAll("#rios path")];
  const pista = contenedor.querySelector(".mapa__pista");

  const movimientoReducido = matchMedia("(prefers-reduced-motion: reduce)");
  const escritorio = matchMedia("(min-width: 900px)");

  const estilos = getComputedStyle(document.documentElement);
  const color = (variable) => estilos.getPropertyValue(variable).trim();

  /* Cochabamba → mundo (coordenadas del Cercado) */
  const { s: cs, tx: ctx, ty: cty } = COCHA_A_MUNDO;
  capaCocha.setAttribute("transform", `translate(${ctx} ${cty}) scale(${cs})`);
  const cochaAMundo = (x, y) => [x * cs + ctx, y * cs + cty];

  /* Todos los elementos del Cercado que alguna escena muestra u oculta */
  const alternables = [...new Set(ESCENAS.flatMap((e) => e.mostrar))].map(
    (id) => document.getElementById(id)
  );

  /* Estado */
  let ancho = 1;
  let alto = 1;
  let vista = null; // [cx, cy, w]: centro del área útil y ancho de pantalla en unidades del mundo
  let actual = -1;
  let tweenCamara = null;
  let tweenRios = null;
  let llamadaEtiquetas = null;
  const estadoLagos = { cuellar: "antes", sarco: "antes", cuadras: "antes", quenamari: "antes" };

  /*
   * Área útil de la pantalla para encuadrar (fracciones del contenedor).
   * En escritorio el texto ocupa la columna izquierda; en móvil, la parte
   * inferior.
   */
  const areaUtil = () =>
    escritorio.matches
      ? { x0: 0.42, y0: 0.1, x1: 0.95, y1: 0.9 }
      : { x0: 0.06, y0: 0.08, x1: 0.94, y1: 0.6 };

  /*
   * Zoom suave (van Wijk & Nuij, "Smooth and efficient zooming and panning").
   * Adaptado de d3-interpolate (ISC).
   */
  const interpolarZoom = (p0, p1, rho = Math.SQRT2) => {
    const rho2 = rho * rho;
    const rho4 = rho2 * rho2;
    const [ux0, uy0, w0] = p0;
    const [ux1, uy1, w1] = p1;
    const dx = ux1 - ux0;
    const dy = uy1 - uy0;
    const d2 = dx * dx + dy * dy;
    let interp;
    let S;

    if (d2 < 1e-12) {
      S = Math.log(w1 / w0) / rho;
      interp = (t) => [ux0 + t * dx, uy0 + t * dy, w0 * Math.exp(rho * t * S)];
    } else {
      const d1 = Math.sqrt(d2);
      const b0 = (w1 * w1 - w0 * w0 + rho4 * d2) / (2 * w0 * rho2 * d1);
      const b1 = (w1 * w1 - w0 * w0 - rho4 * d2) / (2 * w1 * rho2 * d1);
      const r0 = Math.log(Math.sqrt(b0 * b0 + 1) - b0);
      const r1 = Math.log(Math.sqrt(b1 * b1 + 1) - b1);
      S = (r1 - r0) / rho;
      interp = (t) => {
        const s = t * S;
        const coshr0 = Math.cosh(r0);
        const u =
          (w0 / (rho2 * d1)) *
          (coshr0 * Math.tanh(rho * s + r0) - Math.sinh(r0));
        return [ux0 + u * dx, uy0 + u * dy, (w0 * coshr0) / Math.cosh(rho * s + r0)];
      };
    }
    interp.duracion = Math.abs(S) * rho / Math.SQRT2; // en segundos (aprox.)
    return interp;
  };

  /* Caja de un elemento en coordenadas del mundo */
  const cajas = new Map();
  const cajaMundo = (id) => {
    if (cajas.has(id)) return cajas.get(id);
    const el = document.getElementById(id);
    const b = el.getBBox();
    const m = capaCercado.getScreenCTM().inverse().multiply(el.getScreenCTM());
    const p = svg.createSVGPoint();
    const xs = [];
    const ys = [];
    for (const [x, y] of [
      [b.x, b.y],
      [b.x + b.width, b.y],
      [b.x, b.y + b.height],
      [b.x + b.width, b.y + b.height],
    ]) {
      p.x = x;
      p.y = y;
      const q = p.matrixTransform(m);
      xs.push(q.x);
      ys.push(q.y);
    }
    const caja = {
      x0: Math.min(...xs),
      y0: Math.min(...ys),
      x1: Math.max(...xs),
      y1: Math.max(...ys),
    };
    cajas.set(id, caja);
    return caja;
  };

  /* Vista que encuadra los elementos de una escena en el área útil */
  const vistaDeEscena = (escena) => {
    const cs = escena.encuadre.map(cajaMundo);
    const x0 = Math.min(...cs.map((c) => c.x0));
    const y0 = Math.min(...cs.map((c) => c.y0));
    const x1 = Math.max(...cs.map((c) => c.x1));
    const y1 = Math.max(...cs.map((c) => c.y1));
    const relleno = escena.relleno ?? 1.25;
    const minimo = escena.minimo ?? 0;
    const bw = Math.max(x1 - x0, minimo) * relleno;
    const bh = Math.max(y1 - y0, minimo) * relleno;
    const a = areaUtil();
    const escala = Math.min(((a.x1 - a.x0) * ancho) / bw, ((a.y1 - a.y0) * alto) / bh);
    return [(x0 + x1) / 2, (y0 + y1) / 2, ancho / escala];
  };

  /* viewBox a partir de una vista */
  const cajaDeVista = ([cx, cy, w]) => {
    const a = areaUtil();
    const escala = ancho / w; // px por unidad
    const ax = (a.x0 + a.x1) / 2;
    const ay = (a.y0 + a.y1) / 2;
    return [cx - (ax * ancho) / escala, cy - (ay * alto) / escala, ancho / escala, alto / escala];
  };

  /*
   * Etiquetas
   */
  const etiquetas = Object.entries(ETIQUETAS).map(([id, def]) => {
    const el = document.createElement("span");
    const [x, y] = def.cocha ? cochaAMundo(def.x, def.y) : [def.x, def.y];
    capaEtiquetas.appendChild(el);
    const etiqueta = { id, def, el, x, y, activa: false, oculta: false };
    pintarEtiqueta(etiqueta);
    return etiqueta;
  });
  const etiquetaPorId = new Map(etiquetas.map((e) => [e.id, e]));

  function pintarEtiqueta(etiqueta) {
    const { def, el } = etiqueta;
    const info = def.lago ? LAGOS[def.lago][estadoLagos[def.lago]] : def;
    el.textContent = info.texto;
    el.className = `etiqueta etiqueta--${info.tipo}`;
  }

  /* Dibuja la vista actual: viewBox, grosor de trazos y etiquetas */
  const dibujar = () => {
    if (!vista) return;
    const [vx, vy, vw, vh] = cajaDeVista(vista);
    svg.setAttribute("viewBox", `${vx} ${vy} ${vw} ${vh}`);
    svg.style.setProperty("--u", `${vw / ancho}px`);

    const k = ancho / vw;
    for (const e of etiquetas) {
      const px = (e.x - vx) * k;
      const py = (e.y - vy) * k;
      const dentro = px > -50 && px < ancho + 50 && py > -20 && py < alto + 20;
      const visible = e.activa && !e.oculta && !e.retenida && dentro;
      e.el.classList.toggle("visible", visible);
      if (visible || e.el.style.transform === "") {
        e.el.style.transform = `translate(${px.toFixed(1)}px, ${py.toFixed(1)}px) translate(-50%, -50%) rotate(${e.def.rot ?? 0}deg)`;
      }
    }
  };

  /* Nombre accesible y tooltip nativo de cada laguna con fotos */
  function rotularLago(lago) {
    const grupo = document.querySelector(`[data-lake="${lago}"]`);
    const rotulo = `Ver fotos: ${LAGOS[lago][estadoLagos[lago]].texto}`;
    grupo.setAttribute("aria-label", rotulo);
    let titulo = grupo.querySelector("title");
    if (!titulo) {
      titulo = document.createElementNS("http://www.w3.org/2000/svg", "title");
      grupo.prepend(titulo);
    }
    titulo.textContent = rotulo;
  }
  Object.keys(estadoLagos).forEach(rotularLago);

  /* Cambia una laguna entre "antes" y "ahora" */
  const cambiarLago = (lago, estado, animar) => {
    if (estadoLagos[lago] === estado) return;
    estadoLagos[lago] = estado;
    const grupo = document.querySelector(`[data-lake="${lago}"]`);
    const circulo = grupo.querySelector("circle");
    const info = LAGOS[lago][estado];
    const etiqueta = etiquetaPorId.get(lago);

    const aplicar = () => {
      circulo.classList.toggle("sin-foto", !info.fill);
      if (info.fill) circulo.setAttribute("fill", info.fill);
      else circulo.removeAttribute("fill");
      rotularLago(lago);
      if (etiqueta) {
        pintarEtiqueta(etiqueta);
        etiqueta.oculta = false;
        dibujar();
      }
    };

    gsap.killTweensOf(grupo, "scale");
    if (!animar) {
      aplicar();
      gsap.set(grupo, { scale: 1, transformOrigin: "50% 50%" });
      return;
    }
    if (etiqueta) {
      etiqueta.oculta = true;
      dibujar();
    }
    gsap
      .timeline()
      .to(grupo, { scale: 0, transformOrigin: "50% 50%", duration: 0.45, ease: "power2.in" })
      .call(aplicar)
      .to(grupo, { scale: 1, duration: 0.7, ease: "back.out(2)" }, "+=0.25");
  };

  /* Ondas de agua alrededor de la laguna enfocada */
  const colocarOndas = (id) => {
    if (!id) {
      ondas.classList.remove("activo");
      return;
    }
    const c = document.querySelector(`#${id} circle`);
    for (const onda of ondas.children) {
      onda.setAttribute("cx", c.getAttribute("cx"));
      onda.setAttribute("cy", c.getAttribute("cy"));
      onda.setAttribute("r", c.getAttribute("r"));
    }
    ondas.classList.remove("activo");
    // reinicia la animación
    void ondas.getBoundingClientRect();
    ondas.classList.add("activo");
  };

  /* Dibuja los ríos, como si el agua volviera a correr */
  const dibujarRios = (animar) => {
    tweenRios?.kill();
    if (!animar) {
      rios.forEach((r) => {
        r.classList.remove("dibujando");
        r.style.strokeDashoffset = "";
      });
      return;
    }
    rios.forEach((r) => r.classList.add("dibujando"));
    tweenRios = gsap.fromTo(
      rios,
      { strokeDashoffset: 1 },
      {
        strokeDashoffset: 0,
        duration: 3.2,
        ease: "none",
        stagger: 1.4,
        delay: 0.6,
        onComplete: () => dibujarRios(false),
      }
    );
  };

  /*
   * Ir a una escena
   */
  const ir = (indice, { inmediato = false } = {}) => {
    if (indice === actual) return;
    const anterior = actual;
    actual = indice;
    const escena = ESCENAS[indice];
    const instantaneo = inmediato || movimientoReducido.matches || !vista;
    const t = instantaneo ? 0 : 1;

    // Cámara
    const destino = vistaDeEscena(escena);
    tweenCamara?.kill();
    let duracionCamara = 0;
    if (instantaneo) {
      vista = destino;
      dibujar();
    } else {
      const interp = interpolarZoom(vista, destino);
      duracionCamara = gsap.utils.clamp(0.9, 2.6, interp.duracion * 0.9);
      const progreso = { t: 0 };
      tweenCamara = gsap.to(progreso, {
        t: 1,
        duration: duracionCamara,
        ease: "power2.inOut",
        onUpdate: () => {
          vista = interp(progreso.t);
          dibujar();
        },
      });
    }

    // Mapa departamental
    gsap.to(cochaRegion, { fill: color(escena.cocha.region), duration: 0.9 * t, ease: "power1.inOut" });
    if (escena.cocha.cercado) {
      gsap.to(cochaCercado, {
        fill: color(escena.cocha.cercado),
        autoAlpha: 1,
        duration: (escena.lento ? 2 : 0.9) * t,
        ease: "power1.inOut",
      });
    } else {
      gsap.to(cochaCercado, { autoAlpha: 0, duration: 0.6 * t });
    }
    gsap.to(capaCocha, { opacity: escena.detalle ? 0.45 : 1, duration: 0.8 * t });

    // Mapa del Cercado
    gsap.to(capaCercado, {
      autoAlpha: escena.detalle ? 1 : 0,
      duration: 0.8 * t,
      delay: escena.detalle ? 0.35 * duracionCamara : 0,
    });
    gsap.set(detalle, { autoAlpha: 1 });
    for (const el of alternables) {
      const visible = escena.mostrar.includes(el.id);
      gsap.to(el, {
        autoAlpha: visible ? 1 : 0,
        duration: 0.6 * t,
        delay: visible ? 0.55 * duracionCamara : 0,
        overwrite: "auto",
      });
    }

    // Lagunas: antes / ahora
    for (const lago of Object.keys(estadoLagos)) {
      if (!LAGOS[lago].ahora) continue;
      const estado = escena.ahora?.includes(lago) ? "ahora" : "antes";
      const visibleAntes = anterior >= 0 && ESCENAS[anterior].mostrar.includes(`lag-${lago}`);
      cambiarLago(lago, estado, !instantaneo && visibleAntes && escena.mostrar.includes(`lag-${lago}`));
    }

    // Etiquetas: las nuevas esperan a que la cámara casi llegue a destino
    llamadaEtiquetas?.kill();
    const previas = anterior >= 0 ? ESCENAS[anterior].etiquetas : [];
    for (const e of etiquetas) {
      e.activa = escena.etiquetas.includes(e.id);
      e.retenida = !instantaneo && e.activa && !previas.includes(e.id);
    }
    dibujar();
    if (!instantaneo) {
      llamadaEtiquetas = gsap.delayedCall(duracionCamara * 0.8, () => {
        etiquetas.forEach((e) => (e.retenida = false));
        dibujar();
      });
    }

    // Pista "toca las lagunas" cuando hay una laguna con fotos a la vista
    pista.classList.toggle(
      "visible",
      escena.mostrar.some((id) => document.getElementById(id).classList.contains("lago-foto"))
    );

    // Ondas y ríos
    colocarOndas(escena.ondas);
    if (escena.dibujarRios && !instantaneo && anterior < indice) dibujarRios(true);
    else if (!escena.dibujarRios) dibujarRios(false);
  };

  /* Tamaño del contenedor */
  const medir = () => {
    ancho = contenedor.clientWidth || 1;
    alto = contenedor.clientHeight || 1;
    if (actual >= 0) {
      tweenCamara?.kill();
      vista = vistaDeEscena(ESCENAS[actual]);
    }
    dibujar();
  };

  new ResizeObserver(medir).observe(contenedor);
  escritorio.addEventListener("change", medir);
  ancho = contenedor.clientWidth || 1;
  alto = contenedor.clientHeight || 1;

  /* Estado inicial de los elementos */
  gsap.set(alternables, { autoAlpha: 0 });
  gsap.set(capaCercado, { autoAlpha: 0 });
  gsap.set(cochaCercado, { autoAlpha: 0 });

  /* Precalcula los encuadres antes de que haya transformaciones en curso */
  ESCENAS.forEach((e) => e.encuadre.forEach(cajaMundo));

  return {
    ir,
    get actual() {
      return actual;
    },
    galeriaDeLago: (lago) => LAGOS[lago][estadoLagos[lago]].galeria,
  };
})();
