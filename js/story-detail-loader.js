function getStory(){

const params = new URLSearchParams(window.location.search)

return params.get("story")

}

async function loadStory(){

const path = getStory()

if(!path){

document.body.innerHTML = "No story selected"
return

}

const response = await fetch(path)

const data = await response.json()

displayStory(data)

}

async function displayStory(story){

document.getElementById("name").textContent = story.name

document.getElementById("logo").src = story.logo

document.getElementById("summary").textContent = story.summary

const charactersList = document.getElementById("characters-list")

for(const charPath of story.characters){

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

loadStory()