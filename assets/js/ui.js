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
    if (!root) return;

    // keep whatever query is on the URL (works for ?s= short links)
    const suffix = window.location.search || "";
    const steps = [
      { id: "Context", href: "context.html" },
      { id: "Typology", href: "typology.html" },
      { id: "Approach", href: "approach.html" },
      { id: "Result", href: "result.html" },
    ];

    root.innerHTML = `
    <div class="toolbar-wrap">
      <nav class="toolbar">
        ${steps
          .map((s) => {
            const active = s.id === current ? "active" : "";
            const href = s.href + suffix;
            return `<a class="tool ${active}" href="${href}">${s.id}</a>`;
          })
          .join("")}
      </nav>
    </div>
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
