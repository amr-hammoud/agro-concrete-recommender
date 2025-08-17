(async function () {
  UI.renderHeader("Approach");

  const [ctxData, typData] = await Promise.all([
    App.loadJSON("assets/data/countries.json"),
    App.loadJSON("assets/data/typology.json"),
  ]);
  const countries = ctxData.countries || [];
  const L = Short.buildLookup({ countries, typologiesTable: typData });
  const archApproaches = L.approaches || [];

  const elArch = document.getElementById("arch");
  const elTier = document.getElementById("industrial");
  const elBack = document.getElementById("back");
  const elNext = document.getElementById("next");
  const stickyBack = document.getElementById("sticky-back");
  const stickyNext = document.getElementById("sticky-next");

  const params = new URLSearchParams(location.search);
  const sCode = params.get("s");

  let restored = sCode ? Short.decodeShort(sCode, L) : App.State.syncFromURL();

  elArch.innerHTML = ['<option value="">-- Select --</option>']
    .concat(archApproaches.map((v) => `<option>${v}</option>`))
    .join("");

  if (restored.arch) elArch.value = restored.arch;
  if (restored.industrial) elTier.value = restored.industrial;

  function isValid() {
    return !!(elArch.value && elTier.value);
  }

  function snapshot() {
    const s = {
      ...App.State.get(),
      arch: elArch.value,
      industrial: elTier.value,
    };
    App.State.set(s);
    return s;
  }

  function refreshLinks() {
    const s = snapshot();
    const code = Short.encodeShort(s, L);
    const back = "typology.html" + (code ? "?s=" + code : "");
    const next = "result.html" + (code ? "?s=" + code : "");

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
    [elArch, elTier].forEach((el) => el.addEventListener(evt, refreshLinks));
  });
  refreshLinks();
})();
