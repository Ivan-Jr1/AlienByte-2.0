// getCart, saveCart, getCartTotal, orderTotalsHtml, formatPriceBRL e escapeHtml vêm de cart.js
// não há backend: o pedido é simulado e os dados do cartão nunca são salvos
const CHECKOUT_STEPS = ["identificacao", "pagamento", "confirmacao"];
const MAX_INSTALLMENTS = 10;

let customer = {};

// aplica máscaras como "###.###.###-##", onde cada # é um dígito digitado
function applyMask(value, mask) {
  const digits = value.replace(/\D/g, "");
  let result = "";
  let digitIndex = 0;
  for (const char of mask) {
    if (digitIndex >= digits.length) break;
    result += char === "#" ? digits[digitIndex++] : char;
  }
  return result;
}

function showCheckoutStep(step) {
  const currentIndex = CHECKOUT_STEPS.indexOf(step);

  document.querySelectorAll("[data-checkout-panel]").forEach((panel) => {
    panel.hidden = panel.dataset.checkoutPanel !== step;
  });
  document.querySelectorAll(".checkout-steps__step[data-step]").forEach((stepItem) => {
    const index = CHECKOUT_STEPS.indexOf(stepItem.dataset.step);
    stepItem.classList.toggle("is-active", index === currentIndex);
    stepItem.classList.toggle("is-done", index < currentIndex);
  });
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
}

function renderCheckoutSummary(items) {
  const rows = items
    .map(
      (item) => `
      <li class="checkout-summary__item">
        <img src="${escapeHtml(item.img)}" alt="">
        <span>${item.qty}x ${escapeHtml(item.name)}</span>
        <span>R$${formatPriceBRL(item.price * item.qty)}</span>
      </li>`
    )
    .join("");

  document.getElementById("checkout-summary").innerHTML = `
    <h2 class="cart-page__summary-title"><i class="bx bx-receipt" aria-hidden="true"></i> Resumo do pedido</h2>
    <ul class="checkout-summary__items">${rows}</ul>
    ${orderTotalsHtml(getCartTotal())}`;
}

function renderEmptyCheckout() {
  document.getElementById("checkout-root").innerHTML = `
    <div class="cart-empty">
      <i class="bx bx-cart-alt cart-empty__icon" aria-hidden="true"></i>
      <p class="cart-empty__title">Seu carrinho está vazio</p>
      <a href="index.html" class="cart-empty__cta">Continuar comprando</a>
    </div>`;
}

function fillInstallmentOptions(total) {
  const options = [];
  for (let count = 1; count <= MAX_INSTALLMENTS; count++) {
    options.push(`<option value="${count}">${count}x de R$${formatPriceBRL(total / count)} sem juros</option>`);
  }
  document.getElementById("installments-select").innerHTML = options.join("");
}

// preenche rua/bairro/cidade/UF pelo CEP; se a ViaCEP falhar, o usuário digita à mão
async function fillAddressFromCep(form) {
  const cep = form.elements.cep.value.replace(/\D/g, "");
  if (cep.length !== 8) return;

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const address = await response.json();
    if (address.erro) return;
    form.elements.street.value = address.logradouro;
    form.elements.district.value = address.bairro;
    form.elements.city.value = address.localidade;
    form.elements.state.value = address.uf;
    form.elements.number.focus();
  } catch {
    // sem conexão com a ViaCEP: segue com preenchimento manual
  }
}

function paymentMessage(payment, total) {
  if (payment.method === "cartao") {
    const installments = Number(payment.installments);
    const lastDigits = payment.cardNumber.slice(-4);
    return `Pagamento aprovado em ${installments}x de R$${formatPriceBRL(total / installments)} no cartão final ${lastDigits}.`;
  }
  if (payment.method === "boleto") {
    return `Enviamos o boleto para ${customer.email}. Ele vence em 3 dias úteis.`;
  }
  return `Enviamos o código PIX para ${customer.email}. O pedido é liberado assim que o pagamento for aprovado.`;
}

function confirmOrder(payment) {
  const total = getCartTotal();
  const { street, number, complement, city, state } = customer;
  const fullStreet = complement ? `${street}, ${number} - ${complement}` : `${street}, ${number}`;

  // textContent em vez de innerHTML porque as mensagens carregam texto digitado pelo usuário
  document.getElementById("order-number").textContent = `AB${Date.now().toString().slice(-8)}`;
  document.getElementById("order-payment-message").textContent = paymentMessage(payment, total);
  document.getElementById("order-address-message").textContent =
    `Entrega grátis em: ${fullStreet}, ${city}/${state.toUpperCase()}.`;

  saveCart([]);
  showCheckoutStep("confirmacao");
}

function initCheckout() {
  const items = getCart();
  if (!items.length) {
    renderEmptyCheckout();
    return;
  }

  renderCheckoutSummary(items);
  fillInstallmentOptions(getCartTotal());

  const identificationForm = document.getElementById("identification-form");
  const paymentForm = document.getElementById("payment-form");
  const cardFields = document.getElementById("card-fields");

  identificationForm.addEventListener("submit", (event) => {
    event.preventDefault();
    customer = Object.fromEntries(new FormData(identificationForm));
    showCheckoutStep("pagamento");
  });

  paymentForm.addEventListener("change", (event) => {
    if (event.target.name !== "method") return;
    const isCard = event.target.value === "cartao";
    cardFields.hidden = !isCard;
    cardFields.disabled = !isCard;
  });

  paymentForm.addEventListener("submit", (event) => {
    event.preventDefault();
    confirmOrder(Object.fromEntries(new FormData(paymentForm)));
  });

  document.querySelector("[data-go-to]").addEventListener("click", (event) => {
    showCheckoutStep(event.target.dataset.goTo);
  });

  document.getElementById("checkout-root").addEventListener("input", (event) => {
    const { mask } = event.target.dataset;
    if (mask) event.target.value = applyMask(event.target.value, mask);
    if (event.target.name === "cep") fillAddressFromCep(identificationForm);
  });
}

initCheckout();
