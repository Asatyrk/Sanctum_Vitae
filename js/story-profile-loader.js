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

  if (!element) {
    return
  }

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


function setBackgroundImage(
  element,
  url,
  fallback = ""
) {

  if (!element) {
    return
  }

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


function getTagValue(tags, category) {

  const values =
    tags?.[category]

  if (!Array.isArray(values)) {
    return ""
  }

  return values.join(" / ")

}


function slugify(value) {

  return String(value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

}


/* =========================================================
   LOAD STORY
========================================================= */

async function loadStory() {

  const slug =
    getStory()


  if (!slug) {

    const page =
      document.querySelector(
        ".page-container"
      )

    if (page) {

      page.innerHTML =
        "<h1>No Story Selected</h1>" +
        "<p>No story was specified.</p>"

    }

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

    setupStoryNavigation(
      "stories/index.json"
    )


  } catch (error) {

    console.error(
      "Could not load story:",
      error
    )


    const page =
      document.querySelector(
        ".page-container"
      )


    if (page) {

      page.innerHTML =
        "<h1>Story Not Found</h1>" +
        `<p>The requested story could not be loaded.</p>`

    }

  }

}


/* =========================================================
   POPULATE STORY
========================================================= */

function populateStory(story) {

  const name =
  story.name ||
  "Untitled Story"


/* -------------------------------------------------------
   Page title + header
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
     Story box title
  ------------------------------------------------------- */

  const storyTitle =
    document.querySelector(
      ".detail-banner-header h2"
    )


  if (storyTitle) {

    storyTitle.textContent =
      name

  }


  /* -------------------------------------------------------
     Tagline
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
     Avatar
  ------------------------------------------------------- */

  const avatar =
    document.getElementById(
      "avatar-image"
    )


  if (avatar) {

    avatar.dataset.image =
      story.avatar || ""

    addImageFallback(
      avatar,
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

    banner.dataset.image =
      story.banner || ""

    addImageFallback(
      banner,
      "https://placehold.co/1200x400"
    )

  // =========================
  // DECOR IMAGE
  // =========================

  const decorImage =
    character.decorImage

  const fallbackImageUrl =
    "https://placehold.co/1000x100"

  const boxes = [
    document.getElementById(
      "decor-image"
    )
  ].filter(Boolean)


  function setDecorImage(
    box,
    imageUrl
  ){

    if(!box) return

    const testImage =
      new Image()

    testImage.onload =
      () => {

        box.style.backgroundImage =
          `url("${imageUrl}")`

      }

    testImage.onerror =
      () => {

        box.style.backgroundImage =
          `url("${fallbackImageUrl}")`

      }

    testImage.src =
      imageUrl

  }


  const finalImageUrl =
    typeof decorImage === "string" &&
    decorImage.trim() !== ""
      ? decorImage.trim()
      : fallbackImageUrl


  boxes.forEach(
    box => {

      setDecorImage(
        box,
        finalImageUrl
      )

    }
  )

}


  /* -------------------------------------------------------
     Background
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
     Tags
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
     Description
  ------------------------------------------------------- */

  populateDescription(
    story.description
  )


  /* -------------------------------------------------------
     Characters
  ------------------------------------------------------- */

  populateCharacters(
    story.characters
  )


  /* -------------------------------------------------------
     Story content
  ------------------------------------------------------- */

  populateStoryContent(
    story.story
  )


  /* -------------------------------------------------------
     Colours
  ------------------------------------------------------- */

  applyStoryColors(
    story.colors
  )

}

async function setupStoryNavigation(indexPath) {

  const navigation =
    document.getElementById("story-navigation")

  if (!navigation) {
    return
  }

  navigation.innerHTML = ""

  try {

    const response =
      await fetch(indexPath)

    if (!response.ok) {
      throw new Error(
        `Failed to load ${indexPath}`
      )
    }

    const stories =
      await response.json()

    if (!Array.isArray(stories) || !stories.length) {
      return
    }

    const currentSlug =
      getStory()

    const currentIndex =
      stories.findIndex(story => {

        const path =
          story.path || ""

        return path
          .replace(/^stories\//, "")
          .replace(/\.json$/, "") === currentSlug

      })

    if (currentIndex === -1) {
      return
    }

    const previous =
      stories[
        (currentIndex - 1 + stories.length) %
        stories.length
      ]

    const next =
      stories[
        (currentIndex + 1) %
        stories.length
      ]

    const previousLink =
      document.createElement("a")

    previousLink.href =
      getProfileUrl(previous.path)

    previousLink.textContent =
      "← Previous"

    const separator =
      document.createTextNode(" | ")

    const nextLink =
      document.createElement("a")

    nextLink.href =
      getProfileUrl(next.path)

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

function populateDescription(description) {

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
    .forEach(paragraph => {

      const item =
        document.createElement("li")


      item.textContent =
        paragraph


      container.appendChild(
        item
      )

    })

}


/* =========================================================
   CHARACTERS
========================================================= */

async function populateCharacters(characters) {

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
    !characters.length
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

          try {

            /*
              Universal character rule:

              "url": "characters/test.json"

              loads that exact JSON file.
            */

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
    .forEach(character => {

      const fragment =
        template.content.cloneNode(true)


      const link =
        fragment.querySelector(
          ".relationship-avatar-link"
        )


      const avatar =
        fragment.querySelector(
          ".relationship-avatar"
        )


      const name =
        fragment.querySelector(
          ".relationship-name"
        )


      const type =
        fragment.querySelector(
          ".relationship-type"
        )


      /* ---------------------------------------------------
         Name
      --------------------------------------------------- */

      if (name) {

        name.textContent =
          character.name ||
          "Unnamed Character"

      }


      /* ---------------------------------------------------
         Relationship label
      --------------------------------------------------- */

      if (type) {

        type.textContent =
          character.label

      }


      /* ---------------------------------------------------
         Avatar
      --------------------------------------------------- */

      if (
        avatar &&
        character.avatar
      ) {

        setBackgroundImage(
          avatar,
          character.avatar
        )

      }


      /* ---------------------------------------------------
         Character link
         
         characters/test.json

         becomes:

         character-profile.html?character=test
      --------------------------------------------------- */

      if (link) {

        const characterPath =
          character.url


        const characterSlug =
          characterPath
            .replace(/^characters\//, "")
            .replace(/\.json$/, "")


        link.href =
          `character-profile.html?character=${encodeURIComponent(
            characterSlug
          )}`

      }


      container.appendChild(
        fragment
      )

    })


  if (!container.children.length) {

    section.hidden =
      true

  }

}


/* =========================================================
   STORY CONTENT
========================================================= */

function populateStoryContent(storyContent) {

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
    The JSON contains HTML strings,
    so insert them directly.
  */

  container.innerHTML =
    storyContent
      .filter(Boolean)
      .join("\n")

}


/* =========================================================
   IMAGE FALLBACK
========================================================= */

function addImageFallback(
  element,
  fallbackUrl
) {

  const image =
    new Image()


  image.onload = () => {

    element.style.backgroundImage =
      `url("${element.dataset.image}")`

  }


  image.onerror = () => {

    element.style.backgroundImage =
      `url("${fallbackUrl}")`

  }


  if (!element.dataset.image) {

    element.style.backgroundImage =
      `url("${fallbackUrl}")`

    return

  }


  image.src =
    element.dataset.image

}


/* =========================================================
   STORY COLOURS
========================================================= */

function applyStoryColors(colors) {

  const root =
    document.documentElement

  const storyColors =
    colors || {}

  const primary =
    storyColors.primary || "#b99b78"

  const secondary =
    storyColors.secondary || "#a27d5f"

  const accent =
    storyColors.accent || "#8b6a4d"

  const bg1 =
    storyColors.bg_1 || "#f4efe6"

  const bg2 =
    storyColors.bg_2 || "#f3f1ec"

  const pageBg =
    storyColors.page_bg || "#f3f1ec"


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

}



/* =========================================================
   START
========================================================= */

loadStory()