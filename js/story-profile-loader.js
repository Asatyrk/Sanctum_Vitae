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

  /*
    Universal story URL:

    story-profile.html?story=test

    ALWAYS loads:

    stories/test.json

    The JSON "name" and "url" fields are NOT
    used to find the JSON file.
  */

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

  /*
    "name" is display text only.

    It does NOT determine the filename.
  */

  const name =
    story.name ||
    "Untitled Story"


  /* -------------------------------------------------------
     Browser title
  ------------------------------------------------------- */

  document.title =
    name


  /* -------------------------------------------------------
     Page identifier
  ------------------------------------------------------- */

  document.body.dataset.page =
    slugify(name)


  /* -------------------------------------------------------
     Main name
  ------------------------------------------------------- */

  setText(
    "name",
    name
  )


  /* -------------------------------------------------------
     Navigation name
  ------------------------------------------------------- */

  setText(
    "story-navigation",
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

  if (!colors) {
    return
  }


  const root =
    document.documentElement


  if (colors.primary) {

    root.style.setProperty(
      "--story-primary",
      colors.primary
    )

  }


  if (colors.secondary) {

    root.style.setProperty(
      "--story-secondary",
      colors.secondary
    )

  }


  if (colors.accent) {

    root.style.setProperty(
      "--story-accent",
      colors.accent
    )

  }


  if (colors.bg_1) {

    root.style.setProperty(
      "--story-bg-1",
      colors.bg_1
    )

  }


  if (colors.bg_2) {

    root.style.setProperty(
      "--story-bg-2",
      colors.bg_2
    )

  }


  if (colors.page_bg) {

    root.style.setProperty(
      "--story-page-bg",
      colors.page_bg
    )

  }

}


/* =========================================================
   START
========================================================= */

loadStory()