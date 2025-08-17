(async function () {
  const data = await App.loadJSON("assets/data/countries.json");
  const countries = data.countries || [];

  UI.renderHeader("Context");

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

  let saved = App.State.syncFromURL();

  const options = (list = []) =>
    ['<option value="">-- Select --</option>']
      .concat(list.map((v) => `<option>${v}</option>`))
      .join("");

  els.country.innerHTML = options(countries.map((c) => c.name).sort());

  function populateFor(name) {
    const c = countries.find((x) => x.name === name);
    els.climate.innerHTML = options(c?.climates);
    els.agri.innerHTML = options(c?.agriculture);
    els.food.innerHTML = options(c?.food_industries);
    els.cons.innerHTML = options(c?.construction_methods);
  }

  // restore
  if (saved.country) els.country.value = saved.country;
  populateFor(els.country.value);
  if (saved.climate) els.climate.value = saved.climate;
  if (saved.agri) els.agri.value = saved.agri;
  if (saved.food) els.food.value = saved.food;
  if (saved.cons) els.cons.value = saved.cons;

  els.country.addEventListener("change", () => populateFor(els.country.value));

  function snapshot() {
    return {
      country: els.country.value,
      climate: els.climate.value,
      agri: els.agri.value,
      food: els.food.value,
      cons: els.cons.value,
      typology: saved.typology,
      component: saved.component,
      arch: saved.arch,
      industrial: saved.industrial,
    };
  }

  function isValid() {
    return !!(
      els.country.value &&
      els.climate.value &&
      els.agri.value &&
      els.food.value &&
      els.cons.value
    );
  }

  function setNext(href, enabled) {
    if (enabled) {
      els.next.setAttribute("href", href);
      els.next.classList.remove("is-disabled");
      if (els.stickyNext) {
        els.stickyNext.setAttribute("href", href);
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

  function refresh() {
    const snap = snapshot();
    App.State.set(snap);
    App.State.pushToURL(snap);
    const q = App.State.toQuery(snap);
    const nextHref = "typology.html" + (q ? "?" + q : "");
    const backHref = "index.html" + (q ? "?" + q : "");

    // sticky back always enabled
    if (els.stickyBack) {
      els.stickyBack.setAttribute("href", backHref);
      els.stickyBack.classList.remove("is-disabled");
    }

    setNext(nextHref, isValid());
  }

  ["change", "keyup"].forEach((evt) => {
    ["country", "climate", "agri", "food", "cons"].forEach((id) => {
      document.getElementById(id).addEventListener(evt, refresh);
    });
  });

  refresh();
})();
