const characters = [

"characters/test.json"

]

async function loadCharacters(){

const loadedCharacters = []

for(const path of characters){

const response = await fetch(path)
const data = await response.json()

data.path = path

loadedCharacters.push(data)

}

loadedCharacters.sort((a,b)=>
a.name.localeCompare(b.name)
)

displayCharacters(loadedCharacters)

}

function displayCharacters(characters){

const grid = document.getElementById("character-grid")

characters.forEach(char=>{

const card = document.createElement("a")

card.href = `oc.html?char=${char.path}`

card.className = "char-card"

card.innerHTML = `

<img src="${char.headshot}">

<p>${char.name}</p>

`

grid.appendChild(card)

})

}

loadCharacters()