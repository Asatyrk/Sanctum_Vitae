document.addEventListener("DOMContentLoaded", () => {
  // Get the page name from <body data-page>
  const pageName = document.body.dataset.page?.trim() || "Untitled Page";

  // Update the header page title
  const headerTitleEl = document.getElementById("header-page-title");
  if (headerTitleEl) headerTitleEl.textContent = pageName;

  // Optional: update the document title (browser tab)
  document.title = `Sanctum Vitae | ${pageName}`;

  // Optional: also update logo text if you want
  const logoEl = document.querySelector(".site-logo");
  if (logoEl) logoEl.textContent = `Sanctum Vitae | ${pageName}`;
});