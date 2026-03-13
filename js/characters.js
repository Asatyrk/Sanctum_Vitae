async function loadCharacters(){

const response = await fetch("characters/index.json")
const characters = await response.json()

characters.sort((a,b)=>
a.name.localeCompare(b.name)
)

displayCharacters(characters)

}

function displayCharacters(characters){

const grid = document.getElementById("character-grid")

characters.forEach(char=>{

const card = document.createElement("a")

card.href = `character-profile.html?char=${char.path}`

card.className = "char-card"

card.innerHTML = `

<img src="${char.headshot}">

<p>${char.name}</p>

`

grid.appendChild(card)

})

}

loadCharacters()