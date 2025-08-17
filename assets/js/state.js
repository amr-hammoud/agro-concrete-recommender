window.APP_STATE_KEY = "agro-app-state-v1";

const State = {
  get() {
    try {
      return JSON.parse(localStorage.getItem(window.APP_STATE_KEY) || "{}");
    } catch (e) {
      return {};
    }
  },
  set(patch) {
    const next = { ...State.get(), ...patch };
    localStorage.setItem(window.APP_STATE_KEY, JSON.stringify(next));
    return next;
  },
  clear() {
    localStorage.removeItem(window.APP_STATE_KEY);
  },

  // deep-link helpers (short keys)
  toQuery(obj) {
    const map = {
      country: "c",
      climate: "cl",
      agri: "a",
      food: "f",
      cons: "co",
      typology: "t",
      component: "comp",
      arch: "ar",
      industrial: "ind",
    };
    const params = new URLSearchParams();
    Object.entries(map).forEach(([k, short]) => {
      if (obj[k]) params.set(short, obj[k]);
    });
    return params.toString();
  },
  fromQuery() {
    const map = {
      c: "country",
      cl: "climate",
      a: "agri",
      f: "food",
      co: "cons",
      t: "typology",
      comp: "component",
      ar: "arch",
      ind: "industrial",
    };
    const params = new URLSearchParams(location.search);
    const out = {};
    for (const [short, full] of Object.entries(map)) {
      const v = params.get(short);
      if (v) out[full] = v;
    }
    return out;
  },
  pushToURL(obj) {
    const q = State.toQuery(obj);
    const url = location.pathname + (q ? "?" + q : "");
    history.replaceState(null, "", url);
  },
  syncFromURL() {
    const q = State.fromQuery();
    if (Object.keys(q).length) {
      const merged = { ...State.get(), ...q };
      State.set(merged);
      return merged;
    }
    return State.get();
  },
};

async function loadJSON(path) {
  const res = await fetch(path);
  return res.json();
}

window.App = { State, loadJSON };
window.resetAll = function () {
  State.clear();
  history.replaceState(null, "", location.pathname);
  location.href = "index.html";
};
