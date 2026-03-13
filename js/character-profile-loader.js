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

const data = await response.json()

displayCharacter(data)

}

function displayCharacter(char){
  document.getElementById("name").textContent = char.name

  document.getElementById("full_name").textContent = char.full_name
  document.getElementById("age").textContent = char.age
  document.getElementById("role").textContent = char.role

  document.getElementById("bio").textContent = char.bio
  document.getElementById("fullbody").src = char.fullbody

  const tags = Object.entries(char.tags || {})
    .map(([category, values]) => {
      if (!values || !values.length) return ""
      const tagsHtml = values
        .map(v => `<span class="tag" title="${category}">${v}</span>`)
        .join("")

      return `
        <div class="tag-group">
          <div class="tag-group-title">${category}</div>
          <div class="tag-group-list">${tagsHtml}</div>
        </div>
      `
    })
    .join("")

  document.getElementById("tags").innerHTML = tags || "<em>No tags set</em>"
}

loadCharacter()