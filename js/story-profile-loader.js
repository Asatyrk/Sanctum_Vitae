/* =========================================================
   STORY PROFILE LOADER
   ========================================================= */


/* =========================================================
   HELPERS
   ========================================================= */

function getStory() {

  const params =
    new URLSearchParams(
      window.location.search
    )

  return params.get("story") || ""

}


function setText(id, value) {

  const element =
    document.getElementById(id)

  if (!element) return

  element.textContent =
    value ?? ""

}


function setPageTitle(name) {

  const title =
    name || "Unknown Story"

  const pageTitle =
    document.getElementById(
      "page-title"
    )

  if (pageTitle) {

    pageTitle.textContent =
      title

  }

  document.title =
    "Sanctum Vitae | " + title

}


/* =========================================================
   IMAGE HELPERS
   ========================================================= */

function setBackgroundImage(
  element,
  url,
  fallback = ""
) {

  if (!element) return

  if (!url) {

    element.style.backgroundImage =
      fallback
        ? `url("${fallback}")`
        : ""

    return

  }

  const image =
    new Image()

  image.onload = () => {

    element.style.backgroundImage =
      `url("${url}")`

  }

  image.onerror = () => {

    element.style.backgroundImage =
      fallback
        ? `url("${fallback}")`
        : ""

  }

  image.src =
    url

}


function addImageFallback(
  element,
  imageUrl,
  fallbackUrl
) {

  if (!element) return

  if (!imageUrl) {

    element.style.backgroundImage =
      `url("${fallbackUrl}")`

    return

  }

  const image =
    new Image()

  image.onload = () => {

    element.style.backgroundImage =
      `url("${imageUrl}")`

  }

  image.onerror = () => {

    element.style.backgroundImage =
      `url("${fallbackUrl}")`

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
) {

  const values =
    tags?.[category]

  if (!Array.isArray(values)) {
    return ""
  }

  return values.join(" / ")

}


/* =========================================================
   SLUG HELPERS
   ========================================================= */

function slugify(value) {

  return String(value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

}


function getStorySlug(file) {

  return String(file ?? "")
    .replace(/^stories\//, "")
    .replace(/\.json$/, "")
    .split("/")
    .pop()

}


function getStoryProfileUrl(file) {

  const slug =
    getStorySlug(file)

  return (
    `story-profile.html?story=${encodeURIComponent(slug)}`
  )

}


/* =========================================================
   LOAD STORY
   ========================================================= */

async function loadStory() {

  const slug =
    getStory()


  if (!slug) {

    showStoryError(
      "No Story Selected",
      "No story was specified."
    )

    return

  }


  try {

    const storyPath =
      `stories/${slug}.json`


    const response =
      await fetch(
        storyPath
      )


    if (!response.ok) {

      throw new Error(
        `Failed to load ${storyPath}`
      )

    }


    const story =
      await response.json()


    populateStory(
      story
    )


    await setupStoryNavigation(
      "stories/index.json"
    )


  } catch (error) {

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
) {

  const page =
    document.querySelector(
      ".page-container"
    )

  if (!page) return

  page.innerHTML =
    `
      <h1>${title}</h1>
      <p>${message}</p>
    `

}


/* =========================================================
   POPULATE STORY
   ========================================================= */

function populateStory(story) {

  const name =
    story.name ||
    "Untitled Story"


  /* -------------------------------------------------------
     HEADER / PAGE TITLE
     ------------------------------------------------------- */

  const headerLogoText =
    document.querySelector(
      ".site-logo-text"
    )


  if (headerLogoText) {

    headerLogoText.textContent =
      `Sanctum Vitae | ${name}`

  }


  setPageTitle(
    name
  )


  document.body.dataset.page =
    slugify(name)


  setText(
    "name",
    name
  )


  /* -------------------------------------------------------
     STORY DETAIL BANNER TITLE
     ------------------------------------------------------- */

  const storyTitle =
    document.querySelector(
      ".story-detail-banner-header h2"
    )


  if (storyTitle) {

    storyTitle.textContent =
      name

  }


  /* -------------------------------------------------------
     TAGLINE
     ------------------------------------------------------- */

  const tagline =
    document.querySelector(
      ".story-page-tagline"
    )


  if (tagline) {

    if (story.tagline) {

      tagline.textContent =
        `"${story.tagline}"`

      tagline.hidden =
        false

    } else {

      tagline.textContent =
        ""

      tagline.hidden =
        true

    }

  }


  /* -------------------------------------------------------
     IMAGES
     ------------------------------------------------------- */

  populateStoryImages(
    story
  )


  /* -------------------------------------------------------
     TAGS
     ------------------------------------------------------- */

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


  /* -------------------------------------------------------
     DESCRIPTION
     ------------------------------------------------------- */

  populateDescription(
    story.description
  )


  /* -------------------------------------------------------
     CHARACTERS
     ------------------------------------------------------- */

  populateCharacters(
    story.characters
  )


  /* -------------------------------------------------------
     STORY CONTENT
     ------------------------------------------------------- */

  populateStoryContent(
    story.story
  )


  /* -------------------------------------------------------
     COLOURS
     ------------------------------------------------------- */

  applyStoryColors(
    story.colors
  )

}


/* =========================================================
   STORY IMAGES
   ========================================================= */

function populateStoryImages(story) {

  /* -------------------------------------------------------
     Avatar
     ------------------------------------------------------- */

  const avatar =
    document.getElementById(
      "avatar-image"
    )


  if (avatar) {

    addImageFallback(
      avatar,
      story.avatar,
      "https://placehold.co/240x240"
    )

  }


  /* -------------------------------------------------------
     Banner
     ------------------------------------------------------- */

  const banner =
    document.getElementById(
      "banner-image"
    )


  if (banner) {

    addImageFallback(
      banner,
      story.banner,
      "https://placehold.co/1200x400"
    )

  }


  /* -------------------------------------------------------
     Story background
     ------------------------------------------------------- */

  const storyBackground =
    document.getElementById(
      "story-background"
    )


  if (storyBackground) {

    setBackgroundImage(
      storyBackground,
      story.background
    )

  }


  /* -------------------------------------------------------
     Decor image
     ------------------------------------------------------- */

  const fallbackDecor =
    "https://placehold.co/1000x100"


  const decorImage =
    typeof story.decorImage === "string" &&
    story.decorImage.trim() !== ""
      ? story.decorImage.trim()
      : fallbackDecor


  const decorBoxes = [

    document.getElementById(
      "decor-image"
    )

  ].filter(Boolean)


  decorBoxes.forEach(
    box => {

      setBackgroundImage(
        box,
        decorImage,
        fallbackDecor
      )

    }
  )

}


/* =========================================================
   STORY NAVIGATION
   ========================================================= */

async function setupStoryNavigation(
  indexPath
) {

  const navigation =
    document.getElementById(
      "story-navigation"
    )


  if (!navigation) {
    return
  }


  navigation.innerHTML =
    ""


  try {

    const response =
      await fetch(
        indexPath
      )


    if (!response.ok) {

      throw new Error(
        `Failed to load ${indexPath}`
      )

    }


    const stories =
      await response.json()


    if (
      !Array.isArray(stories) ||
      stories.length === 0
    ) {

      return

    }


    const currentSlug =
      getStory()


    const currentIndex =
      stories.findIndex(
        entry => {

          const storySlug =
            getStorySlug(
              entry.path
            )

          return storySlug === currentSlug

        }
      )


    if (currentIndex === -1) {
      return
    }


    /* -----------------------------------------------------
       Previous / next
       ----------------------------------------------------- */

    const previousIndex =
      (
        currentIndex - 1 + stories.length
      ) % stories.length


    const nextIndex =
      (
        currentIndex + 1
      ) % stories.length


    const previous =
      stories[
        previousIndex
      ]


    const next =
      stories[
        nextIndex
      ]


    /* -----------------------------------------------------
       Previous link
       ----------------------------------------------------- */

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


    /* -----------------------------------------------------
       Separator
       ----------------------------------------------------- */

    const separator =
      document.createTextNode(
        " | "
      )


    /* -----------------------------------------------------
       Next link
       ----------------------------------------------------- */

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


    /* -----------------------------------------------------
       Insert navigation
       ----------------------------------------------------- */

    navigation.appendChild(
      previousLink
    )


    navigation.appendChild(
      separator
    )


    navigation.appendChild(
      nextLink
    )

  } catch (error) {

    console.error(
      "Could not setup story navigation:",
      error
    )

  }

}


/* =========================================================
   DESCRIPTION
   ========================================================= */

function populateDescription(
  description
) {

  const container =
    document.getElementById(
      "description"
    )


  if (!container) {
    return
  }


  container.innerHTML =
    ""


  if (!Array.isArray(description)) {
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
) {

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


  if (
    !section ||
    !container ||
    !template
  ) {

    return

  }


  container.innerHTML =
    ""


  if (
    !Array.isArray(characters) ||
    characters.length === 0
  ) {

    section.hidden =
      true

    return

  }


  section.hidden =
    false


  const characterResults =
    await Promise.all(

      characters.map(
        async character => {

          if (
            !character ||
            !character.url
          ) {

            return null

          }


          try {

            const response =
              await fetch(
                character.url
              )


            if (!response.ok) {

              throw new Error(
                `Failed to load ${character.url}`
              )

            }


            const data =
              await response.json()


            return {

              ...data,

              label:
                character.label || "",

              url:
                character.url

            }


          } catch (error) {

            console.error(
              "Could not load character:",
              character.url,
              error
            )

            return null

          }

        }
      )

    )


  characterResults
    .filter(Boolean)
    .forEach(
      character => {

        const fragment =
          template.content.cloneNode(
            true
          )


        const link =
          fragment.querySelector(
            ".story-relationship-avatar-link"
          )


        const avatar =
          fragment.querySelector(
            ".story-relationship-avatar"
          )


        const name =
          fragment.querySelector(
            ".story-relationship-name"
          )


        const type =
          fragment.querySelector(
            ".story-relationship-type"
          )


        /* -------------------------------------------------
           Name
           ------------------------------------------------- */

        if (name) {

          name.textContent =
            character.name ||
            "Unnamed Character"

        }


        /* -------------------------------------------------
           Relationship label
           ------------------------------------------------- */

        if (type) {

          type.textContent =
            character.label

        }


        /* -------------------------------------------------
           Avatar
           ------------------------------------------------- */

        if (avatar) {

          setBackgroundImage(
            avatar,
            character.avatar,
            "https://placehold.co/120"
          )

        }


        /* -------------------------------------------------
           Character profile link
           ------------------------------------------------- */

        if (link) {

          const characterPath =
            character.url


          const characterSlug =
            characterPath
              .replace(/^characters\//, "")
              .replace(/\.json$/, "")


          link.href =
            `character-profile.html?char=${encodeURIComponent(
              characterSlug
            )}`

        }


        container.appendChild(
          fragment
        )

      }
    )


  if (!container.children.length) {

    section.hidden =
      true

  }

}


/* =========================================================
   STORY CONTENT
   ========================================================= */

function populateStoryContent(
  storyContent
) {

  const container =
    document.getElementById(
      "backstory"
    )


  if (!container) {
    return
  }


  if (!Array.isArray(storyContent)) {

    container.innerHTML =
      ""

    return

  }


  /*
    Story JSON contains HTML strings.
    These are inserted directly.
  */

  container.innerHTML =
    storyContent
      .filter(Boolean)
      .join("\n")

}


/* =========================================================
   STORY COLOURS
   ========================================================= */

function applyStoryColors(
  colors
) {

  const root =
    document.documentElement


  const storyColors =
    colors || {}


  const primary =
    storyColors.primary ||
    "#b99b78"


  const secondary =
    storyColors.secondary ||
    "#a27d5f"


  const accent =
    storyColors.accent ||
    "#8b6a4d"


  const bg1 =
    storyColors.bg_1 ||
    "#f4efe6"


  const bg2 =
    storyColors.bg_2 ||
    "#f3f1ec"


  const pageBg =
    storyColors.page_bg ||
    "#f3f1ec"


  /* -------------------------------------------------------
     CSS variables
     ------------------------------------------------------- */

  root.style.setProperty(
    "--story-primary",
    primary
  )


  root.style.setProperty(
    "--story-secondary",
    secondary
  )


  root.style.setProperty(
    "--story-accent",
    accent
  )


  root.style.setProperty(
    "--story-bg-1",
    bg1
  )


  root.style.setProperty(
    "--story-bg-2",
    bg2
  )


  root.style.setProperty(
    "--story-page-bg",
    pageBg
  )


  /* -------------------------------------------------------
     Story navigation / header title colour
     ------------------------------------------------------- */

  const headerLogoText =
    document.querySelector(
      ".site-logo-text"
    )


  if (headerLogoText) {

    headerLogoText.style.color =
      primary

  }


  /* -------------------------------------------------------
     Story detail banner title
     ------------------------------------------------------- */

  const storyTitle =
    document.querySelector(
      ".story-detail-banner-header h2"
    )


  if (storyTitle) {

    storyTitle.style.color =
      primary

  }

}


/* =========================================================
   START
   ========================================================= */

loadStory()