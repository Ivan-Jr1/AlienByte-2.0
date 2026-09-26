// carregado no <head> (sem defer) para aplicar o tema salvo antes da página aparecer, sem piscar branco
const THEME_STORAGE_KEY = "alienbyte_theme";

function getSavedTheme() {
  try {
    return localStorage.getItem(THEME_STORAGE_KEY) === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
}

function saveTheme(theme) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // navegação privada sem storage: o tema vale só até recarregar a página
  }
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
}

// o ícone mostra o tema para o qual o botão vai trocar: lua no claro, sol no escuro
function updateThemeToggle(button, theme) {
  const isDark = theme === "dark";
  button.querySelector("i").className = isDark ? "bx bx-sun" : "bx bx-moon";
  button.setAttribute("aria-label", isDark ? "Ativar tema claro" : "Ativar tema escuro");
}

function initThemeToggle() {
  const button = document.querySelector(".theme-toggle");
  if (!button) return;

  updateThemeToggle(button, document.documentElement.dataset.theme);
  button.addEventListener("click", () => {
    const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
    saveTheme(nextTheme);
    updateThemeToggle(button, nextTheme);
  });
}

applyTheme(getSavedTheme());
document.addEventListener("partialsLoaded", initThemeToggle);
