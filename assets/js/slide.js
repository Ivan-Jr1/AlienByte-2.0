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

  // SWIPE (mobile): arrasta na horizontal para trocar de slide
  const SWIPE_THRESHOLD = 40;
  let touchStartX = 0;
  let touchStartY = 0;
  let touchDeltaX = 0;
  let isSwiping = false;

  slider.addEventListener("touchstart", (event) => {
    const touch = event.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    touchDeltaX = 0;
    isSwiping = false;
    stopAuto();
  }, { passive: true });

  slider.addEventListener("touchmove", (event) => {
    const touch = event.touches[0];
    touchDeltaX = touch.clientX - touchStartX;
    const deltaY = touch.clientY - touchStartY;

    if (!isSwiping && Math.abs(touchDeltaX) > Math.abs(deltaY) && Math.abs(touchDeltaX) > 10) {
      isSwiping = true;
    }

    // só bloqueia o scroll vertical da página quando o gesto é claramente horizontal
    if (isSwiping) {
      event.preventDefault();
    }
  }, { passive: false });

  slider.addEventListener("touchend", () => {
    if (isSwiping && Math.abs(touchDeltaX) > SWIPE_THRESHOLD) {
      touchDeltaX < 0 ? next() : prev();
    }
    isSwiping = false;
    startAuto();
  });

  goTo(0);
  startAuto();
})();
