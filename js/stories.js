/* =========================================================
   STORY INDEX
========================================================= */


/* =========================================================
   1. TAG CATEGORIES
========================================================= */

const tagCategories = {
  "Genre": [
    "Fantasy",
    "Sci-fi",
    "Romance",
    "Mystery",
    "Thriller",
    "Horror",
    "Western"
  ],

  "Age Range": [
    "Unrated",
    "All ages",
    "Teen [13+]",
    "Mature [16+]",
    "Explicit [18+]"
  ],

  "Status": [
    "Not started",
    "Ongoing",
    "Completed",
    "Hiatus",
    "Cancelled"
  ],

  "Story Type": [
    "Length Unknown",
    "Poem",
    "Micro Story",
    "Short Story",
    "Novelette",
    "Novella",
    "Novel"
  ]
}


/* =========================================================
   2. STATE
========================================================= */

let allStories = []

let selectedTags = {}

let matchMode = "and"


/* =========================================================
   3. LOAD STORIES
========================================================= */

async function loadStories() {

  try {

    const response = await fetch("stories/index.json")

    if (!response.ok) {
      throw new Error(`Failed to load stories/index.json`)
    }

    const index = await response.json()


    allStories = await Promise.all(

      index.map(async entry => {

        const storyResponse = await fetch(entry.path)

        if (!storyResponse.ok) {
          throw new Error(`Failed to load ${entry.path}`)
        }

        const storyData = await storyResponse.json()


        const slug = entry.path
          .replace(".json", "")
          .split("/")
          .pop()


        return {
          ...storyData,
          ...entry,
          slug
        }

      })

    )


    buildTagFilterUI()

    setupControls()

    applyUrlStateToUI()

    renderStories()

  } catch (error) {

    console.error("Could not load stories:", error)

    const grid = document.getElementById("story-grid")

    grid.innerHTML = ""

    const errorMessage = document.createElement("p")

    errorMessage.className = "story-no-results"

    errorMessage.textContent =
      "The story index could not be loaded."

    grid.appendChild(errorMessage)

  }

}


/* =========================================================
   4. URL STATE
========================================================= */

function getUrlState() {

  const params =
    new URLSearchParams(window.location.search)


  const search =
    params.get("search") || ""


  const sort =
    params.get("sort") || "name-asc"


  const mode =
    params.get("mode") || "and"


  const tags = []


  const tagsParam =
    params.get("tags") || ""


  if (tagsParam.trim()) {

    for (const part of tagsParam.split(",")) {

      const separatorIndex =
        part.indexOf("|")


      if (separatorIndex === -1) {
        continue
      }


      const category =
        part.slice(0, separatorIndex)


      const value =
        part.slice(separatorIndex + 1)


      if (category && value) {

        tags.push({
          category,
          value
        })

      }

    }

  }


  return {
    search,
    sort,
    mode,
    tags
  }

}


/* =========================================================
   5. UPDATE URL
========================================================= */

function updateUrlStateInHistory(replace = false) {

  const params =
    new URLSearchParams()


  const searchInput =
    document.getElementById("search-input")


  const sortSelect =
    document.getElementById("sort-select")


  const search =
    searchInput.value.trim()


  const sort =
    sortSelect.value


  if (search) {
    params.set("search", search)
  }


  if (sort && sort !== "name-asc") {
    params.set("sort", sort)
  }


  if (matchMode && matchMode !== "and") {
    params.set("mode", matchMode)
  }


  const tags = []


  const checked =
    document.querySelectorAll(
      "#tag-filters input[type=checkbox]:checked"
    )


  checked.forEach(input => {

    const category =
      input.dataset.category


    const value =
      input.value


    tags.push(
      `${category}|${value}`
    )

  })


  if (tags.length) {

    params.set(
      "tags",
      tags.join(",")
    )

  }


  const query =
    params.toString()


  const newUrl =
    query
      ? `${window.location.pathname}?${query}`
      : window.location.pathname


  if (replace) {

    window.history.replaceState(
      {},
      "",
      newUrl
    )

  } else {

    window.history.pushState(
      {},
      "",
      newUrl
    )

  }

}


/* =========================================================
   6. APPLY URL STATE
========================================================= */

function applyUrlStateToUI() {

  const {
    search,
    sort,
    mode,
    tags
  } = getUrlState()


  document.getElementById(
    "search-input"
  ).value = search


  document.getElementById(
    "sort-select"
  ).value = sort


  document.getElementById(
    "match-mode"
  ).value = mode


  matchMode = mode


  tags.forEach(({ category, value }) => {

    const checkbox =
      Array.from(
        document.querySelectorAll(
          "#tag-filters input[type=checkbox]"
        )
      ).find(input =>
        input.dataset.category === category &&
        input.value === value
      )


    if (checkbox) {
      checkbox.checked = true
    }

  })


  updateSelectedTags()

}


/* =========================================================
   7. RESET FILTERS
========================================================= */

function resetFilters() {

  document.getElementById(
    "search-input"
  ).value = ""


  document.getElementById(
    "sort-select"
  ).value = "name-asc"


  document.getElementById(
    "match-mode"
  ).value = "and"


  matchMode = "and"


  document
    .querySelectorAll(
      "#tag-filters input[type=checkbox]"
    )
    .forEach(checkbox => {
      checkbox.checked = false
    })


  selectedTags = {}

}


/* =========================================================
   8. CONTROLS
========================================================= */

function setupControls() {

  const searchInput =
    document.getElementById("search-input")


  const sortSelect =
    document.getElementById("sort-select")


  const clearButton =
    document.getElementById("clear-filters")


  const matchModeSelect =
    document.getElementById("match-mode")


  searchInput.addEventListener(
    "input",
    () => {

      renderStories()

      updateUrlStateInHistory(true)

    }
  )


  sortSelect.addEventListener(
    "change",
    () => {

      renderStories()

      updateUrlStateInHistory(true)

    }
  )


  matchModeSelect.addEventListener(
    "change",
    () => {

      matchMode =
        matchModeSelect.value


      renderStories()

      updateUrlStateInHistory(true)

    }
  )


  clearButton.addEventListener(
    "click",
    () => {

      resetFilters()

      renderStories()

      updateUrlStateInHistory(true)

    }
  )

}


/* =========================================================
   9. TAG FILTER UI
========================================================= */

function buildTagFilterUI() {

  const container =
    document.getElementById("tag-filters")


  container.innerHTML = ""


  const hasTags =
    Object.values(tagCategories)
      .some(list => list.length)


  if (!hasTags) {

    const placeholder =
      document.createElement("div")


    placeholder.className =
      "tag-placeholder"


    placeholder.textContent =
      "Tag filters will appear once tags are added to stories."


    container.appendChild(
      placeholder
    )


    return

  }


  Object.entries(tagCategories)
    .forEach(([category, tagList]) => {

      const section =
        document.createElement("details")


      section.className =
        "tag-category"


      const summary =
        document.createElement("summary")


      summary.textContent =
        category


      section.appendChild(
        summary
      )


      const list =
        document.createElement("div")


      list.className =
        "tag-list"


      tagList.forEach(tag => {

        const id =
          `tag-${slugify(category)}-${slugify(tag)}`


        const wrapper =
          document.createElement("label")


        wrapper.className =
          "tag-option"


        const checkbox =
          document.createElement("input")


        checkbox.type = "checkbox"

        checkbox.id = id

        checkbox.dataset.category =
          category

        checkbox.value =
          tag


        const text =
          document.createTextNode(tag)


        wrapper.appendChild(
          checkbox
        )

        wrapper.appendChild(
          text
        )


        checkbox.addEventListener(
          "change",
          () => {

            updateSelectedTags()

            renderStories()

            updateUrlStateInHistory(true)

          }
        )


        list.appendChild(
          wrapper
        )

      })


      section.appendChild(
        list
      )


      container.appendChild(
        section
      )

    })


  /* -------------------------------------------------------
     Accordion behaviour
  ------------------------------------------------------- */

  const details =
    container.querySelectorAll(
      "details"
    )


  details.forEach(detail => {

    detail.addEventListener(
      "toggle",
      () => {

        if (!detail.open) {
          return
        }


        details.forEach(other => {

          if (other !== detail) {
            other.open = false
          }

        })

      }
    )

  })

}


/* =========================================================
   10. SLUGIFY
========================================================= */

function slugify(value) {

  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

}


/* =========================================================
   11. SELECTED TAGS
========================================================= */

function updateSelectedTags() {

  selectedTags = {}


  const checked =
    document.querySelectorAll(
      "#tag-filters input[type=checkbox]:checked"
    )


  checked.forEach(input => {

    const category =
      input.dataset.category


    if (!selectedTags[category]) {

      selectedTags[category] =
        new Set()

    }


    selectedTags[category]
      .add(input.value)

  })

}


/* =========================================================
   12. TAG MATCHING
========================================================= */

function matchesTags(story) {

  if (!Object.keys(selectedTags).length) {
    return true
  }


  const categoryMatcher =
    (category, tags) => {

      const storyTags =
        story.tags?.[category] || []


      if (matchMode === "and") {

        return Array.from(tags)
          .every(tag =>
            storyTags.includes(tag)
          )

      }


      return storyTags
        .some(tag =>
          tags.has(tag)
        )

    }


  if (matchMode === "or") {

    return Object.entries(selectedTags)
      .some(([category, tags]) =>
        categoryMatcher(
          category,
          tags
        )
      )

  }


  return Object.entries(selectedTags)
    .every(([category, tags]) =>
      categoryMatcher(
        category,
        tags
      )
    )

}


/* =========================================================
   13. SEARCH
========================================================= */

function matchesSearch(story) {

  const query =
    document
      .getElementById("search-input")
      .value
      .trim()
      .toLowerCase()


  if (!query) {
    return true
  }


  const descriptions =
    Array.isArray(story.description)
      ? story.description
      : [story.description]


  const storyTags =
    Object.values(
      story.tags || {}
    ).flat()


  const haystack = [

    story.name,

    story.tagline,

    ...descriptions,

    ...storyTags

  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()


  return haystack.includes(query)

}


/* =========================================================
   14. SORT STORIES
========================================================= */

function sortStories(stories) {

  const sortKey =
    document
      .getElementById("sort-select")
      .value


  const sorted =
    [...stories]


  if (sortKey === "name-desc") {

    sorted.sort((a, b) =>
      b.name.localeCompare(
        a.name
      )
    )

  } else {

    sorted.sort((a, b) =>
      a.name.localeCompare(
        b.name
      )
    )

  }


  return sorted

}


/* =========================================================
   15. ESCAPE HTML / IMAGE FALLBACK
========================================================= */

function escapeHtml(value) {

  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")

}

function addImageFallback(element, fallbackUrl) {

  const image = new Image()

  image.onload = () => {
    element.style.backgroundImage =
      `url("${element.dataset.image}")`
  }

  image.onerror = () => {
    element.style.backgroundImage =
      `url("${fallbackUrl}")`
  }

  image.src = element.dataset.image

}

/* =========================================================
   16. CREATE STORY CARD
========================================================= */

function createStoryCard(story) {

  const card =
    document.createElement("article")


  card.className =
    "story-card"


  /* -------------------------------------------------------
     Story tags
  ------------------------------------------------------- */

  const storyTagGroups = []


  Object.entries(
    story.tags || {}
  ).forEach(([category, tags]) => {

    if (!Array.isArray(tags) || !tags.length) {
      return
    }


    storyTagGroups.push({
      category,
      tags
    })

  })


  const tagsHtml =
    storyTagGroups.length
      ? storyTagGroups
          .map(({ category, tags }) => `
            <span
              class="story-tag-group"
              title="${escapeHtml(category)}"
            >
              ${tags
                .map(tag => `
                  <span class="story-tag">
                    ${escapeHtml(tag)}
                  </span>
                `)
                .join(" / ")
              }
            </span>
          `)
          .join(
            '<span class="story-tag-category-separator">|</span>'
          )
      : ""


  /* -------------------------------------------------------
     Story description
  ------------------------------------------------------- */

  const descriptions =
    Array.isArray(story.description)
      ? story.description
      : [story.description]


  const descriptionHtml =
    descriptions
      .filter(Boolean)
      .map(paragraph => `
        <p>
          ${escapeHtml(paragraph)}
        </p>
      `)
      .join("")


  /* -------------------------------------------------------
     Card HTML
  ------------------------------------------------------- */

  card.innerHTML = `

    <div class="story-card-left">

      <div
        class="story-avatar"
        data-image="${escapeHtml(story.avatar || "")}"
        role="img"
        aria-label="${escapeHtml(story.name)} avatar"
      ></div>


      <h2 class="story-title">
        ${escapeHtml(story.name)}
      </h2>


      ${
        story.tagline
          ? `
            <p class="story-tagline">
              "${escapeHtml(story.tagline)}"
            </p>
          `
          : ""
      }


      ${
        tagsHtml
          ? `
            <div class="story-tags">
              ${tagsHtml}
            </div>
          `
          : ""
      }


      <a
        class="story-read-button"
        href="${escapeHtml(story.readUrl)}"
      >
        Read Story →
      </a>

    </div>


    <div class="story-card-right">

      ${
        story.banner
          ? `
            <div
              class="story-banner"
              data-image="${escapeHtml(story.banner || "")}"
              role="img"
              aria-label="${escapeHtml(story.name)} banner"
            ></div>
          `
          : ""
      }


      <div class="story-content">

        <div class="story-description">
          ${descriptionHtml}
        </div>

      </div>

    </div>

  `


  const avatar =
    card.querySelector(".story-avatar")


  if (avatar) {

    addImageFallback(
      avatar,
      "https://placehold.co/240x240"
    )

  }


  const banner =
    card.querySelector(".story-banner")


  if (banner) {

    addImageFallback(
      banner,
      "https://placehold.co/1200x400"
    )

  }


  return card

}

/* =========================================================
   17. RENDER STORIES
========================================================= */

function renderStories() {

  const grid =
    document.getElementById(
      "story-grid"
    )


  grid.innerHTML = ""


  const filtered =
    allStories
      .filter(matchesSearch)
      .filter(matchesTags)


  const sorted =
    sortStories(filtered)


  if (!sorted.length) {

    const empty =
      document.createElement("p")


    empty.className =
      "story-no-results"


    empty.textContent =
      "No stories match your filters."


    grid.appendChild(
      empty
    )


    return

  }


  sorted.forEach(story => {

    grid.appendChild(
      createStoryCard(story)
    )

  })

}


/* =========================================================
   18. BROWSER BACK/FORWARD
========================================================= */

window.addEventListener(
  "popstate",
  () => {

    applyUrlStateToUI()

    renderStories()

  }
)


/* =========================================================
   19. START
========================================================= */

loadStories()