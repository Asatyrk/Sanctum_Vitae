function getOtherlyOwned(){

  return getCharacter()

}


function setPageTitle(name){

  const title =
    name || "Unknown Character"

  const pageTitle =
    document.getElementById(
      "page-title"
    )

  if(pageTitle){

    pageTitle.textContent =
      title

  }

  document.title =
    "Sanctum Vitae | " + title

}


function displayOtherlyOwned(character){

  applyCharacterColors(
    character
  )

  const name =
    text(character.name)


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

  if(
    avatarImage &&
    character.avatar
  ){

    avatarImage.style.backgroundImage =
      `url('${character.avatar}')`

  }else if(avatarImage){

    avatarImage.style.backgroundImage =
      `url('https://placehold.co/120')`

  }


  // =========================
  // BANNER
  // =========================

  const bannerImage =
    document.getElementById(
      "banner-image"
    )

  if(
    bannerImage &&
    character.banner
  ){

    bannerImage.style.backgroundImage =
      `url('${character.banner}')`

  }else if(bannerImage){

    bannerImage.style.backgroundImage =
      `url('https://placehold.co/600x200')`

  }


  // =========================
  // BASIC INFORMATION
  // =========================

  const map = {

    age:
      character.age,

    species:
      character.species,

    gender_identity:
      character.identity?.gender_identity,

    pronouns:
      list(
        character.identity?.pronouns
      ),

    orientation:
      character.identity?.orientation,

    elements:
      list(
        character.elements
      ),

    ethnicity:
      character.ethnicity,

    full_name:
      character.full_name,

    aliases:
      list(
        character.aliases
      ),

    occupation:
      list(
        character.occupation
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
  // PROFILE NOTES
  // =========================

  const profileNotes =
    document.getElementById(
      "profile-notes"
    )

  if(profileNotes){

    if(
      !character.profile_notes ||
      character.profile_notes.length === 0
    ){

      profileNotes.innerHTML =
        "<li>N/A</li>"

    }else{

      profileNotes.innerHTML =
        character.profile_notes
          .map(
            note => `<li>${note}</li>`
          )
          .join("")

    }

  }


  // =========================
  // SHARED CHARACTER SECTIONS
  // =========================

  setupPartners(character)

  setupRelationships(character)

  setupPets(character)

  setupCharacterBackground(
    character
  )

}


async function loadOtherlyOwned(){

  const slug =
    getOtherlyOwned()

  if(!slug){

    document.body.innerHTML =
      "No character selected"

    return

  }


  const path =
    `characters/otherly_owned/${slug}.json`


  try{

    const character =
      await fetchCharacter(
        path,
        "Otherly-owned character not found"
      )


    displayOtherlyOwned(
      character
    )

    setupCharacterNavigation(
     "characters/otherly_owned/index.json"
    )

  }catch(err){

    console.error(err)

    const page =
      document.querySelector(
        ".page-container"
      )

    if(page){

      page.innerHTML =
        "<h1>Character Not Found</h1>" +
        "<p>The requested otherly-owned character does not exist.</p>"

    }

  }

}


loadOtherlyOwned()