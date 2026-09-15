function getPet(){

  const params = new URLSearchParams(window.location.search)

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

  el.textContent = value
  el.hidden = false

  if(row){
    row.hidden = false
  }

  if(
    divider &&
    divider.classList.contains("info-divider")
  ){

    divider.hidden = false

  }

}


function applyCharacterColors(char){

  const colors = char.colors || {}
  const characterBackground = char.characterBackground || {}

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
    characterBackground.particle_color || primary

  const particleOpacity =
    characterBackground.particle_opacity ?? 0.18

  const particleBlur =
    characterBackground.particle_blur ?? 0

  const root = document.documentElement

  root.style.setProperty("--char-primary", primary)
  root.style.setProperty("--char-secondary", secondary)
  root.style.setProperty("--char-accent", accent)
  root.style.setProperty("--char-bg-1", bg1)
  root.style.setProperty("--char-bg-2", bg2)
  root.style.setProperty("--char-page-bg", pageBg)
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


function setupCharacterBackground(char){

  const container =
    document.getElementById("character-particles")

  if(!container) return

  const characterBackground =
    char.characterBackground || {}

  const count = Math.max(
    1,
    Math.min(
      Number(characterBackground.particle_count) || 14,
      100
    )
  )

  const shape =
    characterBackground.particle_shape || "square"

  const randomSize =
    characterBackground.particle_random_size ?? false

  container.innerHTML = ""

  for(let i = 0; i < count; i++){

    const particle =
      document.createElement("div")

    particle.className =
      "character-particle"

    particle.dataset.shape = shape

    let size

    if(randomSize){

      size =
        16 + Math.random() * 35

    }else{

      size = 24

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

    container.appendChild(particle)

  }

}


function setPageTitle(name){

  const title =
    name || "Unknown Pet"

  const pageTitle =
    document.getElementById("page-title")

  if(pageTitle){

    pageTitle.textContent = title

  }

  document.title =
    "Sanctum Vitae | " + title

}


function displayPet(pet){

  applyCharacterColors(pet)

  const name =
    text(pet.name)


  // Header

  const headerLogoText =
    document.querySelector(".site-logo-text")

  if(headerLogoText){

    headerLogoText.textContent =
      `Sanctum Vitae | ${name}`

  }


  setPageTitle(name)


  // Name

  const nameEl =
    document.getElementById("name")

  if(nameEl){

    nameEl.textContent = name

  }


  // Avatar

  const avatarImage =
    document.getElementById("avatar-image")

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


  // Banner

  const bannerImage =
    document.getElementById("banner-image")

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

  // Design Image

const designImage =
  document.getElementById("design-image")

if(
  designImage &&
  pet.fullbody
){

  designImage.style.backgroundImage =
    `url('${pet.fullbody}')`

}else if(designImage){

  designImage.style.backgroundImage =
    `url('https://placehold.co/400x600')`

}


  // Basic information

  const map = {

  age: pet.age,

  species: pet.species,

  gender_identity:
    pet.identity?.gender_identity,

  pronouns:
    list(pet.identity?.pronouns),

  elements:
    list(pet.elements),

  aliases:
    pet.aliases,

  occupation:
    list(pet.occupation),

  size:
    pet.appearance?.size,

  build:
    pet.appearance?.build,

  eye_colour:
    pet.appearance?.eye_colour,

  body_colour:
    pet.appearance?.body_colour

}


  Object.entries(map).forEach(
    ([id, value]) => {

      setOptionalField(id, value)

    }
  )


  // Profile notes

  const profileNotes =
    document.getElementById("profile-notes")

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
          .map(note => `<li>${note}</li>`)
          .join("")

    }

  }

async function setupPartners(pet){

  const section =
    document.getElementById("partners-section")

  const container =
    document.getElementById("partners-container")

  const template =
    document.getElementById("partner-template")


  // If this HTML isn't present, do nothing

  if(
    !section ||
    !container ||
    !template
  ){

    return

  }


  // No partners = hide the entire section

  if(
    !Array.isArray(pet.partners) ||
    pet.partners.length === 0
  ){

    section.hidden = true

    return

  }


  container.innerHTML = ""

  let loadedPartners = 0


  for(const partner of pet.partners){

    if(
      !partner ||
      !partner.file
    ){

      continue

    }


    try{

      // Load the owner's character JSON

      const response =
        await fetch(partner.file)


      if(!response.ok){

        throw new Error(
          `Partner character not found: ${partner.file}`
        )

      }


      const partnerChar =
        await response.json()


      // Clone the HTML template

      const partnerCard =
        template.content.cloneNode(true)


      // =========================================
      // OWNER AVATAR
      // =========================================

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


      // =========================================
      // OWNER PROFILE LINK
      // =========================================

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


      // =========================================
      // OWNER NAME
      // =========================================

      const name =
        partnerCard.querySelector(
          ".partner-name"
        )


      if(name){

        name.textContent =
          text(partnerChar.name)

      }


      // =========================================
      // OWNER INFORMATION
      // =========================================

      const age =
        partnerCard.querySelector(
          ".partner-age"
        )


      if(age){

        age.textContent =
          text(partnerChar.age)

      }


      const species =
        partnerCard.querySelector(
          ".partner-species"
        )


      if(species){

        species.textContent =
          text(partnerChar.species)

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


      // =========================================
      // OWNER / PARTNER NOTES
      // =========================================

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


      // =========================================
      // ADD OWNER CARD
      // =========================================

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


  // Only show section if at least
  // one owner successfully loaded

  section.hidden =
    loadedPartners === 0

}

async function setupRelationships(pet){

  const section =
    document.getElementById("relationships-section")

  const container =
    document.getElementById("relationships-container")

  const template =
    document.getElementById("relationship-template")


  // If this HTML isn't present, do nothing

  if(
    !section ||
    !container ||
    !template
  ){

    return

  }


  // No relationships = hide the entire section

  if(
    !Array.isArray(pet.relationships) ||
    pet.relationships.length === 0
  ){

    section.hidden = true

    return

  }


  container.innerHTML = ""

  let loadedRelationships = 0


  for(const relationship of pet.relationships){

    if(
      !relationship ||
      !relationship.file
    ){

      continue

    }


    try{

      // Load the referenced character JSON

      const response =
        await fetch(relationship.file)


      if(!response.ok){

        throw new Error(
          `Relationship character not found: ${relationship.file}`
        )

      }


      const relationshipChar =
        await response.json()


      // Clone the HTML template

      const relationshipCard =
        template.content.cloneNode(true)


      // =========================================
      // CHARACTER PROFILE LINK
      // =========================================

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


      // =========================================
      // AVATAR
      // =========================================

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


      // =========================================
      // NAME
      // =========================================

      const name =
        relationshipCard.querySelector(
          ".relationship-name"
        )


      if(name){

        name.textContent =
          text(relationshipChar.name)

      }


      // =========================================
      // RELATIONSHIP TYPE
      // =========================================

      const type =
        relationshipCard.querySelector(
          ".relationship-type"
        )


      if(type){

        type.textContent =
          text(relationship.type)

      }


      // =========================================
      // ADD CARD
      // =========================================

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


  // Only show the section if at least
  // one relationship successfully loaded

  section.hidden =
    loadedRelationships === 0

}

  setupPartners(pet)

  setupRelationships(pet)

  setupCharacterBackground(pet)

}


async function loadPet(){

  const slug = getPet()

  if(!slug){

    document.body.innerHTML =
      "No pet selected"

    return

  }


  const path =
    `characters/pets/${slug}.json`


  try{

    const response =
      await fetch(path)


    if(!response.ok){

      throw new Error(
        "Pet not found"
      )

    }


    const pet =
      await response.json()


    displayPet(pet)


    console.log(
      "Loaded pet:",
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