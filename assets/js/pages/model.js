(async function () {
  // Load countries to populate Country/Climate
  const ctxData = await App.loadJSON("assets/data/countries.json");
  const typData = await App.loadJSON("assets/data/typology.json");
  const countries = ctxData.countries || [];
  const L = Short.buildLookup({ countries, typologiesTable: typData });

  // Restore country/climate/component from short link if present
  const params = new URLSearchParams(location.search);
  const sCode = params.get("s");
  const restored = sCode
    ? Short.decodeShort(sCode, L)
    : App.State.syncFromURL();
  const state = {
    ...App.State.get(),
    ...restored,
    model: App.State.get().model || {},
  };
  App.State.set(state);

  // Wire Home link with ?s=
  const code = Short.encodeShort(state, L);
  const suffix = code ? "?s=" + code : "";
  const home = document.getElementById("home");
  if (home) home.setAttribute("href", "index.html" + suffix);

  // DOM refs
  const els = {
    country: document.getElementById("vm-country"),
    climate: document.getElementById("vm-climate"),
    typology: document.getElementById("vm-typology"),
    component: document.getElementById("vm-component"),

    length: document.getElementById("vm-length"),
    width: document.getElementById("vm-width"),
    height: document.getElementById("vm-height"),
    floor: document.getElementById("vm-floor"),
    totalFloors: document.getElementById("vm-total-floors"),

    doorsCount: document.getElementById("vm-doors-count"),
    doorsSize: document.getElementById("vm-doors-size"),
    doorsLocation: document.getElementById("vm-doors-location"),

    windowsCount: document.getElementById("vm-windows-count"),
    windowsSize: document.getElementById("vm-windows-size"),
    windowsSill: document.getElementById("vm-windows-sill"),
    windowsLintel: document.getElementById("vm-windows-lintel"),
    windowsLocation: document.getElementById("vm-windows-location"),

    density: document.getElementById("vm-density"),
    conductivity: document.getElementById("vm-conductivity"),
    specHeat: document.getElementById("vm-spec-heat"),
    vapor: document.getElementById("vm-vapor"),
    fire: document.getElementById("vm-fire"),
    notes: document.getElementById("vm-notes"),

    launch: document.getElementById("vm-launch"),
  };

  // Populate country + climate
  const options = (list = []) =>
    ['<option value="">-- Select --</option>']
      .concat(list.map((v) => `<option>${v}</option>`))
      .join("");
  els.country.innerHTML = options(countries.map((c) => c.name).sort());

  function fillForCountry(name) {
    const c = countries.find((x) => x.name === name);
    els.climate.innerHTML = options(c?.climates || []);
  }

  // Restore previously saved values
  if (state.country) els.country.value = state.country;
  fillForCountry(els.country.value);
  if (state.climate) els.climate.value = state.climate;

  // From State.model (if any)
  const m = state.model || {};
  els.typology.value = m.typology || "";
  els.component.value = m.component || "";

  els.length.value = m.length ?? "";
  els.width.value = m.width ?? "";
  els.height.value = m.height ?? "";
  els.floor.value = m.floor ?? "";
  els.totalFloors.value = m.totalFloors ?? "";

  els.doorsCount.value = m.doorsCount ?? "";
  els.doorsSize.value = m.doorsSize ?? "";
  els.doorsLocation.value = m.doorsLocation ?? "";

  els.windowsCount.value = m.windowsCount ?? "";
  els.windowsSize.value = m.windowsSize ?? "";
  els.windowsSill.value = m.windowsSill ?? "";
  els.windowsLintel.value = m.windowsLintel ?? "";
  els.windowsLocation.value = m.windowsLocation ?? "";

  els.density.value = m.density ?? "";
  els.conductivity.value = m.conductivity ?? "";
  els.specHeat.value = m.specHeat ?? "";
  els.vapor.value = m.vapor ?? "";
  els.fire.value = m.fire ?? "";
  els.notes.value = m.notes ?? "";

  // Event handlers
  els.country.addEventListener("change", () => {
    fillForCountry(els.country.value);
    persist();
  });
  [els.climate, els.typology, els.component].forEach((el) =>
    el.addEventListener("change", persist)
  );
  [
    els.length,
    els.width,
    els.height,
    els.floor,
    els.totalFloors,
    els.doorsCount,
    els.doorsSize,
    els.doorsLocation,
    els.windowsCount,
    els.windowsSize,
    els.windowsSill,
    els.windowsLintel,
    els.windowsLocation,
    els.density,
    els.conductivity,
    els.specHeat,
    els.vapor,
    els.fire,
    els.notes,
  ].forEach((el) => el.addEventListener("input", persist));

  function persist() {
    const snap = {
      ...App.State.get(),
      country: els.country.value,
      climate: els.climate.value,
      model: {
        typology: els.typology.value,
        component: els.component.value,

        length: els.length.value,
        width: els.width.value,
        height: els.height.value,
        floor: els.floor.value,
        totalFloors: els.totalFloors.value,

        doorsCount: els.doorsCount.value,
        doorsSize: els.doorsSize.value,
        doorsLocation: els.doorsLocation.value,

        windowsCount: els.windowsCount.value,
        windowsSize: els.windowsSize.value,
        windowsSill: els.windowsSill.value,
        windowsLintel: els.windowsLintel.value,
        windowsLocation: els.windowsLocation.value,

        density: els.density.value,
        conductivity: els.conductivity.value,
        specHeat: els.specHeat.value,
        vapor: els.vapor.value,
        fire: els.fire.value,
        notes: els.notes.value,
      },
    };
    App.State.set(snap);

    // keep short link updated with context + component (others are in LocalStorage)
    const code = Short.encodeShort(snap, L);
    Short.writeURLWithCode(code);

    // update Home link
    const suffix = code ? "?s=" + code : "";
    if (home) home.setAttribute("href", "index.html" + suffix);
  }

  // Launch (no-op, by design)
  els.launch.addEventListener("click", () => {
    if (window.UI && UI.toast) {
      UI.toast("Simulation launch is not implemented yet");
    } else {
        UI.toast("Simulation launch is not implemented yet");
    //   alert("Simulation launch is not implemented yet");
    }
  });
})();
