(function () {
  const slider = document.querySelector(".slider");
  const track = document.querySelector(".slider-content");
  const radios = document.querySelectorAll('input[name="btn-radio"]');
  if (!slider || !track || !radios.length) return;

  const AUTO_MS = 5000;
  let timer;

  function currentIndex() {
    return [...radios].findIndex((r) => r.checked);
  }

  function applyTransform() {
    track.style.transform = `translateX(-${currentIndex() * 100}%)`;
  }

  function goTo(index) {
    radios[(index + radios.length) % radios.length].checked = true;
    applyTransform();
  }

  function next() {
    goTo(currentIndex() + 1);
  }

  function prev() {
    goTo(currentIndex() - 1);
  }

  function startAuto() {
    stopAuto();
    timer = setInterval(next, AUTO_MS);
  }

  function stopAuto() {
    clearInterval(timer);
  }

  function resetAuto() {
    startAuto();
  }

  radios.forEach((radio) => {
    radio.addEventListener("change", () => {
      applyTransform();
      resetAuto();
    });
  });

  const prevBtn = document.querySelector(".slider-arrow--prev");
  const nextBtn = document.querySelector(".slider-arrow--next");
  prevBtn?.addEventListener("click", () => {
    prev();
    resetAuto();
  });
  nextBtn?.addEventListener("click", () => {
    next();
    resetAuto();
  });

  slider.addEventListener("mouseenter", stopAuto);
  slider.addEventListener("mouseleave", startAuto);
  slider.addEventListener("focusin", stopAuto);
  slider.addEventListener("focusout", startAuto);
  slider.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") {
      next();
      resetAuto();
    }
    if (event.key === "ArrowLeft") {
      prev();
      resetAuto();
    }
  });

  goTo(0);
  startAuto();
})();
