(async function () {
  UI.renderHeader("Approach");

  const tdata = await App.loadJSON("assets/data/typology.json");
  const archApproaches = [
    ...new Set((tdata.typologies || []).map((t) => t.architectural_approach)),
  ];

  const elArch = document.getElementById("arch");
  const elTier = document.getElementById("industrial");
  const elBack = document.getElementById("back");
  const elNext = document.getElementById("next");
  const stickyBack = document.getElementById("sticky-back");
  const stickyNext = document.getElementById("sticky-next");

  let s = App.State.syncFromURL();

  elArch.innerHTML = ['<option value="">-- Select --</option>']
    .concat(archApproaches.map((v) => `<option>${v}</option>`))
    .join("");

  if (s.arch) elArch.value = s.arch;
  if (s.industrial) elTier.value = s.industrial;

  function isValid() {
    return !!(elArch.value && elTier.value);
  }

  function linkHref(target) {
    const snapshot = {
      ...App.State.get(),
      arch: elArch.value,
      industrial: elTier.value,
    };
    App.State.set(snapshot);
    App.State.pushToURL(snapshot);
    const q = App.State.toQuery(snapshot);
    return target + (q ? "?" + q : "");
  }

  function setNext(href, enabled) {
    if (enabled) {
      elNext.setAttribute("href", href);
      elNext.classList.remove("is-disabled");
      if (stickyNext) {
        stickyNext.setAttribute("href", href);
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

  function refreshLinks() {
    const back = linkHref("typology.html");
    const next = linkHref("result.html");
    elBack.setAttribute("href", back);
    if (stickyBack) {
      stickyBack.setAttribute("href", back);
      stickyBack.classList.remove("is-disabled");
    }
    setNext(next, isValid());
  }

  ["change", "keyup"].forEach((evt) => {
    [elArch, elTier].forEach((el) => el.addEventListener(evt, refreshLinks));
  });
  refreshLinks();
})();
