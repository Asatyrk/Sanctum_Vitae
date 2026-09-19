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

return params.get("story")

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

function setBackgroundImage(element, url, fallback = "") {

  if (!element) {
    return
  }

  // No image supplied
  if (!url) {

    if (fallback) {
      element.style.backgroundImage = `url("${fallback}")`
    } else {
      element.style.backgroundImage = ""
    }

    return
  }

  const image = new Image()

  image.onload = () => {

    element.style.backgroundImage =
      `url("${url}")`

  }

  image.onerror = () => {

    if (fallback) {

      element.style.backgroundImage =
        `url("${fallback}")`

    } else {

      element.style.backgroundImage = ""

    }

  }

  image.src = url
}


function getTagValue(tags, category) {

const values =
tags?.[category]

if (!Array.isArray(values)) {
return ""
}

return values.join(" / ")

}

/* =========================================================
LOAD STORY
========================================================= */

async function loadStory() {

  const slug =
    getStory()


  if (!slug) {

    document.body.innerHTML =
      "No story selected"

    return

  }


  try {

    const response =
      await fetch(
        `stories/${slug}.json`
      )


    if (!response.ok) {

      throw new Error(
        `Story not found: ${slug}`
      )

    }


    const story =
      await response.json()


    populateStory(
      story
    )


  } catch (error) {

    console.error(
      error
    )


    const page =
      document.querySelector(
        ".page-container"
      )


    if (page) {

      page.innerHTML =
        "<h1>Story Not Found</h1>" +
        "<p>The requested story does not exist.</p>"

    }

  }

}

/* =========================================================
POPULATE STORY
========================================================= */

function populateStory(story) {

/* -------------------------------------------------------
Basic information
------------------------------------------------------- */

const name =
story.name || "Untitled Story"

document.title =
name

document.body.dataset.page =
slugify(name)

setText(
"name",
name
)

setText(
"story-navigation",
name
)

/* -------------------------------------------------------
Tagline
------------------------------------------------------- */

const tagline =
document.querySelector(".story-page-tagline")

if (tagline) {

if (story.tagline) {

  tagline.textContent =
    `"${story.tagline}"`

  tagline.hidden = false

} else {

  tagline.hidden = true

}


}

/* -------------------------------------------------------
Avatar
------------------------------------------------------- */

const avatar =
  document.getElementById("avatar-image")

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
  document.getElementById("banner-image")

if (banner) {

  banner.dataset.image =
    story.banner || ""

  addImageFallback(
    banner,
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
story.story,
name
)

/* -------------------------------------------------------
Optional colour variables
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

container.innerHTML = ""

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

container.innerHTML = ""

if (
!Array.isArray(characters) ||
!characters.length
) {

section.hidden = true

return


}

section.hidden = false

const characterResults =
await Promise.all(

  characters.map(
    async character => {

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


  const characterName =
    character.name ||
    "Unnamed Character"


  /* Name */

  if (name) {

    name.textContent =
      characterName

  }


  /* Relationship label */

  if (type) {

    type.textContent =
      character.label

  }


  /* Avatar */

  if (
    avatar &&
    character.avatar
  ) {

    setBackgroundImage(
      avatar,
      character.avatar
    )

  }


  /* Character link */

  if (link) {

    link.href =
      character.url
        .replace(/\.json$/, ".html")

  }


  container.appendChild(
    fragment
  )

})


if (!container.children.length) {

section.hidden = true


}

}

/* =========================================================
STORY CONTENT
========================================================= */

function populateStoryContent(
storyContent,
storyName
) {

const container =
document.getElementById(
"backstory"
)

if (!container) {
return
}

/* -------------------------------------------------------
Story title
------------------------------------------------------- */

const title =
document.querySelector(
".detail-banner-header h2"
)

if (title) {

title.textContent =
  storyName


}

/* -------------------------------------------------------
Story HTML
------------------------------------------------------- */

if (!Array.isArray(storyContent)) {

container.innerHTML = ""

return


}

container.innerHTML =
storyContent
.filter(Boolean)
.join("\n")

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
ERROR STATE
========================================================= */

function showStoryError() {

const main =
document.querySelector(
".page-container"
)

if (!main) {
return
}

const message =
document.createElement("p")

message.className =
"story-no-results"

message.textContent =
"The story could not be loaded."

main.prepend(
message
)

}

/* =========================================================
SLUGIFY
========================================================= */

function slugify(value) {

return String(value ?? "")
.toLowerCase()
.replace(/[^a-z0-9]+/g, "-")
.replace(/^-+|-+$/g, "")

}

/* =========================================================
START
========================================================= */

loadStory()