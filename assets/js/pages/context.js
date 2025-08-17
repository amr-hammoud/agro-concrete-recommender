(async function () {
  UI.renderHeader("Context");

  // Load both datasets (for short link lookup tables)
  const [ctxData, typData] = await Promise.all([
    App.loadJSON("assets/data/countries.json"),
    App.loadJSON("assets/data/typology.json"),
  ]);
  const countries = ctxData.countries || [];
  const L = Short.buildLookup({ countries, typologiesTable: typData });

  const els = {
    country: document.getElementById("country"),
    climate: document.getElementById("climate"),
    agri: document.getElementById("agri"),
    food: document.getElementById("food"),
    cons: document.getElementById("cons"),
    next: document.getElementById("next"),
    stickyBack: document.getElementById("sticky-back"),
    stickyNext: document.getElementById("sticky-next"),
  };

  const params = new URLSearchParams(location.search);
  const sCode = params.get("s");

  // Prefer short link if present
  let state = sCode
    ? { ...App.State.get(), ...Short.decodeShort(sCode, L) }
    : App.State.syncFromURL();

  const options = (list = []) =>
    ['<option value="">-- Select --</option>']
      .concat(list.map((v) => `<option>${v}</option>`))
      .join("");

  // Populate country & dependents
  els.country.innerHTML = options(countries.map((c) => c.name).sort());
  function fillForCountry(name) {
    const c = countries.find((x) => x.name === name);
    els.climate.innerHTML = options(c?.climates);
    els.agri.innerHTML = options(c?.agriculture);
    els.food.innerHTML = options(c?.food_industries);
    els.cons.innerHTML = options(c?.construction_methods);
  }

  // Restore selections
  if (state.country) els.country.value = state.country;
  fillForCountry(els.country.value);
  if (state.climate) els.climate.value = state.climate;
  if (state.agri) els.agri.value = state.agri;
  if (state.food) els.food.value = state.food;
  if (state.cons) els.cons.value = state.cons;

  els.country.addEventListener("change", () =>
    fillForCountry(els.country.value)
  );

  function snapshot() {
    const s = {
      ...App.State.get(),
      country: els.country.value,
      climate: els.climate.value,
      agri: els.agri.value,
      food: els.food.value,
      cons: els.cons.value,
    };
    App.State.set(s);
    return s;
  }

  function refreshLinks() {
    const s = snapshot();
    const code = Short.encodeShort(s, L);

    const backHref = "index.html" + (code ? "?s=" + code : "");
    const nextHref = "typology.html" + (code ? "?s=" + code : "");

    // write compact URL for this page
    Short.writeURLWithCode(code);

    // sticky nav
    if (els.stickyBack) els.stickyBack.setAttribute("href", backHref);
    if (els.stickyNext) els.stickyNext.setAttribute("href", nextHref);

    // in-card next (visible on ≥sm only)
    els.next.setAttribute("href", nextHref);
  }

  ["change", "keyup"].forEach((evt) => {
    ["country", "climate", "agri", "food", "cons"].forEach((id) => {
      document.getElementById(id).addEventListener(evt, refreshLinks);
    });
  });

  refreshLinks();
})();
