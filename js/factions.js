/* =========================================================
   TAG CATEGORIES
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

  "Faction Type": [
    "Length Unknown",
    "Poem",
    "Micro Faction",
    "Short Faction",
    "Novelette",
    "Novella",
    "Novel"
  ]
}


/* =========================================================
   STATE
========================================================= */

let allFactions = []

let selectedTags = {}

let matchMode = "and"


/* =========================================================
   LOAD FACTIONS
========================================================= */

async function loadFactions() {

  try {

    const response = await fetch("factions/index.json")

    if (!response.ok) {
      throw new Error(`Failed to load factions/index.json`)
    }

    const index = await response.json()


    allFactions = await Promise.all(

      index.map(async entry => {

        const factionResponse = await fetch(entry.path)

        if (!factionResponse.ok) {
          throw new Error(`Failed to load ${entry.path}`)
        }

        const factionData = await factionResponse.json()


        const slug = entry.path
          .replace(".json", "")
          .split("/")
          .pop()


        return {
          ...factionData,
          ...entry,
          slug
        }

      })

    )


    buildTagFilterUI()

    setupControls()

    applyUrlStateToUI()

    renderFactions()

  } catch (error) {

    console.error("Could not load factions:", error)

    const grid = document.getElementById("faction-grid")

    grid.innerHTML = ""

    const errorMessage = document.createElement("p")

    errorMessage.className = "faction-no-results"

    errorMessage.textContent =
      "The faction index could not be loaded."

    grid.appendChild(errorMessage)

  }

}


/* =========================================================
   URL STATE
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
   UPDATE URL
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
   APPLY URL STATE
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
   RESET FILTERS
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
   CONTROLS
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

      renderFactions()

      updateUrlStateInHistory(true)

    }
  )


  sortSelect.addEventListener(
    "change",
    () => {

      renderFactions()

      updateUrlStateInHistory(true)

    }
  )


  matchModeSelect.addEventListener(
    "change",
    () => {

      matchMode =
        matchModeSelect.value


      renderFactions()

      updateUrlStateInHistory(true)

    }
  )


  clearButton.addEventListener(
    "click",
    () => {

      resetFilters()

      renderFactions()

      updateUrlStateInHistory(true)

    }
  )

}


/* =========================================================
   TAG FILTER UI
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
      "Tag filters will appear once tags are added to factions."


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

            renderFactions()

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
   SLUGIFY
========================================================= */

function slugify(value) {

  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

}


/* =========================================================
   SELECTED TAGS
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
   TAG MATCHING
========================================================= */

function matchesTags(faction) {

  if (!Object.keys(selectedTags).length) {
    return true
  }


  const categoryMatcher =
    (category, tags) => {

      const factionTags =
        faction.tags?.[category] || []


      if (matchMode === "and") {

        return Array.from(tags)
          .every(tag =>
            factionTags.includes(tag)
          )

      }


      return factionTags
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
   SEARCH
========================================================= */

function matchesSearch(faction) {

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
    Array.isArray(faction.description)
      ? faction.description
      : [faction.description]


  const factionTags =
    Object.values(
      faction.tags || {}
    ).flat()


  const haystack = [

    faction.name,

    faction.tagline,

    ...descriptions,

    ...factionTags

  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()


  return haystack.includes(query)

}


/* =========================================================
   SORT FACTIONS
========================================================= */

function sortFactions(factions) {

  const sortKey =
    document
      .getElementById("sort-select")
      .value


  const sorted =
    [...factions]


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
   ESCAPE HTML / IMAGE FALLBACK
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

  if (!element.dataset.image) {

    element.style.backgroundImage =
      `url("${fallbackUrl}")`

    return

  }

  image.src =
    element.dataset.image

}

/* =========================================================
   TAG SEPARATORS
========================================================= */

function updateTagSeparators(card) {

  const groups =
    Array.from(
      card.querySelectorAll(".faction-tag-group")
    )

  groups.forEach((group, index) => {

    if (index === 0) {
      group.classList.remove("no-separator")
      return
    }

    const previous =
      groups[index - 1]

    const groupTop =
      group.getBoundingClientRect().top

    const previousTop =
      previous.getBoundingClientRect().top

    group.classList.toggle(
      "no-separator",
      Math.abs(groupTop - previousTop) > 2
    )

  })

}

/* =========================================================
   CREATE FACTION CARD
========================================================= */

function createFactionCard(faction) {

  const card =
    document.createElement("article")


  card.className =
    "faction-card"


  /* -------------------------------------------------------
     Faction tags
  ------------------------------------------------------- */

  const factionTagGroups = []


  Object.entries(
    faction.tags || {}
  ).forEach(([category, tags]) => {

    if (!Array.isArray(tags) || !tags.length) {
      return
    }


    factionTagGroups.push({
      category,
      tags
    })

  })


  const tagsHtml =
    factionTagGroups.length
      ? factionTagGroups
          .map(({ category, tags }) => `
            <span
              class="faction-tag-group"
              title="${escapeHtml(category)}"
            >
              ${tags
                .map(tag => `
                  <span class="faction-tag">
                    ${escapeHtml(tag)}
                  </span>
                `)
                .join(" / ")
              }
            </span>
          `)
          .join("")
      : ""


  /* -------------------------------------------------------
     Faction description
  ------------------------------------------------------- */

  const descriptions =
    Array.isArray(faction.description)
      ? faction.description
      : [faction.description]


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
     Faction profile URL
  ------------------------------------------------------- */

const factionSlug =
  faction.url
    ?.replace(/^factions\//, "")
    .replace(/\.html$/, "")


const factionProfileUrl =
  factionSlug
    ? `faction-profile.html?faction=${encodeURIComponent(factionSlug)}`
    : "#"
    

  /* -------------------------------------------------------
     Card HTML
  ------------------------------------------------------- */

  card.innerHTML = `

    <div class="faction-card-left">

      <div
        class="faction-avatar"
        data-image="${escapeHtml(faction.avatar || "")}"
        role="img"
        aria-label="${escapeHtml(faction.name)} avatar"
      ></div>


      <h2 class="faction-title">
        ${escapeHtml(faction.name)}
      </h2>


      ${
        faction.tagline
          ? `
            <p class="faction-tagline">
              "${escapeHtml(faction.tagline)}"
            </p>
          `
          : ""
      }


      ${
        tagsHtml
          ? `
            <div class="faction-tags">
              ${tagsHtml}
            </div>
          `
          : ""
      }


      <a
        class="faction-read-button"
        href="${factionProfileUrl}"
      >
        Read Faction →
      </a>

    </div>


    <div class="faction-card-right">

      <div
        class="faction-banner"
        data-image="${escapeHtml(faction.banner || "")}"
        role="img"
        aria-label="${escapeHtml(faction.name)} banner"
      ></div>


      <div class="faction-content">

        <div class="faction-description">
          ${descriptionHtml}
        </div>

      </div>

    </div>

  `


  /* -------------------------------------------------------
     Avatar fallback
  ------------------------------------------------------- */

  const avatar =
    card.querySelector(".faction-avatar")


  if (avatar) {

    addImageFallback(
      avatar,
      "https://placehold.co/240x240"
    )

  }


  /* -------------------------------------------------------
     Banner fallback
  ------------------------------------------------------- */

  const banner =
    card.querySelector(".faction-banner")


  if (banner) {

    addImageFallback(
      banner,
      "https://placehold.co/1200x400"
    )

  }


  return card

}

/* =========================================================
   RENDER FACTIONS
========================================================= */

function renderFactions() {

  const grid =
    document.getElementById(
      "faction-grid"
    )


  grid.innerHTML = ""


  const filtered =
    allFactions
      .filter(matchesSearch)
      .filter(matchesTags)


  const sorted =
    sortFactions(filtered)


  if (!sorted.length) {

    const empty =
      document.createElement("p")


    empty.className =
      "faction-no-results"


    empty.textContent =
      "No factions match your filters."


    grid.appendChild(
      empty
    )


    return

  }


  sorted.forEach(faction => {

    grid.appendChild(
      createFactionCard(faction)
    )

  })

  document
    .querySelectorAll(".faction-card")
    .forEach(updateTagSeparators)

}


/* =========================================================
   EVENT LISTENERS
========================================================= */

window.addEventListener(
  "popstate",
  () => {

    applyUrlStateToUI()

    renderFactions()

  }
)

window.addEventListener("resize", () => {
  document
    .querySelectorAll(".faction-card")
    .forEach(updateTagSeparators)
})


/* =========================================================
   START
========================================================= */

loadFactions()