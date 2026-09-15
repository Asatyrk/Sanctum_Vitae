function getPet(){

  return getCharacter()

}


function setPageTitle(name){

  const title =
    name || "Unknown Pet"

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


function displayPet(pet){

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

  if(
    avatarImage &&
    pet.avatar
  ){

    avatarImage.style.backgroundImage =
      `url('${pet.avatar}')`

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
    pet.banner
  ){

    bannerImage.style.backgroundImage =
      `url('${pet.banner}')`

  }else if(bannerImage){

    bannerImage.style.backgroundImage =
      `url('https://placehold.co/600x200')`

  }


  // =========================
  // FULLBODY
  // =========================

  const fullbodyImage =
    document.getElementById(
      "fullbody-image"
    )

  if(
    fullbodyImage &&
    pet.fullbody
  ){

    fullbodyImage.style.backgroundImage =
      `url('${pet.fullbody}')`

  }else if(fullbodyImage){

    fullbodyImage.style.backgroundImage =
      `url('https://placehold.co/400x600')`

  }


  // =========================
  // BASIC INFORMATION
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
      !pet.profile_notes ||
      pet.profile_notes.length === 0
    ){

      profileNotes.innerHTML =
        "<li>N/A</li>"

    }else{

      profileNotes.innerHTML =
        pet.profile_notes
          .map(
            note => `<li>${note}</li>`
          )
          .join("")

    }

  }


  // =========================
  // BACKGROUND
  // =========================

  setupCharacterBackground(
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


  const path =
    `characters/pets/${slug}.json`


  try{

    const pet =
      await fetchCharacter(
        path,
        "Pet not found"
      )


    displayPet(
      pet
    )


  }catch(err){

    console.error(err)

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