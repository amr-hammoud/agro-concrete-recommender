(async function () {
  UI.renderHeader("Result");

  const [ctxData, typData] = await Promise.all([
    App.loadJSON("assets/data/countries.json"),
    App.loadJSON("assets/data/typology.json"),
  ]);
  const countries = ctxData.countries || [];
  const L = Short.buildLookup({ countries, typologiesTable: typData });

  // Restore state (prefer short code if present)
  const params = new URLSearchParams(location.search);
  const sCode = params.get("s");
  const restored = sCode
    ? Short.decodeShort(sCode, L)
    : App.State.syncFromURL();

  const s = { ...App.State.get(), ...restored };
  App.State.set(s);
  const code = Short.encodeShort(s, L);
  Short.writeURLWithCode(code);

  // Summary (without Typology)
  document.getElementById("summary").innerHTML = `
    <h2 class="text-xl font-semibold mb-4">Your Selection</h2>
    <div class="grid md:grid-cols-2 gap-2 text-sm">
      <div><strong>Country:</strong> ${s.country || "—"}</div>
      <div><strong>Climate:</strong> ${s.climate || "—"}</div>
      <div><strong>Agriculture:</strong> ${s.agri || "—"}</div>
      <div><strong>Food Industry:</strong> ${s.food || "—"}</div>
      <div><strong>Construction:</strong> ${s.cons || "—"}</div>
      <div><strong>Component:</strong> ${s.component || "—"}</div>
      <div><strong>Architectural Approach:</strong> ${s.arch || "—"}</div>
      <div><strong>Industrial Tier:</strong> ${s.industrial || "—"}</div>
    </div>
  `;

  // Recommendation placeholder (since Typology moved to Virtual Model)
  document.getElementById("recommendation").innerHTML = `
    <h2 class="text-xl font-semibold mb-4">Recommendation</h2>
    <p class="mb-2">
      The Recommendation rule previously used <em>Building Typology</em>.
      Since Typology has moved to <strong>Virtual Model</strong>, this page now summarizes your selections.
    </p>
    <p class="text-sm opacity-80">
      Tip: Go to <a href="model.html${
        code ? "?s=" + code : ""
      }" class="underline">Virtual Model</a> to specify
      Typology and full space/material specs, then launch a simulation (placeholder).
    </p>
  `;

  // Copy Link
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

  // Sticky nav: back/home
  const back = "approach.html" + (code ? "?s=" + code : "");
  const home = "index.html" + (code ? "?s=" + code : "");
  UI.setStickyLinks({ back, next: home });
})();
