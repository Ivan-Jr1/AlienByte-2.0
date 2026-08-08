const CART_STORAGE_KEY = "alienbyte_cart";

function formatPriceBRL(price) {
  return price.toFixed(2).replace(".", ",");
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// reinicia a animação CSS "bump" mesmo se o elemento já estiver animando
function bump(el) {
  if (!el) return;
  el.classList.remove("bump");
  void el.offsetWidth;
  el.classList.add("bump");
}

// troca o texto do botão por uma confirmação rápida e depois volta ao normal
function confirmButtonFeedback(button) {
  const originalText = button.textContent;
  button.textContent = "Adicionado ✓";
  button.classList.add("is-confirmed");
  button.disabled = true;
  bump(button);
  setTimeout(() => {
    button.textContent = originalText;
    button.classList.remove("is-confirmed");
    button.disabled = false;
  }, 1200);
}

function getCart() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCart(items) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  updateCartBadge();
  renderCartPage();
}

function addToCart({ id, name, price, img }) {
  const items = getCart();
  const existing = items.find((item) => item.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    items.push({ id, name, price, img, qty: 1 });
  }
  saveCart(items);
}

function removeFromCart(id) {
  saveCart(getCart().filter((item) => item.id !== id));
}

function setQty(id, qty) {
  const items = getCart();
  const item = items.find((i) => i.id === id);
  if (!item) return;
  item.qty = Math.max(1, qty);
  saveCart(items);
}

function getCartTotal() {
  return getCart().reduce((sum, item) => sum + item.price * item.qty, 0);
}

function getCartCount() {
  return getCart().reduce((sum, item) => sum + item.qty, 0);
}

function updateCartBadge() {
  const badge = document.querySelector(".cart-count");
  if (badge) badge.textContent = getCartCount();
}

function renderCartPage() {
  const root = document.getElementById("cart-page-root");
  if (!root) return;

  const items = getCart();
  if (items.length === 0) {
    root.innerHTML = `
      <div class="cart-empty">
        <i class="bx bx-cart-alt cart-empty__icon" aria-hidden="true"></i>
        <p class="cart-empty__title">Seu carrinho está vazio</p>
        <a href="index.html" class="cart-empty__cta">Continuar comprando</a>
      </div>`;
    return;
  }

  const rows = items
    .map(
      (item) => `
    <div class="cart-item">
      <img src="${escapeHtml(item.img)}" alt="" class="cart-item__img">
      <div class="cart-item__info">
        <p class="cart-item__name">${escapeHtml(item.name)}</p>
        <span class="cart-item__freight"><i class="bx bx-package" aria-hidden="true"></i> Frete Grátis</span>
      </div>
      <div class="cart-item__qty">
        <span class="cart-item__qty-label">Quantidade</span>
        <div class="cart-item__stepper">
          <button type="button" class="cart-item__step" data-step="-1" data-id="${item.id}" aria-label="Diminuir quantidade">-</button>
          <span class="cart-item__qty-value">${item.qty}</span>
          <button type="button" class="cart-item__step" data-step="1" data-id="${item.id}" aria-label="Aumentar quantidade">+</button>
        </div>
      </div>
      <p class="cart-item__subtotal">R$${formatPriceBRL(item.price * item.qty)}</p>
      <button type="button" class="cart-item__remove" data-remove-id="${item.id}" aria-label="Remover ${escapeHtml(item.name)}">
        <i class="bx bx-x" aria-hidden="true"></i>
      </button>
    </div>`
    )
    .join("");

  const total = getCartTotal();

  root.innerHTML = `
    <div class="cart-page__items">
      ${rows}
      <button type="button" id="clear-cart-btn" class="cart-page__clear">
        <i class="bx bx-trash" aria-hidden="true"></i> Limpar carrinho
      </button>
    </div>
    <aside class="cart-page__summary">
      <h2 class="cart-page__summary-title"><i class="bx bx-receipt" aria-hidden="true"></i> Resumo do pedido</h2>
      <div class="cart-page__summary-row">
        <span>Valor dos Produtos</span><span>R$${formatPriceBRL(total)}</span>
      </div>
      <div class="cart-page__summary-row">
        <span>Frete</span><span class="cart-page__summary-freight">Grátis</span>
      </div>
      <div class="cart-page__summary-row cart-page__summary-row--total">
        <span>Total</span><span>R$${formatPriceBRL(total)}</span>
      </div>
      <button type="button" class="cart-page__checkout" disabled title="Em breve">Finalizar compra</button>
      <a href="index.html" class="cart-page__continue">Continuar comprando</a>
    </aside>`;
}

function initCart() {
  updateCartBadge();
  renderCartPage();

  document.addEventListener("click", (event) => {
    if (event.target.matches(".js-add-to-cart")) {
      event.preventDefault();
      const card = event.target.closest("[data-id]");
      if (!card) return;
      addToCart({
        id: card.dataset.id,
        name: card.dataset.name,
        price: parseFloat(card.dataset.price),
        img: card.dataset.img,
      });
      bump(document.querySelector(".cart-link"));
      confirmButtonFeedback(event.target);
      return;
    }

    const stepBtn = event.target.closest(".cart-item__step");
    if (stepBtn) {
      const items = getCart();
      const item = items.find((i) => i.id === stepBtn.dataset.id);
      if (item) setQty(item.id, item.qty + Number(stepBtn.dataset.step));
      return;
    }

    const removeBtn = event.target.closest("[data-remove-id]");
    if (removeBtn) {
      removeFromCart(removeBtn.dataset.removeId);
      return;
    }

    if (event.target.closest("#clear-cart-btn")) {
      saveCart([]);
    }
  });
}

document.addEventListener("partialsLoaded", initCart);
