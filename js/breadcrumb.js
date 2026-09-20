/* =========================================================
   BREADCRUMB
   ========================================================= */

function updateBreadcrumb(){

  const container =
    document.querySelector(
      ".breadcrumb-container"
    )

  if(!container){
    return
  }


  /* =======================================================
     PAGE NAME
     ======================================================= */

  const pageName =
    document.body.dataset.page?.trim()

  if(!pageName){
    return
  }


  /* =======================================================
     DETERMINE PAGE TYPE FROM URL
     ======================================================= */

  const pathname =
    window.location.pathname
      .split("/")
      .pop()
      .toLowerCase()


  let parent = ""
  let parentHref = ""


  switch(pathname){

    case "character-profile.html":

      parent =
        "Characters"

      parentHref =
        "characters.html"

      break


    case "pet-profile.html":

      parent =
        "Pets"

      parentHref =
        "pets.html"

      break


    case "otherly-owned-profile.html":

      parent =
        "Otherly-Owned"

      parentHref =
        "otherly-owned.html"

      break


    case "story-profile.html":

      parent =
        "Stories"

      parentHref =
        "stories.html"

      break


    case "faction-profile.html":

      parent =
        "Factions"

      parentHref =
        "factions.html"

      break

  }


  /* =======================================================
     BUILD TRAIL
     ======================================================= */

  let trail = []


  /* =========================
     HOME
     ========================= */

  if(
    pageName.toLowerCase() ===
    "home"
  ){

    trail = [

      {
        name: "Home",
        href: "index.html"
      }

    ]

  }


  /* =========================
     PROFILE PAGE
     ========================= */

  else if(parent){

    trail = [

      {
        name: "Home",
        href: "index.html"
      },

      {
        name: parent,
        href: parentHref
      },

      {
        name: pageName
      }

    ]

  }


  /* =========================
     NORMAL TOP-LEVEL PAGE
     ========================= */

  else {

    trail = [

      {
        name: "Home",
        href: "index.html"
      },

      {
        name: pageName
      }

    ]

  }


  /* =======================================================
     RENDER
     ======================================================= */

  container.innerHTML =
    trail
      .map(
        (item, index) => {

          const isCurrent =
            index ===
            trail.length - 1


          const separator =
            index > 0
              ? `<span class="breadcrumb-separator">/</span>`
              : ""


          const content =
            isCurrent

            ? `<span class="breadcrumb-current">${item.name}</span>`

                : item.name === "Home"

                  ? `
                    <a class="breadcrumb-link breadcrumb-home" href="${item.href}">
                      <svg class="breadcrumb-home-icon" aria-hidden="true">
                        <use href="#icon-home"></use>
                      </svg>
                      <span>Home</span>
                    </a>
                  `

                  : `<a class="breadcrumb-link" href="${item.href}">${item.name}</a>`


          return (
            separator +
            content
          )

        }
      )
      .join("")

}


/* =========================================================
   INITIAL LOAD
   ========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    updateBreadcrumb()

  }
)