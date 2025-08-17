// assets/js/ui.js
(function () {
  const steps = [
    { id: "Context", href: "context.html" },
    { id: "Typology", href: "typology.html" },
    { id: "Approach", href: "approach.html" },
    { id: "Result", href: "result.html" },
  ];

  function renderHeader(current) {
    const root = document.getElementById("app-header");
    if (!root || !window.App) return;
    const q = App.State.toQuery(App.State.get());
    const sep = `<span class="opacity-60">/</span>`;
    root.innerHTML = `
      <nav class="breadcrumb mb-4">
        ${steps
          .map((s) => {
            const active = s.id === current ? "active" : "";
            const href = s.href + (q ? "?" + q : "");
            return `<a class="${active}" href="${href}">${s.id}</a>`;
          })
          .join(sep)}
      </nav>
    `;
  }

  function toast(msg) {
    const root = document.getElementById("toast-root");
    if (!root) return;
    const el = document.createElement("div");
    el.className = "toast";
    el.textContent = msg;
    root.appendChild(el);
    requestAnimationFrame(() => el.classList.add("show"));
    setTimeout(() => {
      el.classList.remove("show");
      setTimeout(() => el.remove(), 250);
    }, 1800);
  }

  function setStickyLinks({ back, next }) {
    const backEl = document.getElementById("sticky-back");
    const nextEl = document.getElementById("sticky-next");
    if (backEl && back) backEl.setAttribute("href", back);
    if (nextEl && next) nextEl.setAttribute("href", next);
  }

  window.UI = { renderHeader, toast, setStickyLinks };
})();
