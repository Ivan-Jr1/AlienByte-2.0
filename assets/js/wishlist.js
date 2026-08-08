// formatPriceBRL, escapeHtml e addToCart vêm de cart.js, carregado antes deste arquivo
const WISHLIST_STORAGE_KEY = "alienbyte_wishlist";

function getWishlist() {
  try {
    const raw = localStorage.getItem(WISHLIST_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveWishlist(items) {
  localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
  updateWishlistBadge();
  renderWishlistPage();
  syncWishlistButtons();
}

function isInWishlist(id) {
  return getWishlist().some((item) => item.id === id);
}

function toggleWishlist({ id, name, price, img }) {
  const items = getWishlist();
  const existingIndex = items.findIndex((item) => item.id === id);
  const wasAdded = existingIndex < 0;
  if (existingIndex >= 0) {
    items.splice(existingIndex, 1);
  } else {
    items.push({ id, name, price, img });
  }
  saveWishlist(items);
  if (wasAdded) bump(document.querySelector(".wishlist-link"));
}

function removeFromWishlist(id) {
  saveWishlist(getWishlist().filter((item) => item.id !== id));
}

function updateWishlistBadge() {
  const badge = document.querySelector(".wishlist-count");
  if (badge) badge.textContent = getWishlist().length;
}

function syncWishlistButtons() {
  document.querySelectorAll(".js-toggle-wishlist").forEach((button) => {
    const card = button.closest("[data-id]");
    if (!card) return;
    const active = isInWishlist(card.dataset.id);
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
    const icon = button.querySelector("i");
    if (icon) icon.className = active ? "bx bxs-heart" : "bx bx-heart";
  });
}

function renderWishlistPage() {
  const root = document.getElementById("wishlist-page-root");
  if (!root) return;

  const items = getWishlist();
  if (items.length === 0) {
    root.innerHTML = `
      <div class="cart-empty">
        <i class="bx bx-heart cart-empty__icon" aria-hidden="true"></i>
        <p class="cart-empty__title">Você ainda não favoritou nenhum produto</p>
        <a href="index.html" class="cart-empty__cta">Continuar comprando</a>
      </div>`;
    return;
  }

  const rows = items
    .map(
      (item) => `
    <div class="cart-item cart-item--wishlist">
      <img src="${escapeHtml(item.img)}" alt="" class="cart-item__img">
      <div class="cart-item__info">
        <p class="cart-item__name">${escapeHtml(item.name)}</p>
        <p class="cart-item__price">R$${formatPriceBRL(item.price)}</p>
      </div>
      <button type="button" class="cart-item__remove wishlist-item__move" data-move-id="${item.id}" title="Mover para o carrinho" aria-label="Mover ${escapeHtml(item.name)} para o carrinho">
        <i class="bx bx-cart-alt" aria-hidden="true"></i>
      </button>
      <button type="button" class="cart-item__remove" data-remove-wishlist-id="${item.id}" aria-label="Remover ${escapeHtml(item.name)}">
        <i class="bx bx-trash" aria-hidden="true"></i>
      </button>
    </div>`
    )
    .join("");

  root.innerHTML = `<div class="cart-page__items">${rows}</div>`;
}

function initWishlist() {
  updateWishlistBadge();
  renderWishlistPage();
  syncWishlistButtons();

  document.addEventListener("click", (event) => {
    const toggleBtn = event.target.closest(".js-toggle-wishlist");
    if (toggleBtn) {
      const card = toggleBtn.closest("[data-id]");
      if (!card) return;
      bump(toggleBtn);
      toggleWishlist({
        id: card.dataset.id,
        name: card.dataset.name,
        price: parseFloat(card.dataset.price),
        img: card.dataset.img,
      });
      return;
    }

    const moveBtn = event.target.closest("[data-move-id]");
    if (moveBtn) {
      const item = getWishlist().find((i) => i.id === moveBtn.dataset.moveId);
      if (item) addToCart(item);
      removeFromWishlist(moveBtn.dataset.moveId);
      return;
    }

    const removeBtn = event.target.closest("[data-remove-wishlist-id]");
    if (removeBtn) {
      removeFromWishlist(removeBtn.dataset.removeWishlistId);
    }
  });
}

document.addEventListener("partialsLoaded", initWishlist);
