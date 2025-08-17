(async function () {
  UI.renderHeader("Typology");

  const [ctxData, typData] = await Promise.all([
    App.loadJSON("assets/data/countries.json"),
    App.loadJSON("assets/data/typology.json"),
  ]);
  const countries = ctxData.countries || [];
  const L = Short.buildLookup({ countries, typologiesTable: typData });
  const typologies = L.typologies || [];

  const elTyp = document.getElementById("typology");
  const elComp = document.getElementById("component");
  const elBack = document.getElementById("back");
  const elNext = document.getElementById("next");
  const stickyBack = document.getElementById("sticky-back");
  const stickyNext = document.getElementById("sticky-next");

  const params = new URLSearchParams(location.search);
  const sCode = params.get("s");

  let restored = sCode ? Short.decodeShort(sCode, L) : App.State.syncFromURL();

  elTyp.innerHTML = ['<option value="">-- Select --</option>']
    .concat(typologies.map((v) => `<option>${v}</option>`))
    .join("");

  if (restored.typology) elTyp.value = restored.typology;
  if (restored.component) elComp.value = restored.component;

  function isValid() {
    return !!(elTyp.value && elComp.value);
  }

  function snapshot() {
    const s = {
      ...App.State.get(),
      typology: elTyp.value,
      component: elComp.value,
    };
    App.State.set(s);
    return s;
  }

  function refreshLinks() {
    const s = snapshot();
    const code = Short.encodeShort(s, L);
    const back = "context.html" + (code ? "?s=" + code : "");
    const next = "approach.html" + (code ? "?s=" + code : "");

    Short.writeURLWithCode(code);

    elBack.setAttribute("href", back);
    if (stickyBack) {
      stickyBack.setAttribute("href", back);
      stickyBack.classList.remove("is-disabled");
    }

    if (isValid()) {
      elNext.setAttribute("href", next);
      elNext.classList.remove("is-disabled");
      if (stickyNext) {
        stickyNext.setAttribute("href", next);
        stickyNext.classList.remove("is-disabled");
      }
    } else {
      elNext.removeAttribute("href");
      elNext.classList.add("is-disabled");
      if (stickyNext) {
        stickyNext.removeAttribute("href");
        stickyNext.classList.add("is-disabled");
      }
    }
  }

  ["change", "keyup"].forEach((evt) => {
    [elTyp, elComp].forEach((el) => el.addEventListener(evt, refreshLinks));
  });
  refreshLinks();
})();
