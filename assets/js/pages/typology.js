(async function () {
  UI.renderHeader("Typology");

  const tdata = await App.loadJSON("assets/data/typology.json");
  const typologies = [
    ...new Set((tdata.typologies || []).map((t) => t.typology)),
  ];

  const elTyp = document.getElementById("typology");
  const elComp = document.getElementById("component");
  const elBack = document.getElementById("back");
  const elNext = document.getElementById("next");
  const stickyBack = document.getElementById("sticky-back");
  const stickyNext = document.getElementById("sticky-next");

  let s = App.State.syncFromURL();

  elTyp.innerHTML = ['<option value="">-- Select --</option>']
    .concat(typologies.map((v) => `<option>${v}</option>`))
    .join("");

  if (s.typology) elTyp.value = s.typology;
  if (s.component) elComp.value = s.component;

  function isValid() {
    return !!(elTyp.value && elComp.value);
  }

  function linkHref(target) {
    const snapshot = {
      ...App.State.get(),
      typology: elTyp.value,
      component: elComp.value,
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
    const back = linkHref("context.html");
    const next = linkHref("approach.html");
    elBack.setAttribute("href", back);
    if (stickyBack) {
      stickyBack.setAttribute("href", back);
      stickyBack.classList.remove("is-disabled");
    }
    setNext(next, isValid());
  }

  ["change", "keyup"].forEach((evt) => {
    [elTyp, elComp].forEach((el) => el.addEventListener(evt, refreshLinks));
  });
  refreshLinks();
})();
