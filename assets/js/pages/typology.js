(async function () {
  UI.renderHeader("Typology");

  // We no longer need typology.json here—component only
  const ctxData = await App.loadJSON("assets/data/countries.json");
  const typData = await App.loadJSON("assets/data/typology.json"); // still load to preserve short link structure
  const countries = ctxData.countries || [];
  const L = Short.buildLookup({ countries, typologiesTable: typData });

  const elComp = document.getElementById("component");
  const elBack = document.getElementById("back");
  const elNext = document.getElementById("next");
  const stickyBack = document.getElementById("sticky-back");
  const stickyNext = document.getElementById("sticky-next");

  const params = new URLSearchParams(location.search);
  const sCode = params.get("s");

  // Restore (typology may exist from old links; we’ll ignore it here but keep it in short code as-is)
  const restored = sCode
    ? Short.decodeShort(sCode, L)
    : App.State.syncFromURL();
  if (restored.component) elComp.value = restored.component;

  function snapshot() {
    const s = { ...App.State.get(), component: elComp.value };
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
    [elComp].forEach((el) => el.addEventListener(evt, refreshLinks));
  });
  refreshLinks();
})();
