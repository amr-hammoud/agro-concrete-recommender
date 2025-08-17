(async function () {
  UI.renderHeader("Result");

  const [ctxData, typData] = await Promise.all([
    App.loadJSON("assets/data/countries.json"),
    App.loadJSON("assets/data/typology.json"),
  ]);
  const countries = ctxData.countries || [];
  const L = Short.buildLookup({ countries, typologiesTable: typData });

  const params = new URLSearchParams(location.search);
  const sCode = params.get("s");
  const restored = sCode
    ? Short.decodeShort(sCode, L)
    : App.State.syncFromURL();

  const s = { ...App.State.get(), ...restored };
  App.State.set(s);

  const code = Short.encodeShort(s, L);
  Short.writeURLWithCode(code);

  document.getElementById("summary").innerHTML = `
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

  const row = (typData.typologies || []).find((t) => t.typology === s.typology);
  const rec = row
    ? {
        standards: row.standards || "—",
        testing: row.testing_method || "—",
        tableArchitectural: row.architectural_approach || "—",
        recommendation: row.recommendations?.[s.industrial || "low"] || "—",
      }
    : null;

  const box = document.getElementById("recommendation");
  box.innerHTML = rec
    ? `
    <h2 class="text-xl font-semibold mb-4">Recommendation</h2>
    <p class="mb-2"><strong>Material Suggestion:</strong> ${rec.recommendation}</p>
    <p class="mb-2"><strong>Standards:</strong> ${rec.standards}</p>
    <p class="mb-2"><strong>Testing Methods:</strong> ${rec.testing}</p>
    <p class="mb-2"><strong>Architectural Approach (from table):</strong> ${rec.tableArchitectural}</p>
  `
    : `
    <h2 class="text-xl font-semibold mb-4">Recommendation</h2>
    <p>No matching recommendation found. Please choose a Typology and Industrial Tier.</p>
  `;

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

  const back = "approach.html" + (code ? "?s=" + code : "");
  const home = "index.html" + (code ? "?s=" + code : "");
  UI.setStickyLinks({ back, next: home });
})();
