document.addEventListener("DOMContentLoaded", () => {
  const pageName = document.body.dataset.page?.trim() || "Untitled";

  function waitForElement(selector, timeout = 3000) {
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

  waitForElement(".site-logo")
    .then(logoEl => {
      if (pageName.toLowerCase() === "home") {
        logoEl.childNodes[1].textContent = "Sanctum Vitae";
      } else {
        logoEl.childNodes[1].textContent = `Sanctum Vitae | ${pageName}`;
      }
      document.title = `Sanctum Vitae | ${pageName}`;
    })
    .catch(err => console.warn(err));
});