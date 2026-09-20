/* =========================================================
   STORY PROFILE LOADER
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


function getStory(){

  const params =
    new URLSearchParams(
      window.location.search
    )

  return params.get("story")

}


function setPageTitle(name){

  const title =
    name || "Unknown Story"

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
   Stories use the same colour format as characters.

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

function applyStoryColors(story){

  const colors =
    story?.colors || {}

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


function getStorySlug(file){

  return String(file ?? "")
    .replace(/^stories\//, "")
    .replace(/\.json$/, "")
    .split("/")
    .pop()

}


function getStoryProfileUrl(file){

  const slug =
    getStorySlug(
      file
    )

  return (
    `story-profile.html?story=${encodeURIComponent(slug)}`
  )

}


function getCharacterProfileUrl(file){

  const path =
    String(file ?? "")
      .replace(/^\/+/, "")

  const filename =
    path
      .split("/")
      .pop()

  const slug =
    filename
      .replace(/\.json$/i, "")

  /* =========================
     PETS
     characters/pets/*.json
     ========================= */

  if(
    path.startsWith("characters/pets/")
  ){

    return (
      `pet-profile.html?char=${encodeURIComponent(slug)}`
    )

  }

  /* =========================
     OTHERLY OWNED
     characters/otherly_owned/*.json
     ========================= */

  if(
    path.startsWith("characters/otherly_owned/")
  ){

    return (
      `otherly-owned-profile.html?char=${encodeURIComponent(slug)}`
    )

  }

  /* =========================
     NORMAL CHARACTERS
     characters/*.json
     ========================= */

  return (
    `character-profile.html?char=${encodeURIComponent(slug)}`
  )

}



/* =========================================================
   FETCH HELPERS
   ========================================================= */

async function fetchStory(
  path,
  errorMessage = "Story not found"
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


async function fetchStoryCharacter(
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
   LOAD STORY
   ========================================================= */

async function loadStory(){

  const slug =
    getStory()

  if(!slug){

    showStoryError(
      "No Story Selected",
      "No story was specified."
    )

    return

  }

  try{

    const storyPath =
      `stories/${slug}.json`

    const story =
      await fetchStory(
        storyPath,
        `Story not found: ${storyPath}`
      )

    await displayStory(
      story
    )

    await setupStoryNavigation(
      "stories/index.json"
    )

  }catch(error){

    console.error(
      "Could not load story:",
      error
    )

    showStoryError(
      "Story Not Found",
      "The requested story could not be loaded."
    )

  }

}


/* =========================================================
   ERROR DISPLAY
   ========================================================= */

function showStoryError(
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
   DISPLAY STORY
   ========================================================= */

async function displayStory(
  story
){

  /* =========================
     COLOURS
     ========================= */

  applyStoryColors(
    story
  )


  const name =
    text(
      story.name
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
  name

  document.body.dataset.breadcrumbParent =
    "Factions"

  if (typeof updateBreadcrumb === "function") {
    updateBreadcrumb()
  }


  /* =========================
     NAME
     ========================= */

  setText(
    "name",
    name
  )


  /* =========================
     STORY BANNER TITLE
     ========================= */

  const storyTitle =
    document.querySelector(
      ".detail-banner-header h2"
    )

  if(storyTitle){

    storyTitle.textContent =
      name

  }


  /* =========================
     TAGLINE
     ========================= */

  const tagline =
    document.querySelector(
      ".story-page-tagline"
    )

  if(tagline){

    const hasTagline =
      story.tagline !== undefined &&
      story.tagline !== null &&
      story.tagline !== ""

    if(hasTagline){

      tagline.textContent =
        `"${story.tagline}"`

      tagline.hidden =
        false

    }else{

      tagline.textContent =
        ""

      tagline.hidden =
        true

    }

  }


  /* =========================
     IMAGES
     ========================= */

  populateStoryImages(
    story
  )


  /* =========================
     TAGS
     ========================= */

  const tags =
    story.tags || {}

  setText(
    "genre",
    getTagValue(
      tags,
      "Genre"
    )
  )

  setText(
    "age-range",
    getTagValue(
      tags,
      "Age Range"
    )
  )

  setText(
    "status",
    getTagValue(
      tags,
      "Status"
    )
  )

  setText(
    "story-type",
    getTagValue(
      tags,
      "Story Type"
    )
  )


  /* =========================
     DESCRIPTION
     ========================= */

  populateDescription(
    story.description
  )


  /* =========================
     CHARACTERS
     ========================= */

  await populateCharacters(
    story.characters
  )


  /* =========================
     STORY CONTENT
     ========================= */

  populateStoryContent(
    story.story
  )

}


/* =========================================================
   STORY IMAGES
   ========================================================= */

function populateStoryImages(
  story
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
      story.avatar,
      "https://placehold.co/240x240"
    )

  }


  /* =========================
     BANNER
     ========================= */

  const banner =
    document.getElementById(
      "banner-image"
    )

  if(banner){

    setBackgroundImage(
      banner,
      story.banner,
      "https://placehold.co/1200x400"
    )

  }


  /* =========================
     STORY BACKGROUND
     ========================= */

  const storyBackground =
    document.getElementById(
      "story-background"
    )

  if(storyBackground){

    setBackgroundImage(
      storyBackground,
      story.background
    )

  }

}


/* =========================================================
   STORY NAVIGATION
   ========================================================= */

async function setupStoryNavigation(
  indexPath
){

  const currentSlug =
    getStory()

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
          getStorySlug(
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
      "story-navigation"
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
    getStoryProfileUrl(
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
    getStoryProfileUrl(
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
        await fetchStoryCharacter(
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
   STORY CONTENT
   ========================================================= */

function populateStoryContent(storyContent) {
  const container = document.getElementById("backstory");

  if (!container || !Array.isArray(storyContent)) {
    return;
  }

  container.innerHTML = storyContent
    .filter(Boolean)
    .join("");
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

    loadStory()

  }
)