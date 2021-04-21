class Caption {
  static list = new Map();

  constructor(text = "", elementId = "", isAvenida = false) {
    this.text = text;
    this.elementId = elementId;
    this.isAvenida = isAvenida;
    let x, y;
    ({ x, y } = this.getElementPosition(elementId, this.isAvenida));

    this.div = document.createElement("div");

    this.captionId = this.elementId;
    if (this.captionId.includes("cercado-svg-caption"))
      this.captionId = this.captionId.replace("cercado-svg-", "");
    else if (this.captionId.includes("cocha-svg-caption"))
      this.captionId = this.captionId.replace("cocha-svg-", "");
    else this.captionId = "caption-" + this.captionId;
    this.div.setAttribute("id", this.captionId);
    this.div.classList.add("caption");
    this.div.classList.add("hidden");
    if (this.isAvenida) this.div.classList.add("avenida");
    this.setPosition(x, y, this.isAvenida);
    this.div.appendChild(document.createTextNode(text));
    this.add();
    Caption.list.set(this.captionId, this);
  }

  getElementPosition(elementId, isAvenida) {
    const element = document.getElementById(elementId);
    let x, y, right, bottom;
    ({ x, y, right, bottom } = element.getBoundingClientRect());
    if (isAvenida) return { x: right, y: bottom };
    return { x, y };
  }

  setPosition(posX, posY, isAvenida) {
    this.posX = posX;
    this.posY = posY;
    this.div.style.left = this.posX + "px";
    this.div.style.top = this.posY + "px";
  }

  add() {
    document.body.appendChild(this.div);
  }

  show() {
    this.div.classList.remove("hidden");
  }

  hide() {
    this.div.classList.add("hidden");
  }

  static purge() {
    Caption.list.forEach((caption) => caption.div.remove());
    Caption.list = new Map();
  }

  static updateAllPositions() {
    Caption.list.forEach((caption) => {
      const { x, y } = caption.getElementPosition(caption.elementId);
      caption.setPosition(x, y);
    });
  }

  static getCaption(captionId) {
    if (!Caption.list.has(captionId))
      console.error(`Caption id ${captionId} does not exist`);
    return Caption.list.get(captionId);
  }

  static hideAllCaptions() {
    Caption.list.forEach((caption) => {
      caption.div.classList.add("hidden");
    });
  }

  static showAllCaptions() {
    Caption.list.forEach((caption) => {
      caption.div.classList.remove("hidden");
    });
  }

  static init() {
    Caption.purge();
    const captionCochaSvg = [
      {
        id: "cocha-svg-caption-cercado",
        text: "Cercado",
        translate: "translate(-30%,-180%)",
      },
    ];
    const captionCercadoSvg = [
      {
        id: "cercado-svg-caption-rocha",
        text: "Río Rocha",
        translate: "translate(-40%, -170%)",
      },
      { id: "cercado-svg-caption-tamborada", text: "La Tamborada" },
      {
        id: "cercado-svg-caption-cuellar",
        text: "Laguna Cuellar",
        translate: "translate(-50%, -280%)",
      },
      {
        id: "cercado-svg-caption-quenamari",
        text: "Laguna Quenamari",
        translate: "translate(-50%, -80%)",
      },
      {
        id: "cercado-svg-caption-alalay",
        text: "Laguna Alalay",
        translate: "translate(-50%, -80%)",
      },
      {
        id: "cercado-svg-caption-cona-cona",
        text: "Laguna Coña Coña",
        translate: "translate(-50%, -150%)",
      },
      {
        id: "cercado-svg-caption-quillacollo",
        text: "Puente Quillacollo",
        translate: "translate(-50%, -70%)",
      },
      { id: "cercado-svg-caption-recoleta", text: "Recoleta" },
      {
        id: "cercado-svg-caption-cuadras",
        text: "Laguna Cuadras",
        translate: "translate(-50%,-200%)",
      },
      {
        id: "cercado-svg-caption-sarco",
        text: "Laguna Sarco",
        translate: "translate(-70%, -200%)",
      },
      {
        id: "america",
        text: "Av. América",
        translate:
          "translate(100%, -130%)  rotate(3deg)" /*"translate(120%, 0%) rotate(3deg)",*/,
        isAvenida: true,
      },
      {
        id: "melchor-perez",
        text: "Av. Melchor Pérez",
        translate:
          "translate(-65%, 500%) rotate(-85deg)" /*"translate(-65%, 650%) rotate(-85deg)",*/,

        isAvenida: true,
      },
      {
        id: "heroinas",
        text: "Av. Heroínas",
        translate: "translate(20%, -70%) rotate(-10deg)",

        isAvenida: true,
      },
      {
        id: "belzu",
        text: "Av. Belzu",
        translate: "translate(10%, 350%) rotate(65deg)",
        isAvenida: true,
      },
      {
        id: "campus-umss",
        text: "UMSS",
        translate:
          "translate(0%, -60%) rotate(-10deg)" /*"translate(20%, -30%) rotate(-10deg)",*/,
        isAvenida: true,
      },
    ];

    captionCochaSvg.forEach(
      ({ id, text, translate = "", isAvenida = false }) => {
        const caption = new Caption(text, id);
        if (translate) caption.div.style.transform = translate;
      }
    );
    captionCercadoSvg.forEach(
      ({ id, text, translate = "", isAvenida = false }) => {
        const caption = new Caption(text, id, isAvenida);
        if (translate) caption.div.style.transform = translate;
      }
    );
  }
}
