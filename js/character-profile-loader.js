function getCharacter(){

const params = new URLSearchParams(window.location.search)
return params.get("char")

}

async function loadCharacter(){

const path = getCharacter()

if(!path){
document.body.innerHTML = "No character selected"
return
}

const response = await fetch(path)
const char = await response.json()

displayCharacter(char)

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

if(!list || list.length === 0){
el.innerHTML = "<li>N/A</li>"
return
}

el.innerHTML = list.map(item => {

if(item.file){

return `<li><a href="character.html?char=${item.file}">${item.name || item.title}</a></li>`

}

return `<li>${item.name || item.title}</li>`

}).join("")

}

function displayCharacter(char){

document.getElementById("name").textContent = text(char.name)

document.getElementById("full_name").textContent = text(char.full_name)
document.getElementById("aliases").textContent = list(char.aliases)
document.getElementById("age").textContent = text(char.age)
document.getElementById("species").textContent = text(char.species)
document.getElementById("occupation").textContent = list(char.occupation)

document.getElementById("gender_identity").textContent = text(char.identity?.gender_identity)
document.getElementById("pronouns").textContent = list(char.identity?.pronouns)
document.getElementById("orientation").textContent = text(char.identity?.orientation)

document.getElementById("height").textContent = text(char.appearance?.height)
document.getElementById("build").textContent = text(char.appearance?.build)
document.getElementById("eye_colour").textContent = text(char.appearance?.eye_colour)
document.getElementById("hair_colour").textContent = text(char.appearance?.hair_colour)

document.getElementById("likes").textContent = list(char.personality?.likes)
document.getElementById("dislikes").textContent = list(char.personality?.dislikes)
document.getElementById("strengths").textContent = list(char.personality?.strengths)
document.getElementById("weaknesses").textContent = list(char.personality?.weaknesses)
document.getElementById("hobbies").textContent = list(char.personality?.hobbies)

listLinks(char.relationships,"relationships")
listLinks(char.partners,"partners")
listLinks(char.pets,"pets")
listLinks(char.stories,"stories")

document.getElementById("backstory").textContent = text(char.backstory)

const trivia = document.getElementById("trivia")

if(!char.trivia || char.trivia.length === 0){
trivia.innerHTML = "<li>N/A</li>"
}else{
trivia.innerHTML = char.trivia.map(t => `<li>${t}</li>`).join("")
}

const palette = document.getElementById("palette")

if(!char.palette){
palette.innerHTML = "N/A"
}else{

palette.innerHTML = Object.values(char.palette)
.filter(v => v)
.map(c => `<span style="display:inline-block;width:40px;height:40px;background:${c};margin-right:6px;"></span>`)
.join("")

}

const links = document.getElementById("links")

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

if(char.fullbody){
document.getElementById("fullbody").src = char.fullbody
}else{
document.getElementById("fullbody").style.display = "none"
}

}

loadCharacter()