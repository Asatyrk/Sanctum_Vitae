document.addEventListener("DOMContentLoaded", () => {
  const pageName = document.body.dataset.page?.trim() || "Untitled Page";

  const headerTitleEl = document.getElementById("header-page-title");
  const logoEl = document.querySelector(".site-logo");

  // Home page: hide header page title
  if (pageName.toLowerCase() === "home") {
    if (headerTitleEl) headerTitleEl.style.display = "none";
  } else {
    // Other pages: show header page title next to logo
    if (headerTitleEl) {
      headerTitleEl.textContent = pageName;
      headerTitleEl.style.display = "inline-block";
    }
  }

  document.title = `Sanctum Vitae | ${pageName}`;

  if (logoEl) logoEl.textContent = "Sanctum Vitae";
});