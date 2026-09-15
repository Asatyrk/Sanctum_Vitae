function getOtherlyOwned(){

  const params =
    new URLSearchParams(window.location.search)

  return params.get("char")

}


function text(value){

  if(
    value === undefined ||
    value === null ||
    value === ""
  ){

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

  const el =
    document.getElementById(id)

  if(!el) return

  const row =
    el.closest(".info-row")

  const divider =
    row?.nextElementSibling

  const empty =
    value === undefined ||
    value === null ||
    value === "" ||
    value === "N/A"

  if(empty){

    if(row){

      row.hidden = true

    }else{

      el.hidden = true

    }

    if(
      divider &&
      divider.classList.contains("info-divider")
    ){

      divider.hidden = true

    }

    return

  }

  el.textContent =
    value

  el.hidden =
    false

  if(row){

    row.hidden =
      false

  }

  if(
    divider &&
    divider.classList.contains("info-divider")
  ){

    divider.hidden =
      false

  }

}


function applyCharacterColors(character){

  const colors =
    character.colors || {}

  const characterBackground =
    character.characterBackground || {}

  const primary =
    colors.primary || "#b99b78"

  const secondary =
    colors.secondary || "#a27d5f"

  const accent =
    colors.accent || "#8b6a4d"

  const bg1 =
    colors.bg_1 || "#f4efe6"

  const bg2 =
    colors.bg_2 || "#f3f1ec"

  const pageBg =
    colors.page_bg || "#f3f1ec"

  const backgroundGradient =
    colors.background_gradient || "#FFFFFF"

  const particleColor =
    characterBackground.particle_color ||
    primary

  const particleOpacity =
    characterBackground.particle_opacity ?? 0.18

  const particleBlur =
    characterBackground.particle_blur ?? 0

  const root =
    document.documentElement

  root.style.setProperty(
    "--char-primary",
    primary
  )

  root.style.setProperty(
    "--char-secondary",
    secondary
  )

  root.style.setProperty(
    "--char-accent",
    accent
  )

  root.style.setProperty(
    "--char-bg-1",
    bg1
  )

  root.style.setProperty(
    "--char-bg-2",
    bg2
  )

  root.style.setProperty(
    "--char-page-bg",
    pageBg
  )

  root.style.setProperty(
    "--char-background-gradient",
    backgroundGradient
  )

  root.style.setProperty(
    "--char-particle-color",
    particleColor
  )

  root.style.setProperty(
    "--char-particle-opacity",
    particleOpacity
  )

  root.style.setProperty(
    "--char-particle-blur",
    `${particleBlur}px`
  )

}


function setupCharacterBackground(character){

  const container =
    document.getElementById(
      "character-particles"
    )

  if(!container) return

  const characterBackground =
    character.characterBackground || {}

  const count =
    Math.max(
      1,
      Math.min(
        Number(
          characterBackground.particle_count
        ) || 14,
        100
      )
    )

  const shape =
    characterBackground.particle_shape ||
    "square"

  const randomSize =
    characterBackground.particle_random_size ??
    false

  container.innerHTML =
    ""

  for(let i = 0; i < count; i++){

    const particle =
      document.createElement("div")

    particle.className =
      "character-particle"

    particle.dataset.shape =
      shape

    let size

    if(randomSize){

      size =
        16 + Math.random() * 35

    }else{

      size =
        24

    }

    const left =
      Math.random() * 100

    const duration =
      8 + Math.random() * 10

    const delay =
      -(Math.random() * duration)

    const startRotation =
      Math.random() * 360

    const endRotation =
      Math.random() * 360

    const blur =
      characterBackground.particle_blur ?? 0

    particle.style.setProperty(
      "--particle-width",
      `${size}px`
    )

    particle.style.setProperty(
      "--particle-height",
      `${size}px`
    )

    particle.style.setProperty(
      "--particle-left",
      `${left}%`
    )

    particle.style.setProperty(
      "--particle-duration",
      `${duration}s`
    )

    particle.style.setProperty(
      "--particle-delay",
      `${delay}s`
    )

    particle.style.setProperty(
      "--particle-start-rotation",
      `${startRotation}deg`
    )

    particle.style.setProperty(
      "--particle-end-rotation",
      `${endRotation}deg`
    )

    particle.style.setProperty(
      "--particle-blur",
      `${blur}px`
    )

    container.appendChild(
      particle
    )

  }

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
  // BACKGROUND
  // =========================

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

    const response =
      await fetch(path)


    if(!response.ok){

      throw new Error(
        "Otherly-Owned character not found"
      )

    }


    const character =
      await response.json()


    displayOtherlyOwned(
      character
    )


    console.log(
      "Loaded Otherly-Owned character:",
      character
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
        "<p>The requested Otherly-Owned character does not exist.</p>"

    }

  }

}


loadOtherlyOwned()