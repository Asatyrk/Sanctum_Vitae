async function loadStories(){

const response = await fetch("stories/index.json")
const stories = await response.json()

stories.sort((a,b)=>
a.name.localeCompare(b.name)
)

displayStories(stories)

}

function displayStories(stories){

const grid = document.getElementById("story-grid")

stories.forEach(story=>{

const card = document.createElement("a")

card.href = `story-profile.html?story=${story.path}`

card.className = "story-card"

card.innerHTML = `

<img src="${story.logo}">

<p>${story.name}</p>

`

grid.appendChild(card)

})

}

loadStories()