async function loadCharacters(){
  const response = await fetch("characters/otherly_owned/index.json")
  const index = await response.json()

  allCharacters = await Promise.all(index.map(async (entry) => {
    const charResponse = await fetch(entry.path)
    const charData = await charResponse.json()
    const slug = entry.path.replace(".json","").split("/").pop()
    return { ...charData, ...entry, slug }
  }))

  setupControls()
  applyUrlStateToUI()
  renderCharacters()
}

function getUrlState(){
  const params = new URLSearchParams(window.location.search)

  const search = params.get("search") || ""
  const sort = params.get("sort") || "name-asc"

  return { search, sort }
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

function setupControls(){
  const searchInput = document.getElementById("search-input")
  const sortSelect = document.getElementById("sort-select")

  const onControlChange = () => {
    renderCharacters()
    updateUrlStateInHistory(true)
  }

  searchInput.addEventListener("input", onControlChange)
  sortSelect.addEventListener("change", onControlChange)

  clearButton.addEventListener("click", () => {
    resetFilters()
    renderCharacters()
    updateUrlStateInHistory(true)
  })
}

function sortCharacters(characters){
  const sortKey = document.getElementById("sort-select").value
  const sorted = [...characters]

  if (sortKey === "name-desc") {
    sorted.sort((a, b) => b.name.localeCompare(a.name))
  } else {
    sorted.sort((a, b) => a.name.localeCompare(b.name))
  }

  return sorted
}

function renderCharacters(){
  const grid = document.getElementById("character-grid")
  grid.innerHTML = ""

  const filtered = allCharacters
    .filter(matchesSearch)

  const sorted = sortCharacters(filtered)

  if (!sorted.length) {
    const empty = document.createElement("p")
    empty.className = "no-results"
    empty.textContent = "No characters match your filters."
    grid.appendChild(empty)
    return
  }

  sorted.forEach(char => {

  const slug = char.path.replace(".json","").split("/").pop()

  const card = document.createElement("a")
  card.href = `otherly-owned-profile.html?char=${slug}`
  card.className = "char-card"

  card.innerHTML = `
    <img src="${char.headshot}">
    <p class="card-name">${char.name}</p>
  `

  grid.appendChild(card)

})
}

loadCharacters()