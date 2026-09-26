// arrays de produtos vêm de data/products-*.js; renderProductGrid e escapeHtml vêm de render-products.js e cart.js
const allProducts = [
  ...productsTeclado,
  ...productsMouse,
  ...productsHeadset,
  ...productsMonitor,
  ...productsGabinetes,
  ...productsGames,
  ...productsCadeiras,
  ...productsPromocao,
];

// ignora maiúsculas e acentos para que "cadeira ergonomica" encontre "Cadeira Ergonômica"
function normalizeText(text) {
  return text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

// um produto só entra no resultado se o título contiver todas as palavras pesquisadas
function filterProducts(products, query) {
  const terms = normalizeText(query).split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  return products.filter((product) => {
    const title = normalizeText(product.title);
    return terms.every((term) => title.includes(term));
  });
}

function renderSearchResults(query, containerId, titleId) {
  const results = filterProducts(allProducts, query);
  const title = document.getElementById(titleId);
  title.innerHTML = `Resultados para <b>"${escapeHtml(query)}"</b> (${results.length})`;

  if (results.length) {
    renderProductGrid(results, containerId);
    return;
  }

  document.getElementById(containerId).innerHTML = `
    <div class="cart-empty">
      <i class="bx bx-search cart-empty__icon" aria-hidden="true"></i>
      <p class="cart-empty__title">Nenhum produto encontrado</p>
      <a href="index.html" class="cart-empty__cta">Continuar comprando</a>
    </div>`;
}

const searchQuery = new URLSearchParams(window.location.search).get("q")?.trim() ?? "";
renderSearchResults(searchQuery, "product-grid", "search-title");

// mantém o termo pesquisado visível na barra depois que o nav é injetado
document.addEventListener("partialsLoaded", () => {
  document.getElementById("site-search-input").value = searchQuery;
});
