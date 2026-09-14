function getCharacter(){

const params = new URLSearchParams(window.location.search)
return params.get("char")

}

function applyCharacterColors(char){

  const colors = char.colors || {}
  const characterBackground = char.characterBackground || {}

  const primary = colors.primary || "#b99b78"
  const secondary = colors.secondary || "#a27d5f"
  const accent = colors.accent || "#8b6a4d"
  const bg1 = colors.bg_1 || "#f4efe6"
  const bg2 = colors.bg_2 || "#f3f1ec"
  const pageBg = colors.page_bg || "#f3f1ec"
  const backgroundGradient = colors.background_gradient || "#FFFFFF"

  const particleColor = characterBackground.particle_color || primary
  const particleOpacity = characterBackground.particle_opacity ?? 0.18
  const particleBlur = characterBackground.particle_blur ?? 0

  const root = document.documentElement

  root.style.setProperty("--char-primary", primary)
  root.style.setProperty("--char-secondary", secondary)
  root.style.setProperty("--char-accent", accent)
  root.style.setProperty("--char-bg-1", bg1)
  root.style.setProperty("--char-bg-2", bg2)
  root.style.setProperty("--char-page-bg", pageBg)
  root.style.setProperty("--char-background-gradient", backgroundGradient)


  root.style.setProperty("--char-particle-color", particleColor)
  root.style.setProperty("--char-particle-opacity", particleOpacity)
  root.style.setProperty("--char-particle-blur", `${particleBlur}px`)
}

function setupCharacterBackground(char){

  const container = document.getElementById("character-particles")

  if(!container) return

  const characterBackground = char.characterBackground || {}

  const count = Math.max(
    1,
    Math.min(
      Number(characterBackground.particle_count) || 14,
      50
    )
  )

  const shape = characterBackground.particle_shape || "square"

  container.innerHTML = ""

  for(let i = 0; i < count; i++){

    const particle = document.createElement("div")

    particle.className = "character-particle"
    particle.dataset.shape = shape

    const randomSize = characterBackground.random_size ?? false

let width
let height

if (randomSize) {

  if (shape === "circle" || shape === "diamond") {

    // These shapes need to stay square
    const size = 16 + Math.random() * 35

    width = size
    height = size

  } else if (shape === "pill") {

    // Pills need to stay long and thin
    width = 30 + Math.random() * 45
    height = 10 + Math.random() * 8

  } else {

    // Square / rounded / future rectangular shapes
    width = 12 + Math.random() * 35
    height = 12 + Math.random() * 35

  }

} else {

  if (shape === "circle" || shape === "diamond") {

    width = 24
    height = 24

  } else if (shape === "pill") {

    width = 40
    height = 14

  } else {

    width = 24
    height = 24

  }

}

    const left = Math.random() * 100
    const duration = 8 + Math.random() * 10
    const delay = -(Math.random() * duration)

    const startRotation = -50 + Math.random() * 30
    const endRotation = 10 + Math.random() * 20

    const blur = characterBackground.particle_blur ?? 0

    particle.style.setProperty(
      "--particle-width",
      `${width}px`
    )

    particle.style.setProperty(
      "--particle-height",
      `${height}px`
    )

    particle.style.setProperty(
      "--particle-left",
      `${left}%`
    )

    particle.style.setProperty(
      "--particle-duration",
      `${duration}s`
    )

    particle.style.setProperty(
      "--particle-delay",
      `${delay}s`
    )

    particle.style.setProperty(
      "--particle-start-rotation",
      `${startRotation}deg`
    )

    particle.style.setProperty(
      "--particle-end-rotation",
      `${endRotation}deg`
    )

    particle.style.setProperty(
      "--particle-blur",
      `${blur}px`
    )

    container.appendChild(particle)
  }
}

async function loadCharacter(){

const slug = getCharacter()

if(!slug){
document.body.innerHTML = "No character selected"
return
}

const path = `characters/${slug}.json`

try{

const response = await fetch(path)

if(!response.ok){
throw new Error("Character not found")
}

const char = await response.json()

displayCharacter(char)
setupCharacterBackground(char)
setupDetailTabs()

}catch(err){

document.querySelector(".page-container").innerHTML =
"<h1>Character Not Found</h1><p>The requested character does not exist.</p>"

}

}

function text(value){

if(!value || value.length === 0) return "N/A"
return value

}

function list(value){

  if(!value) return "N/A"

  if(Array.isArray(value)){
    if(value.length === 0) return "N/A"
    return value.join(", ")
  }

  return value

}

function listLinks(list,id){

const el = document.getElementById(id)

if(!el) return

if(!list || list.length === 0){
el.innerHTML = "<li>N/A</li>"
return
}

el.innerHTML = list.map(item => {

if(item.file){

const slug = item.file.replace(".json","").split("/").pop()

return `<li><a href="character-profile.html?char=${slug}">${item.name || item.title}</a></li>`

}

return `<li>${item.name || item.title}</li>`

}).join("")

}

function setPageTitle(name){

const title = name || "Unknown Character"

const pageTitle = document.getElementById("page-title")
if(pageTitle) pageTitle.textContent = title

document.title = " Sanctum Vitae | " + title

}

function displayCharacter(char){

applyCharacterColors(char)

const name = text(char.name)

const headerLogoText = document.querySelector(".site-logo-text")
if (headerLogoText) {
  headerLogoText.textContent = `Sanctum Vitae | ${name}`
}

setPageTitle(name)

const nameEl = document.getElementById("name")
if(nameEl) nameEl.textContent = name

// Set avatar image (circular on left side)
const avatarImage = document.getElementById("avatar-image")
if(avatarImage && char.avatar){
avatarImage.style.backgroundImage = `url('${char.avatar}')`
}else if(avatarImage){
avatarImage.style.backgroundImage = `url('https://placehold.co/120')`
}

// Set banner image (top of right side)
const bannerImage = document.getElementById("banner-image")
if(bannerImage && char.banner){
  bannerImage.style.backgroundImage = `url('${char.banner}')`
}else if(bannerImage){
bannerImage.style.backgroundImage = `url('https://placehold.co/600x200')`
}

// Set fullbody image (right of design box)
const designImage = document.getElementById("design-image")
if(designImage && char.fullbody){
  designImage.style.backgroundImage = `url('${char.fullbody}')`
}else if(designImage){
  designImage.style.backgroundImage = `url('https://placehold.co/400x600')`
}

const map = {
age: char.age,
species: char.species,
gender_identity: char.identity?.gender_identity,
pronouns: list(char.identity?.pronouns),
orientation: char.identity?.orientation,
elements: list(char.elements),
ethnicity: char.ethnicity,

full_name: char.full_name,
aliases: list(char.aliases),
occupation: list(char.occupation),

height: char.appearance?.height,
build: char.appearance?.build,
eye_colour: char.appearance?.eye_colour,
hair_colour: char.appearance?.hair_colour,

relationship_status: char.status?.relationship_status,
life_status: char.status?.life_status,
birthday: char.dates?.birthday,
zodiac: char.dates?.zodiac,
mbti: char.psychology?.mbti,
voice: char.voice,

strengths: list(char.personality?.strengths),
weaknesses: list(char.personality?.weaknesses),
interests: list(char.personality?.interests),
hobbies: list(char.personality?.hobbies),
values: list(char.personality?.values),
goals: list(char.personality?.goals),

temperament: list(char.psychology?.temperament),
confidence: list(char.psychology?.confidence),
self_worth: list(char.psychology?.self_worth),
philosophy: list(char.psychology?.philosophy),
sense_of_humor: list(char.psychology?.sense_of_humor),
clothing_style: list(char.psychology?.clothing_style),

social_status: list(char.lifestyle?.social_status),
financial_status: list(char.lifestyle?.financial_status),
communication_style: list(char.lifestyle?.communication_style),
sleep_style: list(char.lifestyle?.sleep_style),
work_ethic: list(char.lifestyle?.work_ethic),
conflict_resolution: list(char.lifestyle?.conflict_resolution),

colours: list(char.favourites?.colours),
medias: list(char.favourites?.medias),
songs: list(char.favourites?.songs),
foods: list(char.favourites?.foods),
animals: list(char.favourites?.animals),
items: list(char.favourites?.items),

mental_health: list(char.health?.mental_health),
physical_health: list(char.health?.physical_health),
activity_level: list(char.health?.activity_level),
hygiene: list(char.health?.hygiene),
crisis_reaction: list(char.health?.crisis_reaction),

religion: list(char.background?.religion),
education: list(char.background?.education),
languages_spoken: list(char.background?.languages_spoken),
family_background: list(char.background?.family_background),
birthplace: list(char.background?.birthplace),
current_location: list(char.background?.current_location)
}

const profileNotes = document.getElementById("profile-notes")

if(profileNotes){

  if(!char.profile_notes || char.profile_notes.length === 0){
    profileNotes.innerHTML = "<li>N/A</li>"
  }else{
    profileNotes.innerHTML = char.profile_notes
      .map(note => `<li>${note}</li>`)
      .join("")
  }

}


const designNotes = document.getElementById("design-notes")

if(designNotes){

  const notes = char.appearance?.design_notes

  if(!notes || notes.length === 0){
    designNotes.innerHTML = "<li>N/A</li>"
  }else{
    designNotes.innerHTML = notes
      .map(note => `<li>${note}</li>`)
      .join("")
  }

}


const personalityNotes = document.getElementById("personality-notes");

if (personalityNotes) {
  const notes = char.personality?.notes;

  if (!notes || notes.length === 0) {
    personalityNotes.innerHTML = "<li>N/A</li>";
  } else {
    personalityNotes.innerHTML = notes
      .map(note => `<li>${note}</li>`)
      .join("");
  }
}

const likes = document.getElementById("likes")

if(likes){

  const notes = char.personality?.likes

  if(!notes || notes.length === 0){
    likes.innerHTML = "<li>N/A</li>"
  }else{
    likes.innerHTML = notes
      .map(note => `<li>${note}</li>`)
      .join("")
  }

}

const dislikes = document.getElementById("dislikes")

if(dislikes){

  const notes = char.personality?.dislikes

  if(!notes || notes.length === 0){
    dislikes.innerHTML = "<li>N/A</li>"
  }else{
    dislikes.innerHTML = notes
      .map(note => `<li>${note}</li>`)
      .join("")
  }

}


const healthNotes = document.getElementById("health-notes");

if (healthNotes) {
  const notes = char.health?.notes;

  if (!notes || notes.length === 0) {
    healthNotes.innerHTML = "<li>N/A</li>";
  } else {
    healthNotes.innerHTML = notes
      .map(note => `<li>${note}</li>`)
      .join("");
  }
}


const backgroundNotes = document.getElementById("background-notes");

if (backgroundNotes) {
  const notes = char.background?.notes;

  if (!notes || notes.length === 0) {
    backgroundNotes.innerHTML = "<li>N/A</li>";
  } else {
    backgroundNotes.innerHTML = notes
      .map(note => `<li>${note}</li>`)
      .join("");
  }
}


Object.entries(map).forEach(([id,value]) => {

const el = document.getElementById(id)
if(el) el.textContent = text(value)

})

listLinks(char.relationships,"relationships")
listLinks(char.partners,"partners")
listLinks(char.pets,"pets")
listLinks(char.stories,"stories")

const backstory = document.getElementById("backstory")
if(backstory) backstory.textContent = text(char.backstory)

const trivia = document.getElementById("trivia")

if(trivia){

if(!char.trivia || char.trivia.length === 0){
trivia.innerHTML = "<li>N/A</li>"
}else{
trivia.innerHTML = char.trivia.map(t => `<li>${t}</li>`).join("")
}

}

const palette = document.getElementById("palette")

if(palette){

if(!char.palette){
palette.innerHTML = "N/A"
}else{

palette.innerHTML = Object.values(char.palette)
.filter(v => v)
.map(c => `<span style="display:inline-block;width:40px;height:40px;background:${c};margin-right:6px;"></span>`)
.join("")

}

}

const links = document.getElementById("links")

if(links){

if(!char.links){
links.innerHTML = "<li>N/A</li>"
}else{

let html = ""

if(char.links.toyhouse) html += `<li><a href="${char.links.toyhouse}" target="_blank">Toyhou.se</a></li>`
if(char.links.pinterest) html += `<li><a href="${char.links.pinterest}" target="_blank">Pinterest</a></li>`
if(char.links.spotify) html += `<li><a href="${char.links.spotify}" target="_blank">Spotify</a></li>`

if(char.links.other){
html += char.links.other.map(o =>
`<li><a href="${o.url}" target="_blank">${o.label}</a></li>`
).join("")
}

links.innerHTML = html || "<li>N/A</li>"

}

}

}

function setupDetailTabs() {

  const detailTabs = document.querySelectorAll(".detail-switcher-tab");
  const detailPanels = document.querySelectorAll(".detail-switcher-panel");

  if (!detailTabs.length || !detailPanels.length) return;

  detailTabs.forEach(tab => {

    tab.addEventListener("click", () => {

      const targetId = tab.getAttribute("aria-controls");
      const targetPanel = document.getElementById(targetId);

      if (!targetPanel) return;

      // Update buttons
      detailTabs.forEach(button => {
        button.classList.remove("active");
        button.setAttribute("aria-selected", "false");
      });

      // Hide panels
      detailPanels.forEach(panel => {
        panel.hidden = true;
      });

      // Activate selected tab
      tab.classList.add("active");
      tab.setAttribute("aria-selected", "true");

      // Show selected panel
      targetPanel.hidden = false;

    });

  });

}

loadCharacter()
