async function loadFactions(){

const response = await fetch("factions/index.json")
const factions = await response.json()

factions.sort((a,b)=>
a.name.localeCompare(b.name)
)

displayFactions(factions)

}

function displayFactions(factions){

const grid = document.getElementById("faction-grid")

factions.forEach(faction=>{

const card = document.createElement("a")

card.href = `faction-detail.html?faction=${faction.path}`

card.className = "faction-card"

card.innerHTML = `

<img src="${faction.logo}">

<p>${faction.name}</p>

`

grid.appendChild(card)

})

}

loadFactions()