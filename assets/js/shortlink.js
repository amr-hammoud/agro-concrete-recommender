// assets/js/shortlink.js
(function () {
  const COMPONENTS = [
    "Floor Structures",
    "Opaque Facade",
    "Transparent Facades",
    "Roofs",
    "Interior Partitions",
  ];

  function _countriesOrdered(countries) {
    return countries
      .map((c) => c.name)
      .slice()
      .sort();
  }
  function _uniq(list) {
    return Array.from(new Set(list));
  }
  function _idx(arr, val) {
    const i = arr.indexOf(val);
    return i >= 0 ? i + 1 : 0;
  } // 1-based
  function _pick(arr, i) {
    return i > 0 && i <= arr.length ? arr[i - 1] : undefined;
  }

  // Build lookup arrays once per page (pass what you have on that page)
  function buildLookup({ countries, typologiesTable }) {
    const typologies = typologiesTable
      ? _uniq((typologiesTable.typologies || []).map((t) => t.typology))
      : null;
    const approaches = typologiesTable
      ? _uniq(
          (typologiesTable.typologies || []).map(
            (t) => t.architectural_approach
          )
        )
      : null;
    return { countries, typologies, approaches, components: COMPONENTS };
  }

  // Encode a state object into "c-cl-a-f-co-t-comp-ar-ind" (all 1-based integers, 0 = empty)
  function encodeShort(state, L) {
    const cList = _countriesOrdered(L.countries);
    const cIdx = _idx(cList, state.country || "");

    let clIdx = 0,
      aIdx = 0,
      fIdx = 0,
      coIdx = 0;
    if (cIdx > 0) {
      const cObj = L.countries.find((x) => x.name === state.country);
      const climates = cObj?.climates || [];
      const agri = cObj?.agriculture || [];
      const food = cObj?.food_industries || [];
      const cons = cObj?.construction_methods || [];
      clIdx = _idx(climates, state.climate || "");
      aIdx = _idx(agri, state.agri || "");
      fIdx = _idx(food, state.food || "");
      coIdx = _idx(cons, state.cons || "");
    }

    const tIdx = L.typologies ? _idx(L.typologies, state.typology || "") : 0;
    const compIdx = _idx(COMPONENTS, state.component || "");
    const arIdx = L.approaches ? _idx(L.approaches, state.arch || "") : 0;
    const indIdx = { low: 1, medium: 2, high: 3 }[state.industrial || ""] || 0;

    return [cIdx, clIdx, aIdx, fIdx, coIdx, tIdx, compIdx, arIdx, indIdx].join(
      "-"
    );
  }

  // Decode "s" back into a (partial) state. Only decodes fields you provided lookups for.
  function decodeShort(code, L) {
    const parts = (code || "").split("-").map((x) => parseInt(x, 10) || 0);
    while (parts.length < 9) parts.push(0);
    const [cIdx, clIdx, aIdx, fIdx, coIdx, tIdx, compIdx, arIdx, indIdx] =
      parts;
    const out = {};

    const cList = _countriesOrdered(L.countries);
    if (cIdx > 0) {
      out.country = _pick(cList, cIdx);
      const cObj = L.countries.find((x) => x.name === out.country);
      const climates = cObj?.climates || [];
      const agri = cObj?.agriculture || [];
      const food = cObj?.food_industries || [];
      const cons = cObj?.construction_methods || [];
      if (clIdx > 0) out.climate = _pick(climates, clIdx);
      if (aIdx > 0) out.agri = _pick(agri, aIdx);
      if (fIdx > 0) out.food = _pick(food, fIdx);
      if (coIdx > 0) out.cons = _pick(cons, coIdx);
    }
    if (L.typologies && tIdx > 0) out.typology = _pick(L.typologies, tIdx);
    if (compIdx > 0) out.component = _pick(COMPONENTS, compIdx);
    if (L.approaches && arIdx > 0) out.arch = _pick(L.approaches, arIdx);
    out.industrial =
      { 1: "low", 2: "medium", 3: "high" }[indIdx] || out.industrial;

    return out;
  }

  function writeURLWithCode(code) {
    const url = location.pathname + (code ? "?s=" + code : "");
    history.replaceState(null, "", url);
  }

  window.Short = {
    buildLookup,
    encodeShort,
    decodeShort,
    writeURLWithCode,
    COMPONENTS,
  };
})();
