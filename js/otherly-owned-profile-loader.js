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


  setupPartners(character)

  setupRelationships(character)

  setupPets(character)

  setupCharacterBackground(
    character
  )

}

async function setupPartners(character){

  const section =
    document.getElementById(
      "partners-section"
    )

  const container =
    document.getElementById(
      "partners-container"
    )

  const template =
    document.getElementById(
      "partner-template"
    )


  if(
    !section ||
    !container ||
    !template
  ){

    return

  }


  if(
    !Array.isArray(character.partners) ||
    character.partners.length === 0
  ){

    section.hidden =
      true

    return

  }


  container.innerHTML =
    ""

  let loadedPartners =
    0


  for(
    const partner of character.partners
  ){

    if(
      !partner ||
      !partner.file
    ){

      continue

    }


    try{

      const response =
        await fetch(
          partner.file
        )


      if(!response.ok){

        throw new Error(
          `Partner character not found: ${partner.file}`
        )

      }


      const partnerChar =
        await response.json()


      const partnerCard =
        template.content.cloneNode(
          true
        )


      // =========================
      // PARTNER AVATAR
      // =========================

      const avatar =
        partnerCard.querySelector(
          ".partner-avatar"
        )

      if(avatar){

        avatar.style.backgroundImage =
          partnerChar.avatar
            ? `url("${partnerChar.avatar}")`
            : `url("https://placehold.co/120")`

      }


      // =========================
      // PARTNER LINK
      // =========================

      const avatarLink =
        partnerCard.querySelector(
          ".partner-avatar-link"
        )


      if(avatarLink){

        const partnerSlug =
          partner.file
            .replace(".json", "")
            .split("/")
            .pop()


        avatarLink.href =
          `character-profile.html?char=${partnerSlug}`

      }


      // =========================
      // PARTNER NAME
      // =========================

      const name =
        partnerCard.querySelector(
          ".partner-name"
        )

      if(name){

        name.textContent =
          text(
            partnerChar.name
          )

      }


      // =========================
      // PARTNER INFORMATION
      // =========================

      const age =
        partnerCard.querySelector(
          ".partner-age"
        )

      if(age){

        age.textContent =
          text(
            partnerChar.age
          )

      }


      const species =
        partnerCard.querySelector(
          ".partner-species"
        )

      if(species){

        species.textContent =
          text(
            partnerChar.species
          )

      }


      const gender =
        partnerCard.querySelector(
          ".partner-gender"
        )

      if(gender){

        gender.textContent =
          text(
            partnerChar.identity?.gender_identity
          )

      }


      const pronouns =
        partnerCard.querySelector(
          ".partner-pronouns"
        )

      if(pronouns){

        pronouns.textContent =
          list(
            partnerChar.identity?.pronouns
          )

      }


      // =========================
      // PARTNERSHIP INFORMATION
      // =========================

      const relationship =
        partnerCard.querySelector(
          ".partner-relationship"
        )

      if(relationship){

        relationship.textContent =
          text(
            partner.relationship
          )

      }


      const status =
        partnerCard.querySelector(
          ".partner-status"
        )

      if(status){

        status.textContent =
          text(
            partner.status
          )

      }


      const dynamic =
        partnerCard.querySelector(
          ".partner-dynamic"
        )

      if(dynamic){

        dynamic.textContent =
          text(
            partner.dynamic
          )

      }


      const since =
        partnerCard.querySelector(
          ".partner-since"
        )

      if(since){

        since.textContent =
          text(
            partner.since
          )

      }


      // =========================
      // PARTNER NOTES
      // =========================

      const notes =
        partnerCard.querySelector(
          ".partner-notes"
        )

      if(notes){

        if(
          Array.isArray(partner.notes) &&
          partner.notes.length > 0
        ){

          notes.innerHTML =
            partner.notes
              .map(
                note => `<li>${note}</li>`
              )
              .join("")

        }else if(partner.notes){

          notes.innerHTML =
            `<li>${partner.notes}</li>`

        }else{

          notes.innerHTML =
            "<li>N/A</li>"

        }

      }


      container.appendChild(
        partnerCard
      )

      loadedPartners++


    }catch(err){

      console.error(
        `Could not load partner: ${partner.file}`,
        err
      )

    }

  }


  section.hidden =
    loadedPartners === 0

}


async function setupRelationships(character){

  const section =
    document.getElementById(
      "relationships-section"
    )

  const container =
    document.getElementById(
      "relationships-container"
    )

  const template =
    document.getElementById(
      "relationship-template"
    )


  if(
    !section ||
    !container ||
    !template
  ){

    return

  }


  if(
    !Array.isArray(character.relationships) ||
    character.relationships.length === 0
  ){

    section.hidden =
      true

    return

  }


  container.innerHTML =
    ""

  let loadedRelationships =
    0


  for(
    const relationship of character.relationships
  ){

    if(
      !relationship ||
      !relationship.file
    ){

      continue

    }


    try{

      const response =
        await fetch(
          relationship.file
        )


      if(!response.ok){

        throw new Error(
          `Relationship character not found: ${relationship.file}`
        )

      }


      const relationshipChar =
        await response.json()


      const relationshipCard =
        template.content.cloneNode(
          true
        )


      // =========================
      // PROFILE LINK
      // =========================

      const characterLink =
        relationshipCard.querySelector(
          ".relationship-avatar-link"
        )


      const relationshipSlug =
        relationship.file
          .replace(".json", "")
          .split("/")
          .pop()


      if(characterLink){

        characterLink.href =
          `character-profile.html?char=${relationshipSlug}`

      }


      // =========================
      // AVATAR
      // =========================

      const avatar =
        relationshipCard.querySelector(
          ".relationship-avatar"
        )

      if(avatar){

        avatar.style.backgroundImage =
          relationshipChar.avatar
            ? `url("${relationshipChar.avatar}")`
            : `url("https://placehold.co/120")`

      }


      // =========================
      // NAME
      // =========================

      const name =
        relationshipCard.querySelector(
          ".relationship-name"
        )

      if(name){

        name.textContent =
          text(
            relationshipChar.name
          )

      }


      // =========================
      // RELATIONSHIP TYPE
      // =========================

      const type =
        relationshipCard.querySelector(
          ".relationship-type"
        )

      if(type){

        type.textContent =
          text(
            relationship.type
          )

      }


      container.appendChild(
        relationshipCard
      )

      loadedRelationships++


    }catch(err){

      console.error(
        `Could not load relationship: ${relationship.file}`,
        err
      )

    }

  }


  section.hidden =
    loadedRelationships === 0

}


async function setupPets(character){

  const section =
    document.getElementById(
      "pets-section"
    )

  const container =
    document.getElementById(
      "pets-container"
    )

  const template =
    document.getElementById(
      "pet-template"
    )


  if(
    !section ||
    !container ||
    !template
  ){

    return

  }


  if(
    !Array.isArray(character.pets) ||
    character.pets.length === 0
  ){

    section.hidden =
      true

    return

  }


  container.innerHTML =
    ""

  let loadedPets =
    0


  for(
    const pet of character.pets
  ){

    if(
      !pet ||
      !pet.file
    ){

      continue

    }


    try{

      const response =
        await fetch(
          pet.file
        )


      if(!response.ok){

        throw new Error(
          `Pet character not found: ${pet.file}`
        )

      }


      const petChar =
        await response.json()


      const petCard =
        template.content.cloneNode(
          true
        )


      // =========================
      // PET AVATAR
      // =========================

      const avatar =
        petCard.querySelector(
          ".pet-avatar"
        )

      if(avatar){

        avatar.style.backgroundImage =
          petChar.avatar
            ? `url("${petChar.avatar}")`
            : `url("https://placehold.co/120")`

      }


      // =========================
      // PET LINK
      // =========================

      const avatarLink =
        petCard.querySelector(
          ".pet-avatar-link"
        )


      if(avatarLink){

        const petSlug =
          pet.file
            .replace(".json", "")
            .split("/")
            .pop()


        avatarLink.href =
          `pet-profile.html?char=${petSlug}`

      }


      // =========================
      // PET NAME
      // =========================

      const name =
        petCard.querySelector(
          ".pet-name"
        )

      if(name){

        name.textContent =
          text(
            petChar.name
          )

      }


      // =========================
      // PET SPECIES
      // =========================

      const species =
        petCard.querySelector(
          ".pet-species"
        )

      if(species){

        species.textContent =
          text(
            petChar.species
          )

      }


      // =========================
      // PET GENDER
      // =========================

      const gender =
        petCard.querySelector(
          ".pet-gender"
        )

      if(gender){

        gender.textContent =
          text(
            petChar.identity?.gender_identity
          )

      }


      // =========================
      // PET NOTES
      // =========================

      const notes =
        petCard.querySelector(
          ".pet-notes"
        )

      if(notes){

        if(
          Array.isArray(pet.notes) &&
          pet.notes.length > 0
        ){

          notes.innerHTML =
            pet.notes
              .map(
                note => `<li>${note}</li>`
              )
              .join("")

        }else if(pet.notes){

          notes.innerHTML =
            `<li>${pet.notes}</li>`

        }else{

          notes.innerHTML =
            "<li>N/A</li>"

        }

      }


      // =========================
      // PET FULLBODY
      // =========================

      const fullbody =
        petCard.querySelector(
          ".pet-fullbody"
        )

      if(fullbody){

        fullbody.style.backgroundImage =
          petChar.fullbody
            ? `url("${petChar.fullbody}")`
            : `url("https://placehold.co/400x600")`

      }


      // =========================
      // PET IMAGE LINK
      // =========================

      const imageLink =
        petCard.querySelector(
          ".pet-image-link"
        )


      if(imageLink){

        const petSlug =
          pet.file
            .replace(".json", "")
            .split("/")
            .pop()


        imageLink.href =
          `pet-profile.html?char=${petSlug}`

      }


      container.appendChild(
        petCard
      )

      loadedPets++


    }catch(err){

      console.error(
        `Could not load pet: ${pet.file}`,
        err
      )

    }

  }


  section.hidden =
    loadedPets === 0

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