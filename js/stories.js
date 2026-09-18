let allStories = []

function getUrlState(){
  const params = new URLSearchParams(window.location.search)
  return {
    search: params.get("search") || "",
    sort: params.get("sort") || "name-asc"
  }
}

function updateUrlStateInHistory(replace = false){
  const params = new URLSearchParams()
  const searchInput = document.getElementById("search-input")
  const sortSelect = document.getElementById("sort-select")

  const search = searchInput.value.trim()
  const sort = sortSelect.value

  if (search) params.set("search", search)
  if (sort && sort !== "name-asc") params.set("sort", sort)

  const query = params.toString()
  const newUrl = query ? `${window.location.pathname}?${query}` : window.location.pathname

  if (replace) {
    window.history.replaceState({}, "", newUrl)
  } else {
    window.history.pushState({}, "", newUrl)
  }
}

function applyUrlStateToUI(){
  const { search, sort } = getUrlState()

  document.getElementById("search-input").value = search
  document.getElementById("sort-select").value = sort
}

function resetFilters(){
  document.getElementById("search-input").value = ""
  document.getElementById("sort-select").value = "name-asc"
}

async function loadStories(){
  const response = await fetch("stories/index.json")
  allStories = await response.json()

  setupControls()
  applyUrlStateToUI()
  renderStories()
}

function setupControls(){
  const searchInput = document.getElementById("search-input")
  const sortSelect = document.getElementById("sort-select")
  const clearButton = document.getElementById("clear-filters")

  const onControlChange = () => {
    renderStories()
    updateUrlStateInHistory(true)
  }

  searchInput.addEventListener("input", onControlChange)
  sortSelect.addEventListener("change", onControlChange)

  clearButton.addEventListener("click", () => {
    resetFilters()
    renderStories()
    updateUrlStateInHistory(true)
  })
}

function matchesSearch(story){
  const query = document.getElementById("search-input").value.trim().toLowerCase()
  if (!query) return true

  const haystack = [story.name, story.description, story.notes]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()

  return haystack.includes(query)
}

function sortStories(stories){
  const sortKey = document.getElementById("sort-select").value
  const sorted = [...stories]

  if (sortKey === "name-desc") {
    sorted.sort((a, b) => b.name.localeCompare(a.name))
  } else {
    sorted.sort((a, b) => a.name.localeCompare(b.name))
  }

  return sorted
}

function renderStories(){
  const grid = document.getElementById("story-grid")
  grid.innerHTML = ""

  const filtered = allStories.filter(matchesSearch)
  const sorted = sortStories(filtered)

  if (!sorted.length) {
    const empty = document.createElement("p")
    empty.className = "no-results"
    empty.textContent = "No stories match your search."
    grid.appendChild(empty)
    return
  }

  sorted.forEach(story=>{
    const card = document.createElement("a")
    card.href = `story-profile.html?story=${story.path}`
    card.className = "story-card"

    card.innerHTML = `
      <img src="${story.logo}">
      <p>${story.name}</p>
    `

    grid.appendChild(card)
  })
}

loadStories()