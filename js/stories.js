let allStories = []

let selectedStoryFilters = {
  genre: new Set(),
  age_range: new Set(),
  status: new Set()
}


// =========================================================
// LOAD STORIES
// =========================================================

async function loadStories() {

  const response =
    await fetch("stories/index.json")

  const index =
    await response.json()

  allStories =
    await Promise.all(
      index.map(async entry => {

        const storyResponse =
          await fetch(entry.path)

        const storyData =
          await storyResponse.json()

        const slug =
          entry.path
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

  buildStoryFilters()

  setupStoryControls()

  applyStoryUrlState()

  renderStories()
}


// =========================================================
// URL STATE
// =========================================================

function getStoryUrlState() {

  const params =
    new URLSearchParams(
      window.location.search
    )

  const search =
    params.get("search") || ""

  const sort =
    params.get("sort") || "name-asc"

  const genre =
    params.get("genre")
      ? params.get("genre").split(",").filter(Boolean)
      : []

  const ageRange =
    params.get("age")
      ? params.get("age").split(",").filter(Boolean)
      : []

  const status =
    params.get("status")
      ? params.get("status").split(",").filter(Boolean)
      : []

  return {
    search,
    sort,
    genre,
    ageRange,
    status
  }
}


function updateStoryUrlState(
  replace = true
) {

  const params =
    new URLSearchParams()

  const searchInput =
    document.getElementById(
      "story-search-input"
    )

  const sortSelect =
    document.getElementById(
      "story-sort-select"
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
    selectedStoryFilters.genre.size
  ) {

    params.set(
      "genre",
      Array.from(
        selectedStoryFilters.genre
      ).join(",")
    )

  }


  if (
    selectedStoryFilters.age_range.size
  ) {

    params.set(
      "age",
      Array.from(
        selectedStoryFilters.age_range
      ).join(",")
    )

  }


  if (
    selectedStoryFilters.status.size
  ) {

    params.set(
      "status",
      Array.from(
        selectedStoryFilters.status
      ).join(",")
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


// =========================================================
// APPLY URL STATE
// =========================================================

function applyStoryUrlState() {

  const {
    search,
    sort,
    genre,
    ageRange,
    status
  } = getStoryUrlState()


  document.getElementById(
    "story-search-input"
  ).value = search


  document.getElementById(
    "story-sort-select"
  ).value = sort


  genre.forEach(value => {

    const checkbox =
      document.querySelector(
        `#genre-filters input[value="${CSS.escape(value)}"]`
      )

    if (checkbox) {
      checkbox.checked = true
    }

  })


  ageRange.forEach(value => {

    const checkbox =
      document.querySelector(
        `#age-filters input[value="${CSS.escape(value)}"]`
      )

    if (checkbox) {
      checkbox.checked = true
    }

  })


  status.forEach(value => {

    const checkbox =
      document.querySelector(
        `#status-filters input[value="${CSS.escape(value)}"]`
      )

    if (checkbox) {
      checkbox.checked = true
    }

  })


  updateSelectedStoryFilters()

}


// =========================================================
// FILTER OPTIONS
// =========================================================

function getUniqueStoryValues(
  property
) {

  const values = new Set()

  allStories.forEach(story => {

    const value =
      story[property]

    if (Array.isArray(value)) {

      value.forEach(item => {

        if (item) {
          values.add(item)
        }

      })

    } else if (value) {

      values.add(value)

    }

  })

  return Array.from(values).sort(
    (a, b) =>
      a.localeCompare(b)
  )

}


// =========================================================
// BUILD FILTER UI
// =========================================================

function buildStoryFilters() {

  buildStoryFilterGroup(
    "genre-filters",
    getUniqueStoryValues("genre"),
    "genre"
  )

  buildStoryFilterGroup(
    "age-filters",
    getUniqueStoryValues("age_range"),
    "age_range"
  )

  buildStoryFilterGroup(
    "status-filters",
    getUniqueStoryValues("status"),
    "status"
  )

}


function buildStoryFilterGroup(
  containerId,
  values,
  category
) {

  const container =
    document.getElementById(
      containerId
    )

  container.innerHTML = ""


  values.forEach(value => {

    const label =
      document.createElement(
        "label"
      )

    label.className =
      "story-filter-option"


    const input =
      document.createElement(
        "input"
      )

    input.type =
      "checkbox"

    input.value =
      value

    input.dataset.category =
      category


    const text =
      document.createTextNode(
        value
      )


    label.appendChild(input)
    label.appendChild(text)

    container.appendChild(label)


    input.addEventListener(
      "change",
      () => {

        updateSelectedStoryFilters()

        renderStories()

        updateStoryUrlState()

      }
    )

  })

}


// =========================================================
// SELECTED FILTERS
// =========================================================

function updateSelectedStoryFilters() {

  selectedStoryFilters = {
    genre: new Set(),
    age_range: new Set(),
    status: new Set()
  }


  document
    .querySelectorAll(
      ".story-filter-option input:checked"
    )
    .forEach(input => {

      const category =
        input.dataset.category

      selectedStoryFilters[
        category
      ].add(input.value)

    })

}


// =========================================================
// SEARCH
// =========================================================

function storyMatchesSearch(
  story
) {

  const query =
    document
      .getElementById(
        "story-search-input"
      )
      .value
      .trim()
      .toLowerCase()


  if (!query) {
    return true
  }


  const haystack = [

    story.name,

    story.tagline,

    ...(Array.isArray(story.genre)
      ? story.genre
      : [story.genre]
    ),

    story.age_range,

    story.status,

    ...(Array.isArray(story.description)
      ? story.description
      : [story.description]
    )

  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()


  return haystack.includes(
    query
  )

}


// =========================================================
// TAG FILTERING
// =========================================================

function storyMatchesFilters(
  story
) {

  // Genre

  if (
    selectedStoryFilters.genre.size
  ) {

    const storyGenres =
      Array.isArray(story.genre)
        ? story.genre
        : []


    const matchesGenre =
      storyGenres.some(
        genre =>
          selectedStoryFilters
            .genre
            .has(genre)
      )


    if (!matchesGenre) {
      return false
    }

  }


  // Age range

  if (
    selectedStoryFilters.age_range.size
  ) {

    if (
      !selectedStoryFilters
        .age_range
        .has(story.age_range)
    ) {

      return false

    }

  }


  // Status

  if (
    selectedStoryFilters.status.size
  ) {

    if (
      !selectedStoryFilters
        .status
        .has(story.status)
    ) {

      return false

    }

  }


  return true

}


// =========================================================
// SORT
// =========================================================

function sortStories(
  stories
) {

  const sort =
    document.getElementById(
      "story-sort-select"
    ).value


  const sorted =
    [...stories]


  if (
    sort === "name-desc"
  ) {

    sorted.sort(
      (a, b) =>
        b.name.localeCompare(
          a.name
        )
    )

  } else {

    sorted.sort(
      (a, b) =>
        a.name.localeCompare(
          b.name
        )
    )

  }


  return sorted

}


// =========================================================
// RENDER STORIES
// =========================================================

function renderStories() {

  const container =
    document.getElementById(
      "story-list"
    )

  container.innerHTML = ""


  const filtered =
    allStories
      .filter(storyMatchesSearch)
      .filter(storyMatchesFilters)


  const sorted =
    sortStories(filtered)


  if (!sorted.length) {

    const empty =
      document.createElement("p")

    empty.className =
      "no-results"

    empty.textContent =
      "No stories match your filters."

    container.appendChild(
      empty
    )

    return

  }


  sorted.forEach(
    story =>
      container.appendChild(
        createStoryCard(story)
      )
  )

}


// =========================================================
// STORY CARD
// =========================================================

function createStoryCard(
  story
) {

  const card =
    document.createElement("article")

  card.className =
    "story-card"


  const image =
    story.image ||
    "assets/images/story-placeholder.jpg"


  const banner =
    story.banner ||
    "assets/images/story-banner-placeholder.jpg"


  const tagline =
    story.tagline ||
    ""


  const genre =
    Array.isArray(story.genre)
      ? story.genre.join(", ")
      : story.genre || "—"


  const ageRange =
    story.age_range ||
    "—"


  const status =
    story.status ||
    "—"


  const description =
    Array.isArray(story.description)
      ? story.description
      : [story.description || ""]


  const descriptionHTML =
    description
      .filter(Boolean)
      .map(
        paragraph =>
          `<p>${paragraph}</p>`
      )
      .join("")


  card.innerHTML = `

    <div class="story-card-left">

      <div class="story-cover">
        <img
          src="${image}"
          alt="${story.name}"
        >
      </div>


      <h2 class="story-title">
        ${story.name}
      </h2>


      ${
        tagline
          ? `
            <p class="story-tagline">
              "${tagline}"
            </p>
          `
          : ""
      }


      <div class="story-meta">

        <div class="story-meta-group">

          <span class="story-meta-label">
            Genre
          </span>

          <span class="story-meta-value">
            ${genre}
          </span>

        </div>


        <div class="story-meta-group">

          <span class="story-meta-label">
            Age Range
          </span>

          <span class="story-meta-value">
            ${ageRange}
          </span>

        </div>


        <div class="story-meta-group">

          <span class="story-meta-label">
            Status
          </span>

          <span class="story-meta-value">
            ${status}
          </span>

        </div>

      </div>


      ${
        story.readUrl
          ? `
            <a
              class="story-read-button"
              href="${story.readUrl}"
            >
              Read Story
            </a>
          `
          : ""
      }

    </div>


    <div class="story-card-right">

      <div
        class="story-banner"
        style="background-image: url('${banner}')"
      ></div>


      <div class="story-information">

        <h3>
          Story Information
        </h3>

        <div class="story-description">
          ${descriptionHTML}
        </div>

      </div>

    </div>

  `


  return card

}


// =========================================================
// CONTROLS
// =========================================================

function setupStoryControls() {

  const searchInput =
    document.getElementById(
      "story-search-input"
    )

  const sortSelect =
    document.getElementById(
      "story-sort-select"
    )

  const clearButton =
    document.getElementById(
      "clear-story-filters"
    )


  const update =
    () => {

      renderStories()

      updateStoryUrlState()

    }


  searchInput.addEventListener(
    "input",
    update
  )


  sortSelect.addEventListener(
    "change",
    update
  )


  clearButton.addEventListener(
    "click",
    () => {

      searchInput.value = ""

      sortSelect.value =
        "name-asc"


      document
        .querySelectorAll(
          ".story-filter-option input"
        )
        .forEach(
          input =>
            input.checked = false
        )


      updateSelectedStoryFilters()

      renderStories()

      updateStoryUrlState()

    }
  )

}


loadStories()