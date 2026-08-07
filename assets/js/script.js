// código do nav só pode rodar depois que include.js injeta partials/nav.html no DOM
function initNavBehavior() {
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
}

document.addEventListener("partialsLoaded", initNavBehavior);
