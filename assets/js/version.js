(function () {
  const APP_VERSION = "1.2.0";

  // expose for debugging if needed
  window.APP_VERSION = APP_VERSION;
  document.documentElement.setAttribute("data-version", APP_VERSION);

  const el = document.createElement("div");
  el.className = "version-badge";
  el.textContent = "v" + APP_VERSION;
  document.body.appendChild(el);
})();
