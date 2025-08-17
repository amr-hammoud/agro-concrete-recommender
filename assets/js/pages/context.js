(async function () {
  UI.renderHeader("Context");

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

  let state = sCode
    ? { ...App.State.get(), ...Short.decodeShort(sCode, L) }
    : App.State.syncFromURL();

  const options = (list = []) =>
    ['<option value="">-- Select --</option>']
      .concat(list.map((v) => `<option>${v}</option>`))
      .join("");

  els.country.innerHTML = options(countries.map((c) => c.name).sort());

  function populateForCountry(name) {
    const c = countries.find((x) => x.name === name);
    els.climate.innerHTML = options(c?.climates);
    els.agri.innerHTML = options(c?.agriculture);
    els.food.innerHTML = options(c?.food_industries);
    els.cons.innerHTML = options(c?.construction_methods);
  }

  if (state.country) els.country.value = state.country;
  populateForCountry(els.country.value);
  if (state.climate) els.climate.value = state.climate;
  if (state.agri) els.agri.value = state.agri;
  if (state.food) els.food.value = state.food;
  if (state.cons) els.cons.value = state.cons;

  els.country.addEventListener("change", () =>
    populateForCountry(els.country.value)
  );

  function current() {
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

  function isValid() {
    const s = current();
    return !!(s.country && s.climate && s.agri && s.food && s.cons);
  }

  function refreshLinks() {
    const s = current();
    const code = Short.encodeShort(s, L);
    const backHref = "index.html" + (code ? "?s=" + code : "");
    const nextHref = "typology.html" + (code ? "?s=" + code : "");

    Short.writeURLWithCode(code);

    if (els.stickyBack) {
      els.stickyBack.setAttribute("href", backHref);
      els.stickyBack.classList.remove("is-disabled");
    }

    if (isValid()) {
      els.next.setAttribute("href", nextHref);
      els.next.classList.remove("is-disabled");
      if (els.stickyNext) {
        els.stickyNext.setAttribute("href", nextHref);
        els.stickyNext.classList.remove("is-disabled");
      }
    } else {
      els.next.removeAttribute("href");
      els.next.classList.add("is-disabled");
      if (els.stickyNext) {
        els.stickyNext.removeAttribute("href");
        els.stickyNext.classList.add("is-disabled");
      }
    }
  }

  ["change", "keyup"].forEach((evt) => {
    ["country", "climate", "agri", "food", "cons"].forEach((id) => {
      document.getElementById(id).addEventListener(evt, refreshLinks);
    });
  });

  refreshLinks();
})();
