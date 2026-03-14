document.addEventListener("DOMContentLoaded", () => {
  const titleContainer = document.getElementById("page-title");
  if (!titleContainer) return;

  // fallback in case data-page is missing
  const pageName = document.body.dataset.page || "Untitled";

  // update <h1>
  titleContainer.textContent = pageName;

  // update browser tab title
  document.title = `Sanctum Vitae | ${pageName}`;

  // update header logo
  const logo = document.querySelector(".site-logo");
  if (logo) {
    logo.textContent = `Sanctum Vitae | ${pageName}`;
  }
});