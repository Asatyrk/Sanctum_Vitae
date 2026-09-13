function getCharacter(){

const params = new URLSearchParams(window.location.search)
return params.get("char")

}

function applyCharacterColors(char){

  const colors = char.colors || {}

  const primary = colors.primary || "#b99b78"
  const secondary = colors.secondary || "#a27d5f"
  const accent = colors.accent || "#8b6a4d"
  const bg1 = colors.bg_1 || "#f4efe6"
  const bg2 = colors.bg_2 || "#f3f1ec"
  const pageBg = colors.page_bg || "#f3f1ec"

  const root = document.documentElement

  root.style.setProperty("--char-primary", primary)
  root.style.setProperty("--char-secondary", secondary)
  root.style.setProperty("--char-accent", accent)
  root.style.setProperty("--char-bg-1", bg1)
  root.style.setProperty("--char-bg-2", bg2)
  root.style.setProperty("--char-page-bg", pageBg)
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

if(!value || value.length === 0) return "N/A"
return value.join(", ")

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

likes: list(char.personality?.likes),
dislikes: list(char.personality?.dislikes),
strengths: list(char.personality?.strengths),
weaknesses: list(char.personality?.weaknesses),
interests: list(char.personality?.interests),
hobbies: list(char.personality?.hobbies),
values: list(char.personality?.values),
goals: list(char.personality?.goals)
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

loadCharacter()
