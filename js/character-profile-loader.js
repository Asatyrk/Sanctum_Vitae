function displayCharacter(char) {
  // -----------------------------
  // Character Name
  // -----------------------------
  const name = char.name || "Unknown Character"

  // Update header logo to show: "Sanctum Vitae | Character Name"
  const headerLogoText = document.querySelector(".site-logo-text")
  if (headerLogoText) {
    headerLogoText.textContent = `Sanctum Vitae | ${name}`
  }

  // Update browser tab title: "Sanctum Vitae | Character Name"
  document.title = `Sanctum Vitae | ${name}`

  // Update main <h1> on the page
  const nameEl = document.getElementById("name")
  if (nameEl) nameEl.textContent = name

  // -----------------------------
  // Fullbody Image
  // -----------------------------
  const fullbody = document.getElementById("fullbody")
  if (fullbody) {
    if (char.fullbody) {
      fullbody.src = char.fullbody
      fullbody.style.display = ""
    } else {
      fullbody.style.display = "none"
    }
  }

  // -----------------------------
  // Simple text/list helper functions
  // -----------------------------
  const text = (val) => (!val || val.length === 0 ? "N/A" : val)
  const list = (val) => (!val || val.length === 0 ? "N/A" : val.join(", "))

  // -----------------------------
  // Basic info map
  // -----------------------------
  const infoMap = {
    full_name: char.full_name,
    aliases: list(char.aliases),
    age: char.age,
    species: char.species,
    occupation: list(char.occupation),

    gender_identity: char.identity?.gender_identity,
    pronouns: list(char.identity?.pronouns),
    orientation: char.identity?.orientation,

    height: char.appearance?.height,
    build: char.appearance?.build,
    eye_colour: char.appearance?.eye_colour,
    hair_colour: char.appearance?.hair_colour,

    likes: list(char.personality?.likes),
    dislikes: list(char.personality?.dislikes),
    strengths: list(char.personality?.strengths),
    weaknesses: list(char.personality?.weaknesses),
    hobbies: list(char.personality?.hobbies),
  }

  Object.entries(infoMap).forEach(([id, value]) => {
    const el = document.getElementById(id)
    if (el) el.textContent = text(value)
  })

  // -----------------------------
  // Relationships, partners, pets, stories
  // -----------------------------
  const listLinks = (items, id) => {
    const el = document.getElementById(id)
    if (!el) return

    if (!items || items.length === 0) {
      el.innerHTML = "<li>N/A</li>"
      return
    }

    el.innerHTML = items
      .map((item) => {
        if (item.file) {
          const slug = item.file.replace(".json", "").split("/").pop()
          return `<li><a href="character-profile.html?char=${slug}">${item.name || item.title}</a></li>`
        }
        return `<li>${item.name || item.title}</li>`
      })
      .join("")
  }

  listLinks(char.relationships, "relationships")
  listLinks(char.partners, "partners")
  listLinks(char.pets, "pets")
  listLinks(char.stories, "stories")

  // -----------------------------
  // Backstory
  // -----------------------------
  const backstoryEl = document.getElementById("backstory")
  if (backstoryEl) backstoryEl.textContent = text(char.backstory)

  // -----------------------------
  // Trivia
  // -----------------------------
  const triviaEl = document.getElementById("trivia")
  if (triviaEl) {
    if (!char.trivia || char.trivia.length === 0) {
      triviaEl.innerHTML = "<li>N/A</li>"
    } else {
      triviaEl.innerHTML = char.trivia.map((t) => `<li>${t}</li>`).join("")
    }
  }

  // -----------------------------
  // Palette
  // -----------------------------
  const paletteEl = document.getElementById("palette")
  if (paletteEl) {
    if (!char.palette) {
      paletteEl.innerHTML = "N/A"
    } else {
      paletteEl.innerHTML = Object.values(char.palette)
        .filter(Boolean)
        .map((c) => `<span style="display:inline-block;width:40px;height:40px;background:${c};margin-right:6px;"></span>`)
        .join("")
    }
  }

  // -----------------------------
  // External links
  // -----------------------------
  const linksEl = document.getElementById("links")
  if (linksEl) {
    if (!char.links) {
      linksEl.innerHTML = "<li>N/A</li>"
    } else {
      let html = ""
      if (char.links.toyhouse) html += `<li><a href="${char.links.toyhouse}" target="_blank">Toyhou.se</a></li>`
      if (char.links.pinterest) html += `<li><a href="${char.links.pinterest}" target="_blank">Pinterest</a></li>`
      if (char.links.spotify) html += `<li><a href="${char.links.spotify}" target="_blank">Spotify</a></li>`

      if (char.links.other) {
        html += char.links.other
          .map((o) => `<li><a href="${o.url}" target="_blank">${o.label}</a></li>`)
          .join("")
      }

      linksEl.innerHTML = html || "<li>N/A</li>"
    }
  }
}