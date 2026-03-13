let allFactions = []

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

async function loadFactions(){
  const response = await fetch("factions/index.json")
  allFactions = await response.json()

  setupControls()
  applyUrlStateToUI()
  renderFactions()
}

function setupControls(){
  const searchInput = document.getElementById("search-input")
  const sortSelect = document.getElementById("sort-select")
  const clearButton = document.getElementById("clear-filters")

  const onControlChange = () => {
    renderFactions()
    updateUrlStateInHistory(true)
  }

  searchInput.addEventListener("input", onControlChange)
  sortSelect.addEventListener("change", onControlChange)

  clearButton.addEventListener("click", () => {
    resetFilters()
    renderFactions()
    updateUrlStateInHistory(true)
  })
}

function matchesSearch(faction){
  const query = document.getElementById("search-input").value.trim().toLowerCase()
  if (!query) return true

  const haystack = [faction.name, faction.description, faction.notes]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()

  return haystack.includes(query)
}

function sortFactions(factions){
  const sortKey = document.getElementById("sort-select").value
  const sorted = [...factions]

  if (sortKey === "name-desc") {
    sorted.sort((a, b) => b.name.localeCompare(a.name))
  } else {
    sorted.sort((a, b) => a.name.localeCompare(b.name))
  }

  return sorted
}

function renderFactions(){
  const grid = document.getElementById("faction-grid")
  grid.innerHTML = ""

  const filtered = allFactions.filter(matchesSearch)
  const sorted = sortFactions(filtered)

  if (!sorted.length) {
    const empty = document.createElement("p")
    empty.className = "no-results"
    empty.textContent = "No factions match your search."
    grid.appendChild(empty)
    return
  }

  sorted.forEach(faction=>{
    const card = document.createElement("a")
    card.href = `faction-profile.html?faction=${faction.path}`
    card.className = "faction-card"

    card.innerHTML = `
      <img src="${faction.logo}">
      <p>${faction.name}</p>
    `

    grid.appendChild(card)
  })
}

loadFactions()