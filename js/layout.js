async function loadLayout() {

  const headerContainer = document.getElementById("site-header");

  if (headerContainer) {

    const res = await fetch("partials/header.html");
    const html = await res.text();

    headerContainer.innerHTML = html;

    initNavDropdowns();

  }


  const footerContainer = document.getElementById("site-footer");

  if (footerContainer) {

    const res = await fetch("partials/footer.html");
    const html = await res.text();

    footerContainer.innerHTML = html;

  }

}


function initNavDropdowns() {

  document.querySelectorAll(".nav-dropdown-toggle").forEach(button => {

    button.addEventListener("click", () => {

      const dropdown = button.closest(".nav-dropdown");
      const isOpen = dropdown.classList.contains("open");


      // Close all dropdowns
      document.querySelectorAll(".nav-dropdown").forEach(item => {

        item.classList.remove("open");

        item
          .querySelector(".nav-dropdown-toggle")
          .setAttribute("aria-expanded", "false");

      });


      // Open the clicked dropdown
      if (!isOpen) {

        dropdown.classList.add("open");

        button.setAttribute("aria-expanded", "true");

      }

    });

  });


  // Close dropdowns when clicking outside
  document.addEventListener("click", event => {

    if (!event.target.closest(".nav-dropdown")) {

      document.querySelectorAll(".nav-dropdown").forEach(item => {

        item.classList.remove("open");

        item
          .querySelector(".nav-dropdown-toggle")
          .setAttribute("aria-expanded", "false");

      });

    }

  });

}


loadLayout();