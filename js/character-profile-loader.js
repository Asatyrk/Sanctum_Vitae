function getCharacter(){

const params = new URLSearchParams(window.location.search)
return params.get("char")

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

document.title = " Sanctum Vitae |" + title

}

function displayCharacter(char){

const name = text(char.name)

setPageTitle(name)

const nameEl = document.getElementById("name")
if(nameEl) nameEl.textContent = name

const fullbody = document.getElementById("fullbody")
if(fullbody && char.fullbody){
fullbody.src = char.fullbody
}else if(fullbody){
fullbody.style.display = "none"
}

const map = {
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
hobbies: list(char.personality?.hobbies)
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