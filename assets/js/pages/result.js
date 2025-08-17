(async function () {
  UI.renderHeader("Result");

  const s = App.State.syncFromURL();
  const tdata = await App.loadJSON("assets/data/typology.json");

  const summary = document.getElementById("summary");
  summary.innerHTML = `
    <h2 class="text-xl font-semibold mb-4">Your Selection</h2>
    <div class="grid md:grid-cols-2 gap-2 text-sm">
      <div><strong>Country:</strong> ${s.country || "—"}</div>
      <div><strong>Climate:</strong> ${s.climate || "—"}</div>
      <div><strong>Agriculture:</strong> ${s.agri || "—"}</div>
      <div><strong>Food Industry:</strong> ${s.food || "—"}</div>
      <div><strong>Construction:</strong> ${s.cons || "—"}</div>
      <div><strong>Typology:</strong> ${s.typology || "—"}</div>
      <div><strong>Component:</strong> ${s.component || "—"}</div>
      <div><strong>Architectural Approach (chosen):</strong> ${
        s.arch || "—"
      }</div>
      <div><strong>Industrial Tier (chosen):</strong> ${
        s.industrial || "—"
      }</div>
    </div>
  `;

  function fromTypology() {
    if (!s.typology) return null;
    const row = (tdata.typologies || []).find((t) => t.typology === s.typology);
    if (!row) return null;
    return {
      standards: row.standards || "—",
      testing: row.testing_method || "—",
      tableArchitectural: row.architectural_approach || "—",
      recommendation: row.recommendations?.[s.industrial || "low"] || "—",
    };
  }

  const rec = fromTypology();
  const recBox = document.getElementById("recommendation");
  if (rec) {
    recBox.innerHTML = `
      <h2 class="text-xl font-semibold mb-4">Recommendation</h2>
      <p class="mb-2"><strong>Material Suggestion:</strong> ${rec.recommendation}</p>
      <p class="mb-2"><strong>Standards:</strong> ${rec.standards}</p>
      <p class="mb-2"><strong>Testing Methods:</strong> ${rec.testing}</p>
      <p class="mb-2"><strong>Architectural Approach (from table):</strong> ${rec.tableArchitectural}</p>
    `;
  } else {
    recBox.innerHTML = `
      <h2 class="text-xl font-semibold mb-4">Recommendation</h2>
      <p>No matching recommendation found. Please choose a Typology and Industrial Tier.</p>
    `;
  }

  const btnCopy = document.getElementById("copylink");
  if (btnCopy) {
    btnCopy.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(window.location.href);
        btnCopy.textContent = "Link Copied!";
        setTimeout(() => (btnCopy.textContent = "Copy Link"), 1500);
      } catch (e) {
        alert("Copy failed: " + e.message);
      }
    });
  }

  // sticky back/home
  const q = App.State.toQuery(App.State.get());
  const back = "approach.html" + (q ? "?" + q : "");
  const next = "index.html" + (q ? "?" + q : "");
  UI.setStickyLinks({ back, next });
})();
