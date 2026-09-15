function getCharacter(){

const params = new URLSearchParams(window.location.search)
return params.get("char")

}

function applyCharacterColors(char){

  const colors = char.colors || {}
  const characterBackground = char.characterBackground || {}

  const primary = colors.primary || "#b99b78"
  const secondary = colors.secondary || "#a27d5f"
  const accent = colors.accent || "#8b6a4d"
  const bg1 = colors.bg_1 || "#f4efe6"
  const bg2 = colors.bg_2 || "#f3f1ec"
  const pageBg = colors.page_bg || "#f3f1ec"
  const backgroundGradient = colors.background_gradient || "#FFFFFF"

  const particleColor = characterBackground.particle_color || primary
  const particleOpacity = characterBackground.particle_opacity ?? 0.18
  const particleBlur = characterBackground.particle_blur ?? 0

  const root = document.documentElement

  root.style.setProperty("--char-primary", primary)
  root.style.setProperty("--char-secondary", secondary)
  root.style.setProperty("--char-accent", accent)
  root.style.setProperty("--char-bg-1", bg1)
  root.style.setProperty("--char-bg-2", bg2)
  root.style.setProperty("--char-page-bg", pageBg)
  root.style.setProperty("--char-background-gradient", backgroundGradient)


  root.style.setProperty("--char-particle-color", particleColor)
  root.style.setProperty("--char-particle-opacity", particleOpacity)
  root.style.setProperty("--char-particle-blur", `${particleBlur}px`)
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
setupCharacterBackground(char)
setupDetailTabs()

}catch(err){

document.querySelector(".page-container").innerHTML =
"<h1>Character Not Found</h1><p>The requested character does not exist.</p>"

}

}

function text(value) {

  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return "N/A"
  }

  return value

}

function list(value){

  if(!value) return ""

  if(Array.isArray(value)){
    if(value.length === 0) return ""
    return value.join(", ")
  }

  return value
}

function setOptionalField(id, value){

  const el = document.getElementById(id)

  if(!el) return

  const row = el.closest(".info-row")
  const divider = row?.nextElementSibling

  const empty =
    value === undefined ||
    value === null ||
    value === "" ||
    value === "N/A"

  if(empty){

    // Hide the entire row
    if(row){
      row.hidden = true
    }else{
      el.hidden = true
    }

    // Hide the divider immediately after it
    if(divider && divider.classList.contains("info-divider")){
      divider.hidden = true
    }

    return
  }

  // Show the field
  el.textContent = value
  el.hidden = false

  if(row){
    row.hidden = false
  }

  if(divider && divider.classList.contains("info-divider")){
    divider.hidden = false
  }

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

async function setupPartners(char) {

  const section = document.getElementById("partners-section")
  const container = document.getElementById("partners-container")
  const template = document.getElementById("partner-template")

  if (!section || !container || !template) return

  // No partners = keep the entire section hidden
  if (!Array.isArray(char.partners) || char.partners.length === 0) {
    section.hidden = true
    return
  }

  container.innerHTML = ""

  let loadedPartners = 0

  for (const partner of char.partners) {

    if (!partner || !partner.file) continue

    try {

      // Fetch the partner's own character JSON
      const response = await fetch(partner.file)

      if (!response.ok) {
        throw new Error(`Partner character not found: ${partner.file}`)
      }

      const partnerChar = await response.json()

      // Clone the HTML template
      const partnerCard = template.content.cloneNode(true)


      // =========================================
      // PARTNER AVATAR
      // =========================================

      const avatar = partnerCard.querySelector(".partner-avatar")

      if (avatar) {

        avatar.style.backgroundImage =
          partnerChar.avatar
            ? `url("${partnerChar.avatar}")`
            : `url("https://placehold.co/120")`

      }


      // =========================================
      // PARTNER PROFILE LINK
      // =========================================

      const avatarLink =
        partnerCard.querySelector(".partner-avatar-link")

      if (avatarLink) {

        const partnerSlug =
          partner.file
            .replace(".json", "")
            .split("/")
            .pop()

        avatarLink.href =
          `character-profile.html?char=${partnerSlug}`

      }


      // =========================================
      // PARTNER NAME
      // =========================================

      const name =
        partnerCard.querySelector(".partner-name")

      if (name) {
        name.textContent = text(partnerChar.name)
      }


      // =========================================
      // RELATIONSHIP INFORMATION
      // =========================================

      const relationship =
        partnerCard.querySelector(".partner-relationship")

      if (relationship) {
        relationship.textContent = text(partner.relationship)
      }


      const status =
        partnerCard.querySelector(".partner-status")

      if (status) {
        status.textContent = text(partner.status)
      }


      const dynamic =
        partnerCard.querySelector(".partner-dynamic")

      if (dynamic) {
        dynamic.textContent = text(partner.dynamic)
      }


      const since =
        partnerCard.querySelector(".partner-since")

      if (since) {
        since.textContent = text(partner.since)
      }


      // =========================================
      // PARTNER INFORMATION
      // =========================================

      const age =
        partnerCard.querySelector(".partner-age")

      if (age) {
        age.textContent = text(partnerChar.age)
      }


      const species =
        partnerCard.querySelector(".partner-species")

      if (species) {
        species.textContent = text(partnerChar.species)
      }


      const gender =
        partnerCard.querySelector(".partner-gender")

      if (gender) {
        gender.textContent =
          text(partnerChar.identity?.gender_identity)
      }


      const pronouns =
        partnerCard.querySelector(".partner-pronouns")

      if (pronouns) {
        pronouns.textContent =
          list(partnerChar.identity?.pronouns)
      }


      // =========================================
      // RELATIONSHIP NOTES
      // =========================================

      const notes =
        partnerCard.querySelector(".partner-notes")

      if (notes) {

        if (Array.isArray(partner.notes) && partner.notes.length > 0) {

          notes.innerHTML = partner.notes
            .map(note => `<li>${note}</li>`)
            .join("")

        } else if (partner.notes) {

          notes.innerHTML =
            `<li>${partner.notes}</li>`

        } else {

          notes.innerHTML = "<li>N/A</li>"

        }

      }


      // =========================================
      // ADD CARD TO PAGE
      // =========================================

      container.appendChild(partnerCard)

      loadedPartners++

    } catch (err) {

      console.error(
        `Could not load partner: ${partner.file}`,
        err
      )

    }

  }


  // =========================================
  // SHOW SECTION ONLY IF A PARTNER LOADED
  // =========================================

  section.hidden = loadedPartners === 0

}

async function setupRelationships(char) {

  const section = document.getElementById("relationships-section")
  const container = document.getElementById("relationships-container")
  const template = document.getElementById("relationship-template")

  if (!section || !container || !template) return

  // No relationships = keep the entire section hidden
  if (!Array.isArray(char.relationships) || char.relationships.length === 0) {
    section.hidden = true
    return
  }

  container.innerHTML = ""

  let loadedRelationships = 0

  for (const relationship of char.relationships) {

    if (!relationship || !relationship.file) continue

    try {

      // Fetch the referenced character's JSON
      const response = await fetch(relationship.file)

      if (!response.ok) {
        throw new Error(
          `Relationship character not found: ${relationship.file}`
        )
      }

      const relationshipChar = await response.json()

      // Clone the relationship card template
      const relationshipCard = template.content.cloneNode(true)


      // =========================================
      // CHARACTER LINK
      // =========================================

      const characterLink =
        relationshipCard.querySelector(".relationship-avatar-link")

      const relationshipSlug =
        relationship.file
          .replace(".json", "")
          .split("/")
          .pop()

      if (characterLink) {
        characterLink.href =
          `character-profile.html?char=${relationshipSlug}`
      }


      // =========================================
      // AVATAR
      // =========================================

      const avatar =
        relationshipCard.querySelector(".relationship-avatar")

      if (avatar) {

        avatar.style.backgroundImage =
          relationshipChar.avatar
            ? `url("${relationshipChar.avatar}")`
            : `url("https://placehold.co/120")`

      }


      // =========================================
      // NAME
      // =========================================

      const name =
        relationshipCard.querySelector(".relationship-name")

      if (name) {
        name.textContent = text(relationshipChar.name)
      }


      // =========================================
      // RELATIONSHIP TYPE
      // =========================================

      const type =
        relationshipCard.querySelector(".relationship-type")

      if (type) {
        type.textContent = text(relationship.type)
      }


      // =========================================
      // ADD CARD
      // =========================================

      container.appendChild(relationshipCard)

      loadedRelationships++

    } catch (err) {

      console.error(
        `Could not load relationship: ${relationship.file}`,
        err
      )

    }

  }


  // Only show the section if at least one
  // relationship successfully loaded
  section.hidden = loadedRelationships === 0

}

async function setupPets(char) {

const section = document.getElementById("pets-section")
const container = document.getElementById("pets-container")
const template = document.getElementById("pet-template")

if (!section || !container || !template) return

if (!Array.isArray(char.pets) || char.pets.length === 0) {
section.hidden = true
return
}

container.innerHTML = ""

let loadedPets = 0

for (const pet of char.pets) {

if (!pet || !pet.file) continue

try {

  const response = await fetch(pet.file)

  if (!response.ok) {
    throw new Error(`Pet character not found: ${pet.file}`)
  }

  const petChar = await response.json()

  const petCard = template.content.cloneNode(true)


  // =========================================
  // PET SLUG / PROFILE LINK
  // =========================================

  const petSlug =
    pet.file
      .replace(".json", "")
      .split("/")
      .pop()

  const petProfileUrl =
    `pet-profile.html?char=${petSlug}`


  // =========================================
  // PET AVATAR
  // =========================================

  const avatar =
    petCard.querySelector(".pet-avatar")

  if (avatar) {
    avatar.style.backgroundImage =
      petChar.avatar
        ? `url("${petChar.avatar}")`
        : `url("https://placehold.co/120")`
  }


  const avatarLink =
    petCard.querySelector(".pet-avatar-link")

  if (avatarLink) {
    avatarLink.href = petProfileUrl
  }


  // =========================================
  // PET NAME
  // =========================================

  const name =
    petCard.querySelector(".pet-name")

  if (name) {
    name.textContent = text(petChar.name)
  }


  // =========================================
  // PET SPECIES
  // =========================================

  const species =
    petCard.querySelector(".pet-species")

  if (species) {
    species.textContent = text(petChar.species)
  }


  // =========================================
  // PET GENDER
  // =========================================

  const gender =
    petCard.querySelector(".pet-gender")

  if (gender) {
    gender.textContent =
      text(petChar.identity?.gender_identity)
  }


  // =========================================
  // PET FULLBODY
  // =========================================

  const fullbody =
    petCard.querySelector(".pet-fullbody")

  if (fullbody) {

    fullbody.style.backgroundImage =
      petChar.fullbody
        ? `url("${petChar.fullbody}")`
        : `url("https://placehold.co/300")`

  }


  const imageLink =
    petCard.querySelector(".pet-image-link")

  if (imageLink) {
    imageLink.href = petProfileUrl
  }


  // =========================================
  // PET NOTES
  // =========================================

  const notes =
    petCard.querySelector(".pet-notes")

  if (notes) {

    if (Array.isArray(pet.notes) && pet.notes.length > 0) {

      notes.innerHTML = pet.notes
        .map(note => `<li>${note}</li>`)
        .join("")

    } else if (pet.notes) {

      notes.innerHTML =
        `<li>${pet.notes}</li>`

    } else {

      notes.innerHTML = "<li>N/A</li>"

    }

  }


  // =========================================
  // ADD CARD
  // =========================================

  container.appendChild(petCard)

  loadedPets++

} catch (err) {

  console.error(
    `Could not load pet: ${pet.file}`,
    err
  )

}


}

section.hidden = loadedPets === 0

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

// Set decor image (in-between box)
const decorImage = char.decorImage;

const box1 = document.getElementById("decor-image");
const box2 = document.getElementById("decor-image-2");

const finalImageUrl = decorImage ? decorImage : 'https://placehold.co/1000x100';

if (box1) {
  box1.style.backgroundImage = `url("${finalImageUrl}")`;
}

if (box2) {
  box2.style.backgroundImage = `url("${finalImageUrl}")`;
}

// map

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

strengths: list(char.personality?.strengths),
weaknesses: list(char.personality?.weaknesses),
interests: list(char.personality?.interests),
hobbies: list(char.personality?.hobbies),
values: list(char.personality?.values),
goals: list(char.personality?.goals),

temperament: list(char.psychology?.temperament),
confidence: list(char.psychology?.confidence),
self_worth: list(char.psychology?.self_worth),
philosophy: list(char.psychology?.philosophy),
sense_of_humor: list(char.psychology?.sense_of_humor),
clothing_style: list(char.psychology?.clothing_style),

social_status: list(char.lifestyle?.social_status),
financial_status: list(char.lifestyle?.financial_status),
communication_style: list(char.lifestyle?.communication_style),
sleep_style: list(char.lifestyle?.sleep_style),
work_ethic: list(char.lifestyle?.work_ethic),
conflict_resolution: list(char.lifestyle?.conflict_resolution),

colours: list(char.favourites?.colours),
medias: list(char.favourites?.medias),
songs: list(char.favourites?.songs),
foods: list(char.favourites?.foods),
animals: list(char.favourites?.animals),
items: list(char.favourites?.items),

mental_health: list(char.health?.mental_health),
physical_health: list(char.health?.physical_health),
activity_level: list(char.health?.activity_level),
hygiene: list(char.health?.hygiene),
crisis_reaction: list(char.health?.crisis_reaction),

religion: list(char.background?.religion),
education: list(char.background?.education),
languages_spoken: list(char.background?.languages_spoken),
family_background: list(char.background?.family_background),
birthplace: list(char.background?.birthplace),
current_location: list(char.background?.current_location)
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

const likes = document.getElementById("likes")

if(likes){

  const notes = char.personality?.likes

  if(!notes || notes.length === 0){
    likes.innerHTML = "<li>N/A</li>"
  }else{
    likes.innerHTML = notes
      .map(note => `<li>${note}</li>`)
      .join("")
  }

}

const dislikes = document.getElementById("dislikes")

if(dislikes){

  const notes = char.personality?.dislikes

  if(!notes || notes.length === 0){
    dislikes.innerHTML = "<li>N/A</li>"
  }else{
    dislikes.innerHTML = notes
      .map(note => `<li>${note}</li>`)
      .join("")
  }

}


const healthNotes = document.getElementById("health-notes");

if (healthNotes) {
  const notes = char.health?.notes;

  if (!notes || notes.length === 0) {
    healthNotes.innerHTML = "<li>N/A</li>";
  } else {
    healthNotes.innerHTML = notes
      .map(note => `<li>${note}</li>`)
      .join("");
  }
}


const backgroundNotes = document.getElementById("background-notes");

if (backgroundNotes) {
  const notes = char.background?.notes;

  if (!notes || notes.length === 0) {
    backgroundNotes.innerHTML = "<li>N/A</li>";
  } else {
    backgroundNotes.innerHTML = notes
      .map(note => `<li>${note}</li>`)
      .join("");
  }
}


Object.entries(map).forEach(([id, value]) => {

  setOptionalField(id, value)

})

listLinks(char.stories,"stories")

setupPartners(char)
setupRelationships(char)
setupPets(char)

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

function setupDetailTabs() {

  const detailTabs = document.querySelectorAll(".detail-switcher-tab");
  const detailPanels = document.querySelectorAll(".detail-switcher-panel");

  if (!detailTabs.length || !detailPanels.length) return;

  detailTabs.forEach(tab => {

    tab.addEventListener("click", () => {

      const targetId = tab.getAttribute("aria-controls");
      const targetPanel = document.getElementById(targetId);

      if (!targetPanel) return;

      // Update buttons
      detailTabs.forEach(button => {
        button.classList.remove("active");
        button.setAttribute("aria-selected", "false");
      });

      // Hide panels
      detailPanels.forEach(panel => {
        panel.hidden = true;
      });

      // Activate selected tab
      tab.classList.add("active");
      tab.setAttribute("aria-selected", "true");

      // Show selected panel
      targetPanel.hidden = false;

    });

  });

}

loadCharacter()
