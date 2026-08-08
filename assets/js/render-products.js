// formatPriceBRL e escapeHtml vêm de cart.js, carregado antes deste arquivo
function renderProductGrid(products, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = products
    .map((product) => {
      const [whole, cents] = formatPriceBRL(product.price).split(",");
      return `
    <div class="item" data-id="${product.id}" data-name="${escapeHtml(product.title)}" data-price="${product.price}" data-img="${product.img}">
      <button type="button" class="wishlist-toggle js-toggle-wishlist" aria-label="Favoritar" aria-pressed="false">
        <i class="bx bx-heart" aria-hidden="true"></i>
      </button>
      <div class="item-content">
        <img src="${product.img}" alt="" class="item-img" loading="lazy">
        <h1 class="item-title">${escapeHtml(product.title)}</h1>
        <div class="item-body">
          <div class="item-star">
            <span class="rating-value">${product.rating}</span>
            <span class="star">&#9733;</span>
          </div>
          <p class="item-price"><small>R$</small>${whole},<small>${cents}</small></p>
        </div>
        <div class="item-footer">
          <button type="button" class="btn1 btn-success js-add-to-cart">Comprar</button>
          <button type="button" class="btn1 btn-border js-add-to-cart">Carrinho</button>
        </div>
      </div>
    </div>`;
    })
    .join("\n");
}
