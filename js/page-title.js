document.addEventListener("DOMContentLoaded", () => {
  const pageName = document.body.dataset.page?.trim() || "Untitled";

  const logoEl = document.querySelector(".site-logo");
  if (!logoEl) return;

  // Home page: show logo only
  if (pageName.toLowerCase() === "home") {
    logoEl.textContent = "Sanctum Vitae";
  } else {
    // Other pages: append page name
    logoEl.textContent = `Sanctum Vitae | ${pageName}`;
  }

  // Optional: also update browser tab
  document.title = `Sanctum Vitae | ${pageName}`;
});