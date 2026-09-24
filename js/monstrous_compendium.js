/* =========================================================
   TAG CATEGORIES
========================================================= */

const tagCategories = {
  "Family": [
    "Humanoid"
  ],

  "Rarity": [
    "Common",
    "Uncommon",
    "Rare",
    "Very Rare",
    "Extremely Rare"
  ],

  "Origin": [
    "Earth"
  ]
}


/* =========================================================
   STATE
========================================================= */

let allSpecies = []

let selectedTags = {}

let matchMode = "and"


/* =========================================================
   LOAD SPECIES
========================================================= */

async function loadSpecies() {

  try {

    const response =
      await fetch("monstrous_compendium/index.json")


    if (!response.ok) {

      throw new Error(
        "Failed to load monstrous_compendium/index.json"
      )

    }


    const index =
      await response.json()


    /*
       Each index entry points to one JSON file.

       Each JSON file contains ONE species object.
    */

    const species =
      await Promise.all(

        index.map(async entry => {

          const speciesResponse =
            await fetch(entry.path)


          if (!speciesResponse.ok) {

            throw new Error(
              `Failed to load ${entry.path}`
            )

          }


          const speciesData =
            await speciesResponse.json()


          if (
            !speciesData ||
            typeof speciesData !== "object" ||
            Array.isArray(speciesData)
          ) {

            throw new Error(
              `${entry.path} must contain a species object`
            )

          }


          const slug =
            speciesData.name
              ? slugify(speciesData.name)
              : ""


          return {
            ...speciesData,
            source: entry.path,
            slug
          }

        })

      )


    allSpecies =
      species


    buildTagFilterUI()

    setupControls()

    applyUrlStateToUI()

    renderSpecies()


  } catch (error) {

    console.error(
      "Could not load species:",
      error
    )


    const grid =
      document.getElementById(
        "species-grid"
      )


    if (!grid) {
      return
    }


    grid.innerHTML = ""


    const errorMessage =
      document.createElement("p")


    errorMessage.className =
      "species-no-results"


    errorMessage.textContent =
      "The species index could not be loaded."


    grid.appendChild(
      errorMessage
    )

  }

}


/* =========================================================
   URL STATE
========================================================= */

function getUrlState() {

  const params =
    new URLSearchParams(
      window.location.search
    )


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

    for (
      const part
      of tagsParam.split(",")
    ) {

      const separatorIndex =
        part.indexOf("|")


      if (separatorIndex === -1) {
        continue
      }


      const category =
        part.slice(
          0,
          separatorIndex
        )


      const value =
        part.slice(
          separatorIndex + 1
        )


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

function updateUrlStateInHistory(
  replace = false
) {

  const params =
    new URLSearchParams()


  const searchInput =
    document.getElementById(
      "search-input"
    )


  const sortSelect =
    document.getElementById(
      "sort-select"
    )


  const search =
    searchInput.value.trim()


  const sort =
    sortSelect.value


  if (search) {
    params.set(
      "search",
      search
    )
  }


  if (
    sort &&
    sort !== "name-asc"
  ) {

    params.set(
      "sort",
      sort
    )

  }


  if (
    matchMode &&
    matchMode !== "and"
  ) {

    params.set(
      "mode",
      matchMode
    )

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
  } =
    getUrlState()


  document.getElementById(
    "search-input"
  ).value =
    search


  document.getElementById(
    "sort-select"
  ).value =
    sort


  document.getElementById(
    "match-mode"
  ).value =
    mode


  matchMode =
    mode


  tags.forEach(
    ({ category, value }) => {

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

    }
  )


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
  ).value =
    "name-asc"


  document.getElementById(
    "match-mode"
  ).value =
    "and"


  matchMode =
    "and"


  document
    .querySelectorAll(
      "#tag-filters input[type=checkbox]"
    )
    .forEach(checkbox => {

      checkbox.checked =
        false

    })


  selectedTags = {}

}


/* =========================================================
   CONTROLS
========================================================= */

function setupControls() {

  const searchInput =
    document.getElementById(
      "search-input"
    )


  const sortSelect =
    document.getElementById(
      "sort-select"
    )


  const clearButton =
    document.getElementById(
      "clear-filters"
    )


  const matchModeSelect =
    document.getElementById(
      "match-mode"
    )


  searchInput.addEventListener(
    "input",
    () => {

      renderSpecies()

      updateUrlStateInHistory(
        true
      )

    }
  )


  sortSelect.addEventListener(
    "change",
    () => {

      renderSpecies()

      updateUrlStateInHistory(
        true
      )

    }
  )


  matchModeSelect.addEventListener(
    "change",
    () => {

      matchMode =
        matchModeSelect.value


      renderSpecies()

      updateUrlStateInHistory(
        true
      )

    }
  )


  clearButton.addEventListener(
    "click",
    () => {

      resetFilters()

      renderSpecies()

      updateUrlStateInHistory(
        true
      )

    }
  )

}


/* =========================================================
   TAG FILTER UI
========================================================= */

function buildTagFilterUI() {

  const container =
    document.getElementById(
      "tag-filters"
    )


  container.innerHTML = ""


  const hasTags =
    Object.values(
      tagCategories
    ).some(
      list => list.length
    )


  if (!hasTags) {

    const placeholder =
      document.createElement(
        "div"
      )


    placeholder.className =
      "tag-placeholder"


    placeholder.textContent =
      "Tag filters will appear once tags are added to species."


    container.appendChild(
      placeholder
    )


    return

  }


  Object.entries(
    tagCategories
  ).forEach(
    ([category, tagList]) => {

      const section =
        document.createElement(
          "details"
        )


      section.className =
        "tag-category"


      const summary =
        document.createElement(
          "summary"
        )


      summary.textContent =
        category


      section.appendChild(
        summary
      )


      const list =
        document.createElement(
          "div"
        )


      list.className =
        "tag-list"


      tagList.forEach(
        tag => {

          const id =
            `tag-${slugify(category)}-${slugify(tag)}`


          const wrapper =
            document.createElement(
              "label"
            )


          wrapper.className =
            "tag-option"


          const checkbox =
            document.createElement(
              "input"
            )


          checkbox.type =
            "checkbox"


          checkbox.id =
            id


          checkbox.dataset.category =
            category


          checkbox.value =
            tag


          const text =
            document.createTextNode(
              tag
            )


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

              renderSpecies()

              updateUrlStateInHistory(
                true
              )

            }
          )


          list.appendChild(
            wrapper
          )

        }
      )


      section.appendChild(
        list
      )


      container.appendChild(
        section
      )

    }
  )


  /* -------------------------------------------------------
     Accordion behaviour
  ------------------------------------------------------- */

  const details =
    container.querySelectorAll(
      "details"
    )


  details.forEach(
    detail => {

      detail.addEventListener(
        "toggle",
        () => {

          if (!detail.open) {
            return
          }


          details.forEach(
            other => {

              if (other !== detail) {
                other.open = false
              }

            }
          )

        }
      )

    }
  )

}


/* =========================================================
   SLUGIFY
========================================================= */

function slugify(value) {

  return String(value ?? "")
    .toLowerCase()
    .replace(
      /[^a-z0-9]+/g,
      "-"
    )
    .replace(
      /^-+|-+$/g,
      "")

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


  checked.forEach(
    input => {

      const category =
        input.dataset.category


      if (!selectedTags[category]) {

        selectedTags[category] =
          new Set()

      }


      selectedTags[category]
        .add(input.value)

    }
  )

}


/* =========================================================
   TAG MATCHING
========================================================= */

function matchesTags(species) {

  if (
    !Object.keys(
      selectedTags
    ).length
  ) {

    return true

  }


  /*
     Supports both:

       "Family": "Humanoid"

     and:

       "Family": ["Humanoid", "Other"]
  */

  const categoryMatcher =
    (category, tags) => {

      let speciesTags =
        species.tags?.[category]


      if (
        speciesTags === undefined ||
        speciesTags === null
      ) {

        return false

      }


      if (!Array.isArray(speciesTags)) {

        speciesTags =
          [speciesTags]

      }


      if (matchMode === "and") {

        return Array.from(tags)
          .every(tag =>
            speciesTags.includes(tag)
          )

      }


      return speciesTags
        .some(tag =>
          tags.has(tag)
        )

    }


  /*
     OR:
     A species only needs to match
     one selected category.
  */

  if (matchMode === "or") {

    return Object.entries(
      selectedTags
    ).some(
      ([category, tags]) =>
        categoryMatcher(
          category,
          tags
        )
    )

  }


  /*
     AND:
     A species must match
     every selected category.
  */

  return Object.entries(
    selectedTags
  ).every(
    ([category, tags]) =>
      categoryMatcher(
        category,
        tags
      )
  )

}


/* =========================================================
   SEARCH
========================================================= */

function matchesSearch(species) {

  const query =
    document
      .getElementById(
        "search-input"
      )
      .value
      .trim()
      .toLowerCase()


  if (!query) {
    return true
  }


  const descriptions =
    Array.isArray(
      species.description
    )
      ? species.description
      : [species.description]


  const otherNames =
    Array.isArray(
      species["other names"]
    )
      ? species["other names"]
      : [species["other names"]]


  const speciesTags =
    Object.values(
      species.tags || {}
    ).flat()


  const haystack = [

    species.name,

    ...otherNames,

    species.quick_facts?.family,

    species.quick_facts?.rarity,

    species.quick_facts?.origin,

    ...descriptions,

    ...speciesTags

  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()


  return haystack.includes(
    query
  )

}


/* =========================================================
   SORT SPECIES
========================================================= */

function sortSpecies(species) {

  const sortKey =
    document
      .getElementById(
        "sort-select"
      )
      .value


  const sorted =
    [...species]


  if (
    sortKey === "name-desc"
  ) {

    sorted.sort(
      (a, b) =>
        String(b.name || "")
          .localeCompare(
            String(a.name || "")
          )
    )

  } else {

    sorted.sort(
      (a, b) =>
        String(a.name || "")
          .localeCompare(
            String(b.name || "")
          )
    )

  }


  return sorted

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHtml(value) {

  return String(value ?? "")
    .replace(
      /&/g,
      "&amp;"
    )
    .replace(
      /</g,
      "&lt;"
    )
    .replace(
      />/g,
      "&gt;"
    )
    .replace(
      /"/g,
      "&quot;"
    )
    .replace(
      /'/g,
      "&#039;"
    )

}


/* =========================================================
   CREATE SPECIES CARD
========================================================= */

function createSpeciesCard(species) {

  const card =
    document.createElement(
      "article"
    )


  card.className =
    "species-card"


  /* -------------------------------------------------------
     Other names
  ------------------------------------------------------- */

  const otherNames =
    Array.isArray(
      species["other names"]
    )
      ? species["other names"]
      : []


  const otherNamesText =
    otherNames.length
      ? otherNames.join(", ")
      : ""


  /* -------------------------------------------------------
     Description
  ------------------------------------------------------- */

  const descriptions =
    Array.isArray(
      species.description
    )
      ? species.description
      : [species.description]


  const descriptionHtml =
    descriptions
      .filter(Boolean)
      .map(
        paragraph => `
          <p>
            ${escapeHtml(paragraph)}
          </p>
        `
      )
      .join("")


  /* -------------------------------------------------------
     Species URL
  ------------------------------------------------------- */

  const speciesSlug =
    species.slug ||
    slugify(species.name)


  const speciesPageUrl =
    speciesSlug
      ? `monstrous_compendium_profile.html?species=${encodeURIComponent(speciesSlug)}`
      : "#"

  /* -------------------------------------------------------
     Card HTML
  ------------------------------------------------------- */

  card.innerHTML = `

    <div class="species-card__banner">

      <div
        class="species-card__banner-overlay"
      ></div>

      <img
        class="species-card__image"
        src="${escapeHtml(
          species.headshot
        )}"
        alt="${escapeHtml(
          species.name
        )}"
      >

    </div>


    <div class="species-card__content">

      <h2 class="species-card__title">
        ${escapeHtml(
          species.name
        )}
      </h2>


      ${
        otherNamesText
          ? `
            <p class="species-card__subtitle">
              ${escapeHtml(
                otherNamesText
              )}
            </p>
          `
          : ""
      }


      <hr class="line">


      <div class="species-card__info">

        <div class="info-row">

          <span class="info-label">
            <strong>Family</strong>
          </span>

          <span class="info-value">
            ${escapeHtml(
              species.quick_facts?.family
            )}
          </span>

        </div>


        <div class="info-row">

          <span class="info-label">
            <strong>Rarity</strong>
          </span>

          <span class="info-value">
            ${escapeHtml(
              species.quick_facts?.rarity
            )}
          </span>

        </div>


        <div class="info-row">

          <span class="info-label">
            <strong>Origin</strong>
          </span>

          <span class="info-value">
            ${escapeHtml(
              species.quick_facts?.origin
            )}
          </span>

        </div>

      </div>


      <hr class="line">


      <div class="species-card__description">

        ${descriptionHtml}

      </div>


      <a
        class="story-read-button species-view-button"
        href="${speciesPageUrl}"
      >
        View Species →
      </a>

    </div>

  `


  return card

}



/* =========================================================
   RENDER SPECIES
========================================================= */

function renderSpecies() {

  const grid =
    document.getElementById(
      "species-grid"
    )


  grid.innerHTML = ""


  const filtered =
    allSpecies
      .filter(matchesSearch)
      .filter(matchesTags)


  const sorted =
    sortSpecies(
      filtered
    )


  if (!sorted.length) {

    const empty =
      document.createElement(
        "p"
      )


    empty.className =
      "species-no-results"


    empty.textContent =
      "No species match your filters."


    grid.appendChild(
      empty
    )


    return

  }


  sorted.forEach(
    species => {

      grid.appendChild(
        createSpeciesCard(
          species
        )
      )

    }
  )

}


/* =========================================================
   EVENT LISTENERS
========================================================= */

window.addEventListener(
  "popstate",
  () => {

    /*
       Clear existing checkbox state
       before applying the URL state.
    */

    document
      .querySelectorAll(
        "#tag-filters input[type=checkbox]"
      )
      .forEach(
        checkbox => {
          checkbox.checked = false
        }
      )


    applyUrlStateToUI()

    renderSpecies()

  }
)


/* =========================================================
   START
========================================================= */

loadSpecies()