// código do nav só pode rodar depois que include.js injeta partials/nav.html no DOM
function initNavBehavior() {
  const navLinks = document.querySelector(".nav-links");
  const menuOpenBtn = document.querySelector(".menu-toggle");
  const menuCloseBtn = document.querySelector(".menu-close");
  const overlay = document.querySelector(".nav-overlay");

  const openMenu = () => {
    navLinks.classList.add("nav-links--open");
    overlay.classList.add("nav-overlay--visible");
    menuOpenBtn.setAttribute("aria-expanded", "true");
  };
  const closeMenu = () => {
    navLinks.classList.remove("nav-links--open");
    overlay.classList.remove("nav-overlay--visible");
    menuOpenBtn.setAttribute("aria-expanded", "false");
  };

  menuOpenBtn.addEventListener("click", openMenu);
  menuCloseBtn.addEventListener("click", closeMenu);
  overlay.addEventListener("click", closeMenu);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
}

document.addEventListener("partialsLoaded", initNavBehavior);

// anima a entrada dos cards (produto e lançamentos) quando eles aparecem na tela
function initScrollReveal() {
  const targets = document.querySelectorAll(".item, .promo-card");
  if (!targets.length || !("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("reveal-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.15 });

  targets.forEach((el) => {
    el.classList.add("reveal-init");
    observer.observe(el);
  });
}

initScrollReveal();
