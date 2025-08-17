// assets/js/footer.js
(async function () {
  const mount = document.getElementById("data-footer");
  if (!mount) return;

  function getVersion(obj) {
    // Try common places: meta.version or dataVersion
    return obj?.meta?.version || obj?.dataVersion || null;
  }
  function count(arr) {
    return Array.isArray(arr) ? arr.length : 0;
  }

  try {
    const [countries, typologies] = await Promise.all([
      fetch("assets/data/countries.json")
        .then((r) => r.json())
        .catch(() => null),
      fetch("assets/data/typology.json")
        .then((r) => r.json())
        .catch(() => null),
    ]);

    const v1 = countries ? getVersion(countries) : null;
    const v2 = typologies ? getVersion(typologies) : null;

    const cCount = countries ? count(countries.countries) : 0;
    const tCount = typologies ? count(typologies.typologies) : 0;

    const when = new Date().toLocaleString();

    mount.innerHTML = `
      <div>
        <span>Data:</span>
        <span title="countries.json">Countries=${cCount}${
      v1 ? ` (v${v1})` : ""
    }</span> ·
        <span title="typology.json">Typologies=${tCount}${
      v2 ? ` (v${v2})` : ""
    }</span>
        <span class="ml-2 opacity-70">Loaded: ${when}</span>
      </div>
    `;
  } catch (e) {
    mount.textContent = "Data: unavailable";
  }
})();
