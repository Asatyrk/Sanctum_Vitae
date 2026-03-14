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