(async function () {
  UI.renderHeader("Typology");

  // Load both datasets (typologies are in typology.json)
  const [ctxData, typData] = await Promise.all([
    App.loadJSON("assets/data/countries.json"),
    App.loadJSON("assets/data/typology.json"),
  ]);

  const countries = ctxData.countries || [];
  const L = Short.buildLookup({ countries, typologiesTable: typData });

  const elTyp = document.getElementById("typology");
  const elComp = document.getElementById("component");
  const elBack = document.getElementById("back");
  const elNext = document.getElementById("next");
  const stickyBack = document.getElementById("sticky-back");
  const stickyNext = document.getElementById("sticky-next");

  const params = new URLSearchParams(location.search);
  const sCode = params.get("s");

  // Restore from shortlink if present; fall back to URL/LocalStorage legacy
  const restored = sCode
    ? Short.decodeShort(sCode, L)
    : App.State.syncFromURL();

  // Populate Typology options (unique list)
  const typologies = [
    ...new Set((typData.typologies || []).map((t) => t.typology)),
  ]
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));
  elTyp.innerHTML = ['<option value="">-- Select --</option>']
    .concat(typologies.map((v) => `<option>${v}</option>`))
    .join("");

  // Restore values
  if (restored.typology) elTyp.value = restored.typology;
  if (restored.component) elComp.value = restored.component;

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
    if (stickyBack) stickyBack.setAttribute("href", back);

    elNext.setAttribute("href", next);
    if (stickyNext) stickyNext.setAttribute("href", next);
  }

  ["change", "keyup"].forEach((evt) => {
    [elTyp, elComp].forEach((el) => el.addEventListener(evt, refreshLinks));
  });

  refreshLinks();
})();
