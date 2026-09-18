function getPet(){

return getCharacter()

}

async function displayPet(pet){

applyCharacterColors(
pet
)

const name =
text(pet.name)

// =========================
// HEADER
// =========================

const headerLogoText =
document.querySelector(
".site-logo-text"
)

if(headerLogoText){

headerLogoText.textContent =
  `Sanctum Vitae | ${name}`


}

setPageTitle(
name
)

// =========================
// NAME
// =========================

const nameEl =
document.getElementById(
"name"
)

if(nameEl){

nameEl.textContent =
  name


}

// =========================
// AVATAR
// =========================

const avatarImage =
document.getElementById(
"avatar-image"
)

if(avatarImage){

avatarImage.style.backgroundImage =
  `url('${pet.avatar || "https://placehold.co/120"}')`


}

// =========================
// BANNER
// =========================

const bannerImage =
document.getElementById(
"banner-image"
)

if(bannerImage){

bannerImage.style.backgroundImage =
  `url('${pet.banner || "https://placehold.co/600x200"}')`


}

// =========================
// FULLBODY / DESIGN IMAGE
// =========================

const designImage =
document.getElementById(
"design-image"
)

if(designImage){

designImage.style.backgroundImage =
  `url('${pet.fullbody || "https://placehold.co/600x600"}')`


}

// =========================
// PROFILE INFORMATION
// =========================

const map = {

age:
  pet.age,

species:
  pet.species,

gender_identity:
  pet.identity?.gender_identity,

pronouns:
  list(
    pet.identity?.pronouns
  ),

elements:
  list(
    pet.elements
  ),

aliases:
  list(
    pet.aliases
  ),

occupation:
  list(
    pet.occupation
  )


}

Object.entries(map).forEach(
([id, value]) => {

  setOptionalField(
    id,
    value
  )

}


)

// =========================
// DESIGN INFORMATION
// =========================

const designMap = {

size:
  pet.appearance?.size,

build:
  pet.appearance?.build,

eye_colour:
  pet.appearance?.eye_colour,

body_colour:
  pet.appearance?.body_colour


}

Object.entries(designMap).forEach(
([id, value]) => {

  setOptionalField(
    id,
    value
  )

}


)

// =========================
// PROFILE NOTES
// =========================

const profileNotes =
document.getElementById(
"profile-notes"
)

if(profileNotes){

profileNotes.innerHTML =
  pet.profile_notes?.length
    ? pet.profile_notes
        .map(
          note => `<li><span>${note}</span></li>`
        )
        .join("")
    : "<li>N/A</li>"


}

// =========================
// DESIGN NOTES
// =========================

const designNotes =
document.getElementById(
"design-notes"
)

if(designNotes){

const notes =
  pet.appearance?.design_notes

designNotes.innerHTML =
  notes?.length
    ? notes
        .map(
          note => `<li><span>${note}</span></li>`
        )
        .join("")
    : "<li>N/A</li>"


}

// =========================
// SHARED SECTIONS
// =========================

await setupPartners(
  pet
)

await setupRelationships(
  pet
)

await setupLinks(
  pet
)

setupCharacterBackground(
  pet
)

applyCharacterTextGradient(
pet
)

}

async function loadPet(){

const slug =
getPet()

if(!slug){

document.body.innerHTML =
  "No pet selected"

return


}

try{

const pet =
  await fetchCharacter(
    `characters/pets/${slug}.json`,
    "Pet not found"
  )

await displayPet(
  pet
)

setupCharacterNavigation(
  "characters/pets/index.json"
)

}catch(err){

console.error(
  err
)

const page =
  document.querySelector(
    ".page-container"
  )

if(page){

  page.innerHTML =
    "<h1>Pet Not Found</h1>" +
    "<p>The requested pet does not exist.</p>"

}


}

}

loadPet()