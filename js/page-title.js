 /* Title */

 document.addEventListener("DOMContentLoaded", () => {
  const pageName = document.body.dataset.page?.trim() || "Untitled";

  // Wait for the header to be injected and .site-logo-text to exist
  function waitForElement(selector, timeout = 5000) {
    return new Promise((resolve, reject) => {
      const el = document.querySelector(selector);
      if (el) return resolve(el);

      const observer = new MutationObserver(() => {
        const el = document.querySelector(selector);
        if (el) {
          observer.disconnect();
          resolve(el);
        }
      });

      observer.observe(document.body, { childList: true, subtree: true });

      setTimeout(() => {
        observer.disconnect();
        reject(new Error(`Element ${selector} not found within ${timeout}ms`));
      }, timeout);
    });
  }

  waitForElement(".site-logo-text")
    .then(logoTextEl => {
      if (pageName.toLowerCase() === "home") {
        logoTextEl.textContent = "Sanctum Vitae";
      } else {
        logoTextEl.textContent = `Sanctum Vitae | ${pageName}`;
      }

      // Also update the browser tab
      document.title = `Sanctum Vitae | ${pageName}`;
    })
    .catch(err => console.warn(err));
});



/* Breadcrumb */

document.addEventListener("DOMContentLoaded", () => {
  const breadcrumb = document.getElementById("breadcrumb");
  if (!breadcrumb) return;

  const pageName = document.body.dataset.page?.trim() || "Untitled";
  const parent = document.body.dataset.breadcrumbParent?.trim();

  const parentPages = {
    Characters: "characters.html",
    Factions: "factions.html",
    Stories: "stories.html",
    Lore: "lore.html"
  };

  let trail = [];

  // Home page
  if (pageName.toLowerCase() === "home") {
    trail = [
      { name: "Home", href: "index.html" }
    ];
  }

  // Page with a parent
  else if (parent && parentPages[parent]) {
    trail = [
      { name: "Home", href: "index.html" },
      { name: parent, href: parentPages[parent] },
      { name: pageName }
    ];
  }

  // Top-level page
  else {
    trail = [
      { name: "Home", href: "index.html" },
      { name: pageName }
    ];
  }

  breadcrumb.innerHTML = trail.map((item, index) => {
    const isCurrent = index === trail.length - 1;

    return `
      ${index > 0 ? '<span class="breadcrumb-separator">/</span>' : ""}
      ${
        isCurrent
          ? `<span class="breadcrumb-current">${item.name}</span>`
          : `<a href="${item.href}">${item.name}</a>`
      }
    `;
  }).join("");
});