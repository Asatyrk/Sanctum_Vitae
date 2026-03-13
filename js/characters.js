const tagCategories = {
  "Species": ["Human", "Elf", "Demon", "Beast", "Construct", "Spirit"],
  "Gender": ["Male", "Female", "Nonbinary", "Agender", "Genderfluid"],
  "Romantic Orientation": ["Aromantic", "Heteroromantic", "Homoromantic", "Biromantic"],
  "Sexual Orientation": ["Asexual", "Heterosexual", "Homosexual", "Bisexual"],
  "Other Identities": ["Mage", "Soldier", "Noble", "Commoner", "Neurodivergent"],
  "Relationship Status": ["Single", "Dating", "Engaged", "Married", "Widowed"],
  "Age": ["Youth", "Adult", "Elder"],
  "Family": ["Orphan", "Royal", "Noble", "Commoner"],
  "Location (Basic)": ["World", "Realm"],
  "Location (General)": ["Kingdom", "Empire", "Province"],
  "Location (Specific)": ["City", "Village", "Stronghold"],
  "Element": ["Fire", "Water", "Earth", "Air", "Void"],
  "Godhood": ["Mortal", "Demigod", "God", "Ascended"],
  "Stories": ["Test Story"],
  "Special": ["Legendary", "Cursed", "Prototype"],
  "Affiliation": ["None", "Guild", "Order", "Faction"],
  "Role": ["Protagonist", "Antagonist", "Support", "NPC"]
}

let allCharacters = []
let selectedTags = {}

async function loadCharacters(){
  const response = await fetch("characters/index.json")
  allCharacters = await response.json()

  // Ensure every character has a tags object, even if empty.
  allCharacters = allCharacters.map(c => ({ ...c, tags: c.tags || {} }))

  buildTagFilterUI()
  setupControls()
  applyUrlStateToUI()
  renderCharacters()
}

function getUrlState(){
  const params = new URLSearchParams(window.location.search)

  const search = params.get("search") || ""
  const sort = params.get("sort") || "name-asc"

  const tags = []
  const tagsParam = params.get("tags") || ""
  if (tagsParam.trim()) {
    for (const part of tagsParam.split(",")) {
      const [category, value] = part.split("|")
      if (category && value) tags.push({ category, value })
    }
  }

  return { search, sort, tags }
}

function updateUrlStateInHistory(replace = false){
  const params = new URLSearchParams()
  const searchInput = document.getElementById("search-input")
  const sortSelect = document.getElementById("sort-select")

  const search = searchInput.value.trim()
  const sort = sortSelect.value

  if (search) params.set("search", search)
  if (sort && sort !== "name-asc") params.set("sort", sort)

  const tags = []
  const checked = document.querySelectorAll("#tag-filters input[type=checkbox]:checked")
  checked.forEach(input => {
    const category = input.dataset.category
    const value = input.value
    tags.push(`${category}|${value}`)
  })

  if (tags.length) params.set("tags", tags.join(","))

  const query = params.toString()
  const newUrl = query ? `${window.location.pathname}?${query}` : window.location.pathname

  if (replace) {
    window.history.replaceState({}, "", newUrl)
  } else {
    window.history.pushState({}, "", newUrl)
  }
}

function applyUrlStateToUI(){
  const { search, sort, tags } = getUrlState()

  document.getElementById("search-input").value = search
  document.getElementById("sort-select").value = sort

  if (tags.length) {
    tags.forEach(({ category, value }) => {
      const selector = `#tag-filters input[data-category="${category}"][value="${value}"]`
      const checkbox = document.querySelector(selector)
      if (checkbox) checkbox.checked = true
    })
  }

  updateSelectedTags()
}

function resetFilters(){
  document.getElementById("search-input").value = ""
  document.getElementById("sort-select").value = "name-asc"

  document.querySelectorAll("#tag-filters input[type=checkbox]").forEach(cb => {
    cb.checked = false
  })

  selectedTags = {}
}

function setupControls(){
  const searchInput = document.getElementById("search-input")
  const sortSelect = document.getElementById("sort-select")
  const clearButton = document.getElementById("clear-filters")

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

function buildTagFilterUI(){
  const container = document.getElementById("tag-filters")
  container.innerHTML = ""

  const hasTags = Object.values(tagCategories).some(list => list.length)
  if (!hasTags) {
    const placeholder = document.createElement("div")
    placeholder.className = "tag-placeholder"
    placeholder.textContent = "Tag filters will appear once tags are added to characters."
    container.appendChild(placeholder)
    return
  }

  Object.entries(tagCategories).forEach(([category, tagList]) => {
    const section = document.createElement("details")
    section.className = "tag-category"
    section.innerHTML = `<summary>${category}</summary>`

    const list = document.createElement("div")
    list.className = "tag-list"

    tagList.forEach(tag => {
      const id = `tag-${category.replace(/\s+/g, "-")}-${tag.replace(/\s+/g, "-")}`
      const wrapper = document.createElement("label")
      wrapper.className = "tag-option"
      wrapper.innerHTML = `
        <input type="checkbox" data-category="${category}" value="${tag}" id="${id}" />
        ${tag}
      `

      wrapper.querySelector("input").addEventListener("change", () => {
        updateSelectedTags()
        renderCharacters()
        updateUrlStateInHistory(true)
      })

      list.appendChild(wrapper)
    })

    section.appendChild(list)
    container.appendChild(section)
  })
}

function updateSelectedTags(){
  selectedTags = {}
  const checked = document.querySelectorAll("#tag-filters input[type=checkbox]:checked")
  checked.forEach(input => {
    const category = input.dataset.category
    selectedTags[category] = selectedTags[category] || new Set()
    selectedTags[category].add(input.value)
  })
}

function matchesTags(character){
  if (!Object.keys(selectedTags).length) return true

  return Object.entries(selectedTags).every(([category, tags]) => {
    const charTags = character.tags?.[category] || []
    return charTags.some(t => tags.has(t))
  })
}

function matchesSearch(character){
  const query = document.getElementById("search-input").value.trim().toLowerCase()
  if (!query) return true

  const haystack = [
    character.name,
    character.full_name,
    character.role,
    character.bio,
    ...(Object.values(character.tags || {}).flat())
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()

  return haystack.includes(query)
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
    .filter(matchesTags)

  const sorted = sortCharacters(filtered)

  if (!sorted.length) {
    const empty = document.createElement("p")
    empty.className = "no-results"
    empty.textContent = "No characters match your filters."
    grid.appendChild(empty)
    return
  }

  sorted.forEach(char => {
    const card = document.createElement("a")
    card.href = `character-profile.html?char=${char.path}`
    card.className = "char-card"

    card.innerHTML = `
      <img src="${char.headshot}">
      <p class="card-name">${char.name}</p>
    `

    grid.appendChild(card)
  })
}

loadCharacters()