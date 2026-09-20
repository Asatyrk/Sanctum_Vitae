/* =========================================================
   FACTION PROFILE LOADER
   ========================================================= */


/* =========================================================
   HELPERS
   ========================================================= */

function text(value){

  if(
    value === undefined ||
    value === null ||
    value === ""
  ){

    return "N/A"

  }

  return value

}


function list(value){

  if(!value) return ""

  if(Array.isArray(value)){

    if(value.length === 0) return ""

    return value.join(", ")

  }

  return value

}


function getFaction(){

  const params =
    new URLSearchParams(
      window.location.search
    )

  return params.get("faction")

}


function setPageTitle(name){

  const title =
    name || "Unknown Faction"

  const pageTitle =
    document.getElementById(
      "page-title"
    )

  if(pageTitle){

    pageTitle.textContent =
      title

  }

  document.title =
    "Sanctum Vitae | " + title

}


function setText(id, value){

  const element =
    document.getElementById(
      id
    )

  if(!element) return

  element.textContent =
    text(value)

}


/* =========================================================
   CHARACTER-STYLE COLOURS
   =========================================================
   Factions use the same colour format as characters.

   Supported:
   - colors.primary
   - colors.secondary
   - colors.accent
   - colors.bg_1
   - colors.bg_2
   - colors.page_bg

   No particle, text-gradient, or page-gradient rules are
   applied here.
   ========================================================= */

function applyFactionColors(faction){

  const colors =
    faction?.colors || {}

  const primary =
    colors.primary || "#b99b78"

  const secondary =
    colors.secondary || "#a27d5f"

  const accent =
    colors.accent || "#8b6a4d"

  const bg1 =
    colors.bg_1 || "#f4efe6"

  const bg2 =
    colors.bg_2 || "#f3f1ec"

  const pageBg =
    colors.page_bg || "#f3f1ec"

  const root =
    document.documentElement

  root.style.setProperty(
    "--char-primary",
    primary
  )

  root.style.setProperty(
    "--char-secondary",
    secondary
  )

  root.style.setProperty(
    "--char-accent",
    accent
  )

  root.style.setProperty(
    "--char-bg-1",
    bg1
  )

  root.style.setProperty(
    "--char-bg-2",
    bg2
  )

  root.style.setProperty(
    "--char-page-bg",
    pageBg
  )

}


/* =========================================================
   IMAGE HELPERS
   ========================================================= */

function setBackgroundImage(
  element,
  imageUrl,
  fallbackUrl = ""
){

  if(!element) return

  if(
    typeof imageUrl !== "string" ||
    imageUrl.trim() === ""
  ){

    element.style.backgroundImage =
      fallbackUrl
        ? `url("${fallbackUrl}")`
        : ""

    return

  }

  const image =
    new Image()

  image.onload =
    () => {

      element.style.backgroundImage =
        `url("${imageUrl}")`

    }

  image.onerror =
    () => {

      element.style.backgroundImage =
        fallbackUrl
          ? `url("${fallbackUrl}")`
          : ""

    }

  image.src =
    imageUrl

}


/* =========================================================
   TAG HELPERS
   ========================================================= */

function getTagValue(
  tags,
  category
){

  const values =
    tags?.[category]

  if(!Array.isArray(values)){

    return ""

  }

  return values.join(
    " / "
  )

}


/* =========================================================
   SLUG HELPERS
   ========================================================= */

function slugify(value){

  return String(value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

}


function getFactionSlug(file){

  return String(file ?? "")
    .replace(/^factions\//, "")
    .replace(/\.json$/, "")
    .split("/")
    .pop()

}


function getFactionProfileUrl(file){

  const slug =
    getFactionSlug(
      file
    )

  return (
    `faction-profile.html?faction=${encodeURIComponent(slug)}`
  )

}


function getCharacterProfileUrl(file){

  const slug =
    String(file ?? "")
      .replace(/^characters\//, "")
      .replace(/\.json$/, "")

  return (
    `character-profile.html?char=${encodeURIComponent(slug)}`
  )

}


/* =========================================================
   FETCH HELPERS
   ========================================================= */

async function fetchFaction(
  path,
  errorMessage = "Faction not found"
){

  const response =
    await fetch(
      path
    )

  if(!response.ok){

    throw new Error(
      errorMessage
    )

  }

  return await response.json()

}


async function fetchFactionCharacter(
  path
){

  const response =
    await fetch(
      path
    )

  if(!response.ok){

    throw new Error(
      `Character not found: ${path}`
    )

  }

  return await response.json()

}


/* =========================================================
   LOAD FACTION
   ========================================================= */

async function loadFaction(){

  const slug =
    getFaction()

  if(!slug){

    showFactionError(
      "No Faction Selected",
      "No faction was specified."
    )

    return

  }

  try{

    const factionPath =
      `factions/${slug}.json`

    const faction =
      await fetchFaction(
        factionPath,
        `Faction not found: ${factionPath}`
      )

    await displayFaction(
      faction
    )

    await setupFactionNavigation(
      "factions/index.json"
    )

  }catch(error){

    console.error(
      "Could not load faction:",
      error
    )

    showFactionError(
      "Faction Not Found",
      "The requested faction could not be loaded."
    )

  }

}


/* =========================================================
   ERROR DISPLAY
   ========================================================= */

function showFactionError(
  title,
  message
){

  const page =
    document.querySelector(
      ".page-container"
    )

  if(!page) return

  page.innerHTML = `
    <h1>${title}</h1>
    <p>${message}</p>
  `

}


/* =========================================================
   DISPLAY FACTION
   ========================================================= */

async function displayFaction(
  faction
){

  /* =========================
     COLOURS
     ========================= */

  applyFactionColors(
    faction
  )


  const name =
    text(
      faction.name
    )


  /* =========================
     HEADER
     ========================= */

  const headerLogoText =
    document.querySelector(
      ".site-logo-text"
    )

  if(headerLogoText){

    headerLogoText.textContent =
      `Sanctum Vitae | ${name}`

  }

  setPageTitle(
    name
  )

  document.body.dataset.page =
    slugify(name)


  /* =========================
     NAME
     ========================= */

  setText(
    "name",
    name
  )


  /* =========================
     FACTION BANNER TITLE
     ========================= */

  const factionTitle =
    document.querySelector(
      ".detail-banner-header h2"
    )

  if(factionTitle){

    factionTitle.textContent =
      name

  }

  /* =========================
     IMAGES
     ========================= */

  populateFactionImages(
    faction
  )


  /* =========================
     TAGS
     ========================= */

  const tags =
    faction.tags || {}

  setText(
   "parent_faction(s)",
    getTagValue(
      tags,
      "parent_faction(s)"
    )
  )

  setText(
    "type",
    getTagValue(
      tags,
      "Type"
    )
  )


  /* =========================
     DESCRIPTION
     ========================= */

  populateDescription(
    faction.description
  )


  /* =========================
     CHARACTERS
     ========================= */

  await populateCharacters(
    faction.characters
  )

}


/* =========================================================
   FACTION IMAGES
   ========================================================= */

function populateFactionImages(
  faction
){

  /* =========================
     AVATAR
     ========================= */

  const avatar =
    document.getElementById(
      "avatar-image"
    )

  if(avatar){

    setBackgroundImage(
      avatar,
      faction.avatar,
      "https://placehold.co/240x240"
    )

  }

  /* =========================
     FACTION BACKGROUND
     ========================= */

  const factionBackground =
    document.getElementById(
      "faction-background"
    )

  if(factionBackground){

    setBackgroundImage(
      factionBackground,
      faction.background
    )

  }

}


/* =========================================================
   FACTION NAVIGATION
   ========================================================= */

async function setupFactionNavigation(
  indexPath
){

  const currentSlug =
    getFaction()

  if(!currentSlug){

    return

  }

  const response =
    await fetch(
      indexPath
    )

  if(!response.ok){

    return

  }

  const index =
    await response.json()

  if(
    !Array.isArray(index) ||
    index.length === 0
  ){

    return

  }

  const currentIndex =
    index.findIndex(
      entry => {

        const slug =
          getFactionSlug(
            entry.path
          )

        return slug === currentSlug

      }
    )

  if(currentIndex === -1){

    return

  }

  const previousIndex =
    (
      currentIndex - 1 + index.length
    ) % index.length

  const nextIndex =
    (
      currentIndex + 1
    ) % index.length

  const previous =
    index[
      previousIndex
    ]

  const next =
    index[
      nextIndex
    ]

  const navigation =
    document.getElementById(
      "faction-navigation"
    )

  if(!navigation){

    return

  }

  navigation.innerHTML =
    ""

  const previousLink =
    document.createElement(
      "a"
    )

  previousLink.href =
    getFactionProfileUrl(
      previous.path
    )

  previousLink.textContent =
    "← Previous"


  const separator =
    document.createTextNode(
      " | "
    )


  const nextLink =
    document.createElement(
      "a"
    )

  nextLink.href =
    getFactionProfileUrl(
      next.path
    )

  nextLink.textContent =
    "Next →"


  navigation.appendChild(
    previousLink
  )

  navigation.appendChild(
    separator
  )

  navigation.appendChild(
    nextLink
  )

}


/* =========================================================
   DESCRIPTION
   ========================================================= */

function populateDescription(
  description
){

  const container =
    document.getElementById(
      "description"
    )

  if(!container){

    return

  }

  container.innerHTML =
    ""

  if(!Array.isArray(description)){

    return

  }

  description
    .filter(Boolean)
    .forEach(
      paragraph => {

        const item =
          document.createElement(
            "p"
          )

        item.textContent =
          paragraph

        container.appendChild(
          item
        )

      }
    )

}


/* =========================================================
   CHARACTERS
   ========================================================= */

async function populateCharacters(
  characters
){

  const section =
    document.getElementById(
      "relationships-section"
    )

  const container =
    document.getElementById(
      "relationships-container"
    )

  const template =
    document.getElementById(
      "relationship-template"
    )

  if(
    !section ||
    !container ||
    !template
  ){

    return

  }

  if(
    !Array.isArray(characters) ||
    characters.length === 0
  ){

    section.hidden =
      true

    return

  }

  container.innerHTML =
    ""

  let loadedCharacters =
    0


  for(
    const character of characters
  ){

    if(
      !character ||
      !character.url
    ){

      continue

    }

    try{

      const characterData =
        await fetchFactionCharacter(
          character.url
        )


      const characterCard =
        template.content.cloneNode(
          true
        )


      /* =========================
         PROFILE LINK
         ========================= */

      const link =
        characterCard.querySelector(
          ".relationship-avatar-link"
        )

      if(link){

        link.href =
          getCharacterProfileUrl(
            character.url
          )

      }


      /* =========================
         AVATAR
         ========================= */

      const avatar =
        characterCard.querySelector(
          ".relationship-avatar"
        )

      if(avatar){

        setBackgroundImage(
          avatar,
          characterData.avatar,
          "https://placehold.co/120"
        )

      }


      /* =========================
         NAME
         ========================= */

      const name =
        characterCard.querySelector(
          ".relationship-name"
        )

      if(name){

        name.textContent =
          text(
            characterData.name
          )

      }


      /* =========================
         AGE
         ========================= */

      const age =
        characterCard.querySelector(
          ".relationship-age"
        )

      if(age){

        age.textContent =
          text(
            characterData.age
          )

      }


      /* =========================
         PRONOUNS
         ========================= */

      const pronouns =
        characterCard.querySelector(
          ".relationship-pronouns"
        )

      if(pronouns){

        pronouns.textContent =
          text(
            characterData.pronouns
          )

      }


      /* =========================
         SPECIES
         ========================= */

      const species =
        characterCard.querySelector(
          ".relationship-species"
        )

      if(species){

        species.textContent =
          text(
            characterData.species
          )

      }

      /* =========================
         RELATIONSHIP LABEL
         ========================= */

      const type =
        characterCard.querySelector(
          ".relationship-type"
        )

      if(type){

        type.textContent =
          text(
            character.label
          )

      }


      container.appendChild(
        characterCard
      )

      loadedCharacters++


    }catch(error){

      console.error(
        `Could not load character: ${character.url}`,
        error
      )

    }

  }


  section.hidden =
    loadedCharacters === 0

}

/* =========================================================
   DETAIL TABS
   ========================================================= */

function setupDetailTabs(){

  const detailTabs =
    document.querySelectorAll(
      ".detail-switcher-tab"
    )

  const detailPanels =
    document.querySelectorAll(
      ".detail-switcher-panel"
    )

  if(
    !detailTabs.length ||
    !detailPanels.length
  ){

    return

  }


  detailTabs.forEach(
    tab => {

      tab.addEventListener(
        "click",
        () => {

          const targetId =
            tab.getAttribute(
              "aria-controls"
            )

          const targetPanel =
            document.getElementById(
              targetId
            )

          if(!targetPanel) return


          detailTabs.forEach(
            button => {

              button.classList.remove(
                "active"
              )

              button.setAttribute(
                "aria-selected",
                "false"
              )

            }
          )


          detailPanels.forEach(
            panel => {

              panel.hidden =
                true

            }
          )


          tab.classList.add(
            "active"
          )

          tab.setAttribute(
            "aria-selected",
            "true"
          )


          targetPanel.hidden =
            false

        }
      )

    }
  )

}


/* =========================================================
   START
   ========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    setupDetailTabs()

    loadFaction()

  }
)