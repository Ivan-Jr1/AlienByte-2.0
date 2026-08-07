// código do nav só pode rodar depois que include.js injeta partials/nav.html no DOM
function initNavBehavior() {
  const navbar = document.querySelector(".navbar");
  const searchToggle = document.querySelector(".search-toggle");
  const searchInput = document.getElementById("site-search-input");

  searchToggle.addEventListener("click", () => {
    const isOpen = navbar.classList.toggle("showInput");
    searchToggle.setAttribute("aria-expanded", String(isOpen));
    if (isOpen) searchInput.focus();
  });

  const navLinks = document.querySelector(".nav-links");
  const menuOpenBtn = document.querySelector(".menu-toggle");
  const menuCloseBtn = document.querySelector(".menu-close");

  menuOpenBtn.addEventListener("click", () => {
    navLinks.classList.add("nav-links--open");
    menuOpenBtn.setAttribute("aria-expanded", "true");
  });
  menuCloseBtn.addEventListener("click", () => {
    navLinks.classList.remove("nav-links--open");
    menuOpenBtn.setAttribute("aria-expanded", "false");
  });

  // seta de submenu (Departamentos, Mais, Conta) — um handler delegado só alterna aria-expanded
  document.querySelector(".navbar").addEventListener("click", (event) => {
    const arrowBtn = event.target.closest(".arrow");
    if (!arrowBtn) return;
    const expanded = arrowBtn.getAttribute("aria-expanded") === "true";
    arrowBtn.setAttribute("aria-expanded", String(!expanded));
  });
}

document.addEventListener("partialsLoaded", initNavBehavior);
