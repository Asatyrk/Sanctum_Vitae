function getFaction(){

const params = new URLSearchParams(window.location.search)

return params.get("faction")

}

async function loadFaction(){

const path = getFaction()

if(!path){

document.body.innerHTML = "No faction selected"
return

}

const response = await fetch(path)

const data = await response.json()

displayFaction(data)

}

async function displayFaction(faction){

document.getElementById("name").textContent = faction.name

document.getElementById("logo").src = faction.logo

document.getElementById("description").textContent = faction.description

const charactersList = document.getElementById("characters-list")

for(const charPath of faction.characters){

const charResponse = await fetch(charPath)

const charData = await charResponse.json()

const charCard = document.createElement("a")

charCard.href = `character-detail.html?char=${charPath}`

charCard.className = "char-card"

charCard.innerHTML = `

<img src="${charData.headshot}">

<p>${charData.name}</p>

`

charactersList.appendChild(charCard)

}

}

loadFaction()