// carrega nav e footer compartilhados e avisa o resto da página quando terminar
async function loadPartial(url, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const res = await fetch(url);
  container.innerHTML = await res.text();
}

Promise.all([
  loadPartial("partials/nav.html", "nav-placeholder"),
  loadPartial("partials/footer.html", "footer-placeholder"),
]).then(() => {
  document.dispatchEvent(new Event("partialsLoaded"));
});
