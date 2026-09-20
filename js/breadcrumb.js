/* Breadcrumb */

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
     PAGE INFORMATION
     ======================================================= */

  const pageName =
    document.body.dataset.page?.trim()

  if(!pageName){
    return
  }


  /* =======================================================
     DETERMINE PROFILE TYPE
     ======================================================= */

  let parent = ""

  if(
    document.body.classList.contains(
      "character-profile-page"
    )
  ){

    parent = "Characters"

  }

  else if(
    document.body.classList.contains(
      "story-profile-page"
    )
  ){

    parent = "Stories"

  }

  else if(
    document.body.classList.contains(
      "faction-profile-page"
    )
  ){

    parent = "Factions"

  }


  /* =======================================================
     PARENT PAGE LINKS
     ======================================================= */

  const parentPages = {

    Characters:
      "characters.html",

    Factions:
      "factions.html",

    Stories:
      "stories.html",

    Lore:
      "lore.html"

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

  else if(
    parent &&
    parentPages[parent]
  ){

    trail = [

      {
        name: "Home",
        href: "index.html"
      },

      {
        name: parent,
        href: parentPages[parent]
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

              : `<a href="${item.href}">${item.name}</a>`


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