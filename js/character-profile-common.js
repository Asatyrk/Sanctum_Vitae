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

  const hasPageBgGradient =
   Array.isArray(colors.page_bg_gradient) &&
   colors.page_bg_gradient.length >= 2

  document.documentElement.classList.toggle(
   "has-page-bg-gradient",
   hasPageBgGradient
  )


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

  const pageBgGradient =
    Array.isArray(
      colors.page_bg_gradient
    ) &&
    colors.page_bg_gradient.length >= 2
      ? `linear-gradient(
          135deg,
          ${colors.page_bg_gradient.join(", ")}
        )`
      : `linear-gradient(
          to bottom,
          ${pageBg} 0%,
          ${pageBg} 65%,
          #ffffff 100%
        )`

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
    "--char-page-bg-gradient",
    pageBgGradient
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

function applyCharacterTextGradient(character) {
  const root = document.documentElement
  const colors = character?.colors || {}

  const textGradient =
    Array.isArray(colors.text_gradient) &&
    colors.text_gradient.length >= 2
      ? colors.text_gradient
      : null

  // No text_gradient: leave the existing primary/secondary
  // text colours alone and don't apply gradient classes.
  if (!textGradient) {
    root.classList.remove("has-text-gradient")

    document
      .querySelectorAll(".character-gradient-text")
      .forEach(element => {
        element.classList.remove("character-gradient-text")
      })

    root.style.removeProperty("--char-text-gradient")

    return
  }

  // text_gradient exists and has at least 2 colours
  root.style.setProperty(
    "--char-text-gradient",
    `linear-gradient(
      90deg,
      ${textGradient.join(", ")}
    )`
  )

  root.classList.add("has-text-gradient")

  const textElements =
    document.querySelectorAll(`
      body.character-profile-page
      :is(
        h1,
        h2,
        h3,
        h4,
        h5,
        h6,
        p,
        span,
        label,
        strong,
        em,
        b,
        i,
        small,
        summary,
        dt,
        dd,
        th,
        td,
        figcaption,
        blockquote,
        .breadcrumb-link
        ):not(.link-arrow)
    `)

  textElements.forEach(element => {
    element.classList.add("character-gradient-text")
  })
}


function setupCharacterBackground(character){

  const container =
    document.getElementById(
      "character-particles"
    )

  if(!container) return

  const characterBackground =
    character.characterBackground || {}

    const colors =
    character.colors || {}

    const particleColors =
     Array.isArray(characterBackground.particle_colors)
       ? characterBackground.particle_colors
           .filter(color => typeof color === "string" && color.trim() !== "")
       : []

   const fallbackParticleColor =
     characterBackground.particle_color?.trim() ||
     colors.primary ||
     "#b99b78"

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

  container.innerHTML = ""

  for(let i = 0; i < count; i++){

    const particle =
      document.createElement("div")

    particle.className =
      "character-particle"

    particle.dataset.shape =
      shape


    // Size

    let size

    if(randomSize){

      size =
        16 + Math.random() * 35

    }else{

      size =
        24

    }


    // Position and animation

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
      characterBackground.particle_blur ??
      0

      const particleColor =
       particleColors.length > 0
         ? particleColors[
             Math.floor(
               Math.random() * particleColors.length
             )
            ]
    : fallbackParticleColor

    particle.style.setProperty(
      "--particle-width",
      `${size}px`
    )

    particle.style.setProperty(
      "--particle-color",
      particleColor
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


function getCharacter(){

  const params =
    new URLSearchParams(
      window.location.search
    )

  return params.get("char")

}


async function fetchCharacter(
  path,
  errorMessage = "Character not found"
){

  const response =
    await fetch(path)

  if(!response.ok){

    throw new Error(
      errorMessage
    )

  }

  return await response.json()

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


function listLinks(list, id){

  const el =
    document.getElementById(id)

  if(!el) return

  if(!list || list.length === 0){

    el.innerHTML =
      "<li>N/A</li>"

    return

  }

  el.innerHTML =
    list.map(item => {

      if(item.file){

        const slug =
          item.file
            .replace(".json", "")
            .split("/")
            .pop()

        return `
          <li>
            <a href="character-profile.html?char=${slug}">
              ${item.name || item.title}
            </a>
          </li>
        `

      }

      return `
        <li>
          ${item.name || item.title}
        </li>
      `

    }).join("")

}


async function displayCharacter(character){

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

  document.body.dataset.page =
  name

  document.body.dataset.breadcrumbParent =
    "Factions"

  if (typeof updateBreadcrumb === "function") {
    updateBreadcrumb()
  }


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
  // FULLBODY
  // =========================

  const designImage =
    document.getElementById(
      "design-image"
    )

  if(
    designImage &&
    character.fullbody
  ){

    designImage.style.backgroundImage =
      `url('${character.fullbody}')`

  }else if(designImage){

    designImage.style.backgroundImage =
      `url('https://placehold.co/400x600')`

  }


    // =========================
  // DECOR IMAGE
  // =========================

  const decorImage =
    character.decorImage

  const fallbackImageUrl =
    "https://placehold.co/1000x100"

  const boxes = [
    document.getElementById(
      "decor-image"
    ),
    document.getElementById(
      "decor-image-2"
    ),
    document.getElementById(
      "decor-image-3"
    )
  ].filter(Boolean)


  function setDecorImage(
    box,
    imageUrl
  ){

    if(!box) return

    const testImage =
      new Image()

    testImage.onload =
      () => {

        box.style.backgroundImage =
          `url("${imageUrl}")`

      }

    testImage.onerror =
      () => {

        box.style.backgroundImage =
          `url("${fallbackImageUrl}")`

      }

    testImage.src =
      imageUrl

  }


  const finalImageUrl =
    typeof decorImage === "string" &&
    decorImage.trim() !== ""
      ? decorImage.trim()
      : fallbackImageUrl


  boxes.forEach(
    box => {

      setDecorImage(
        box,
        finalImageUrl
      )

    }
  )


  // =========================
  // BASIC / DETAIL INFORMATION
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
      ),

    height:
      character.appearance?.height,

    build:
      character.appearance?.build,

    eye_colour:
      character.appearance?.eye_colour,

    hair_colour:
      character.appearance?.hair_colour,

    relationship_status:
      character.status?.relationship_status,

    life_status:
      character.status?.life_status,

    birthday:
      character.dates?.birthday,

    zodiac:
      character.dates?.zodiac,

    mbti:
      character.psychology?.mbti,

    voice:
      character.voice,

    strengths:
      list(
        character.personality?.strengths
      ),

    weaknesses:
      list(
        character.personality?.weaknesses
      ),

    interests:
      list(
        character.personality?.interests
      ),

    hobbies:
      list(
        character.personality?.hobbies
      ),

    values:
      list(
        character.personality?.values
      ),

    goals:
      list(
        character.personality?.goals
      ),

    temperament:
      list(
        character.psychology?.temperament
      ),

    confidence:
      list(
        character.psychology?.confidence
      ),

    self_worth:
      list(
        character.psychology?.self_worth
      ),

    philosophy:
      list(
        character.psychology?.philosophy
      ),

    sense_of_humor:
      list(
        character.psychology?.sense_of_humor
      ),

    clothing_style:
      list(
        character.psychology?.clothing_style
      ),

    social_status:
      list(
        character.lifestyle?.social_status
      ),

    financial_status:
      list(
        character.lifestyle?.financial_status
      ),

    communication_style:
      list(
        character.lifestyle?.communication_style
      ),

    sleep_style:
      list(
        character.lifestyle?.sleep_style
      ),

    work_ethic:
      list(
        character.lifestyle?.work_ethic
      ),

    conflict_resolution:
      list(
        character.lifestyle?.conflict_resolution
      ),

    colours:
      list(
        character.favourites?.colours
      ),

    medias:
      list(
        character.favourites?.medias
      ),

    songs:
      list(
        character.favourites?.songs
      ),

    foods:
      list(
        character.favourites?.foods
      ),

    animals:
      list(
        character.favourites?.animals
      ),

    items:
      list(
        character.favourites?.items
      ),

    mental_health:
      list(
        character.health?.mental_health
      ),

    physical_health:
      list(
        character.health?.physical_health
      ),

    activity_level:
      list(
        character.health?.activity_level
      ),

    hygiene:
      list(
        character.health?.hygiene
      ),

    crisis_reaction:
      list(
        character.health?.crisis_reaction
      ),

    religion:
      list(
        character.background?.religion
      ),

    education:
      list(
        character.background?.education
      ),

    languages_spoken:
      list(
        character.background?.languages_spoken
      ),

    family_background:
      list(
        character.background?.family_background
      ),

    birthplace:
      list(
        character.background?.birthplace
      ),

    current_location:
      list(
        character.background?.current_location
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
            note => `<li><span>${note}</span></li>`
          )
          .join("")

    }

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
      character.appearance?.design_notes

    if(
      !notes ||
      notes.length === 0
    ){

      designNotes.innerHTML =
        "<li>N/A</li>"

    }else{

      designNotes.innerHTML =
        notes
          .map(
            note => `<li><span>${note}</span></li>`
          )
          .join("")

    }

  }


  // =========================
  // PERSONALITY NOTES
  // =========================

  const personalityNotes =
    document.getElementById(
      "personality-notes"
    )

  if(personalityNotes){

    const notes =
      character.personality?.notes

    if(
      !notes ||
      notes.length === 0
    ){

      personalityNotes.innerHTML =
        "<li>N/A</li>"

    }else{

      personalityNotes.innerHTML =
        notes
          .map(
            note => `<li><span>${note}</span></li>`
          )
          .join("")

    }

  }


  // =========================
  // LIKES
  // =========================

  const likes =
    document.getElementById(
      "likes"
    )

  if(likes){

    const notes =
      character.personality?.likes

    if(
      !notes ||
      notes.length === 0
    ){

      likes.innerHTML =
        "<li>N/A</li>"

    }else{

      likes.innerHTML =
        notes
          .map(
            note => `<li><span>${note}</span></li>`
          )
          .join("")

    }

  }


  // =========================
  // DISLIKES
  // =========================

  const dislikes =
    document.getElementById(
      "dislikes"
    )

  if(dislikes){

    const notes =
      character.personality?.dislikes

    if(
      !notes ||
      notes.length === 0
    ){

      dislikes.innerHTML =
        "<li>N/A</li>"

    }else{

      dislikes.innerHTML =
        notes
          .map(
            note => `<li><span>${note}</span></li>`
          )
          .join("")

    }

  }


  // =========================
  // HEALTH NOTES
  // =========================

  const healthNotes =
    document.getElementById(
      "health-notes"
    )

  if(healthNotes){

    const notes =
      character.health?.notes

    if(
      !notes ||
      notes.length === 0
    ){

      healthNotes.innerHTML =
        "<li>N/A</li>"

    }else{

      healthNotes.innerHTML =
        notes
          .map(
            note => `<li><span>${note}</span></li>`
          )
          .join("")

    }

  }


  // =========================
  // BACKGROUND NOTES
  // =========================

  const backgroundNotes =
    document.getElementById(
      "background-notes"
    )

  if(backgroundNotes){

    const notes =
      character.background?.notes

    if(
      !notes ||
      notes.length === 0
    ){

      backgroundNotes.innerHTML =
        "<li>N/A</li>"

    }else{

      backgroundNotes.innerHTML =
        notes
          .map(
            note => `<li><span>${note}</span></li>`
          )
          .join("")

    }

  }

  // =========================
  // BACKSTORY
  // =========================

  const backstory =
    document.getElementById(
      "backstory"
    )

  if(backstory){

    const backstoryText =
      Array.isArray(character.backstory)
        ? character.backstory.join("\n\n")
        : character.backstory || ""

    backstory.textContent =
      text(backstoryText)

  }


  // =========================
  // TRIVIA
  // =========================

  const trivia =
    document.getElementById(
      "trivia"
    )

  if(trivia){

    if(
      !character.trivia ||
      character.trivia.length === 0
    ){

      trivia.innerHTML =
        "<li>N/A</li>"

    }else{

      trivia.innerHTML =
        character.trivia
          .map(
            item => `<li><span>${item}</span></li>`
          )
          .join("")

    }

  }

    // =========================
  // EXTRAS
  // =========================

  const extrasImage =
    document.getElementById(
      "extras-image"
    )

  if(extrasImage){

    const fallback =
      "https://placehold.co/600x380"

    const imageUrl =
      character.IDImage ||
      fallback

    const testImage =
      new Image()

    testImage.onload =
      () => {

        extrasImage.src =
          imageUrl

      }

    testImage.onerror =
      () => {

        extrasImage.src =
          fallback

      }

    testImage.src =
      imageUrl

  }


  const extrasPalette =
    document.getElementById(
      "extras-palette"
    )

  if(extrasPalette){

    const palette =
      character.palette || {}

    extrasPalette.innerHTML =
      ""

    const addPaletteRow =
      (
        label,
        colour
      ) => {

        if(
          typeof colour !== "string" ||
          colour.trim() === ""
        ){

          return

        }

        const row =
  document.createElement(
    "div"
  )

row.className =
  "extras-palette-row"

const colourGroup =
  document.createElement(
    "span"
  )

colourGroup.className =
  "extras-palette-colour"

const swatch =
  document.createElement(
    "span"
  )

swatch.className =
  "extras-palette-swatch"

swatch.style.setProperty(
  "background-color",
  colour.trim(),
  "important"
)

swatch.setAttribute(
  "aria-hidden",
  "true"
)

const value =
  document.createElement(
    "span"
  )

value.className =
  "extras-palette-value"

value.textContent =
  colour

const labelElement =
  document.createElement(
    "span"
  )

labelElement.className =
  "extras-palette-label"

labelElement.textContent =
  label

colourGroup.appendChild(
  swatch
)

colourGroup.appendChild(
  value
)

row.appendChild(
  labelElement
)

row.appendChild(
  colourGroup
)

extrasPalette.appendChild(
  row
)

      }


    // =========================
    // SKIN
    // =========================

    if(
      Array.isArray(palette.skin)
    ){

      palette.skin.forEach(
        colour => {

          addPaletteRow(
            "Skin",
            colour
          )

        }
      )

    }


    // =========================
    // HAIR
    // =========================

    if(
      Array.isArray(palette.hair)
    ){

      palette.hair.forEach(
        colour => {

          addPaletteRow(
            "Hair",
            colour
          )

        }
      )

    }


    // =========================
    // EYES
    // =========================

    if(
      Array.isArray(palette.eyes)
    ){

      palette.eyes.forEach(
        colour => {

          addPaletteRow(
            "Eyes",
            colour
          )

        }
      )

    }


    // =========================
    // OTHER
    // =========================

    if(
      Array.isArray(palette.other)
    ){

      palette.other.forEach(
        item => {

          if(
            !item ||
            !Array.isArray(item.colour)
          ){

            return

          }

          item.colour.forEach(
            colour => {

              addPaletteRow(
                item.label || "Other",
                colour
              )

            }
          )

        }
      )

    }


    // =========================
    // EMPTY PALETTE
    // =========================

    if(
      extrasPalette.children.length === 0
    ){

      extrasPalette.innerHTML =
        `<span class="info-value">N/A</span>`

    }

  }

  // =========================
  // SHARED PROFILE SECTIONS
  // =========================

  await setupPartners(
    character
  )

  await setupRelationships(
    character
  )

  await setupPets(
    character
  )

  await setupStories(
    character
  )

  await setupFactions(
    character
  )

  await setupLinks(
    character
  )

  setupCharacterBackground(
    character
  )

  applyCharacterTextGradient(
    character
  )

}


async function setupCharacterNavigation(
  indexPath
){

  const currentSlug =
    getCharacter()

  if(!currentSlug){

    return

  }


  const response =
    await fetch(
      indexPath
    )

  if(!response.ok){

    return

  }


  const index =
    await response.json()


  if(
    !Array.isArray(index) ||
    index.length === 0
  ){

    return

  }


  const currentIndex =
    index.findIndex(
      entry => {

        const slug =
          entry.path
            .replace(/\.json$/, "")
            .split("/")
            .pop()

        return slug === currentSlug

      }
    )


  if(currentIndex === -1){

    return

  }


  const previousIndex =
    (
      currentIndex - 1 + index.length
    ) % index.length


  const nextIndex =
    (
      currentIndex + 1
    ) % index.length


  const previous =
    index[previousIndex]


  const next =
    index[nextIndex]


  const navigation =
    document.getElementById(
      "character-navigation"
    )


  if(!navigation){

    return

  }


  navigation.innerHTML = ""


  const previousLink =
    document.createElement(
      "a"
    )


  previousLink.href =
    getProfileUrl(
      previous.path
    )


  previousLink.textContent =
    "← Previous"


  const separator =
    document.createTextNode(
      " | "
    )


  const nextLink =
    document.createElement(
      "a"
    )


  nextLink.href =
    getProfileUrl(
      next.path
    )


  nextLink.textContent =
    "Next →"


  navigation.appendChild(
    previousLink
  )

  navigation.appendChild(
    separator
  )

  navigation.appendChild(
    nextLink
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

      const partnerChar =
        await fetchCharacter(
          partner.file,
          `Partner character not found: ${partner.file}`
        )


      const partnerCard =
        template.content.cloneNode(
          true
        )


      // Partner avatar

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


      // Partner link

const avatarLink =
  partnerCard.querySelector(
    ".partner-avatar-link"
  )

if(avatarLink){

  avatarLink.href =
    getProfileUrl(
      partner.file
    )

}



      // Partner name

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


      // Partner age

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


      // Partner species

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


      // Partner gender

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


      // Partner pronouns

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


      // Relationship

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


      // Status

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


      // Dynamic

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


      // Since

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


      // Notes

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
                note => `<li><span>${note}</span></li>`
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

function getProfileUrl(file){

  const slug =
    file
      .replace(/\.json$/, "")
      .split("/")
      .pop()

  let profilePage =
    "character-profile.html"


  if(
    file.startsWith(
      "characters/pets/"
    )
  ){

    profilePage =
      "pet-profile.html"

  }else if(
    file.startsWith(
      "characters/otherly_owned/"
    )
  ){

    profilePage =
      "otherly-owned-profile.html"

  }


  return `${profilePage}?char=${encodeURIComponent(slug)}`

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

      const relationshipChar =
        await fetchCharacter(
          relationship.file,
          `Relationship character not found: ${relationship.file}`
        )


      const relationshipCard =
        template.content.cloneNode(
          true
        )


      // Profile link

const characterLink =
  relationshipCard.querySelector(
    ".relationship-avatar-link"
  )

if(characterLink){

  characterLink.href =
    getProfileUrl(
      relationship.file
    )

}



      // Avatar

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


      // Name

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


      // Relationship type

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

      const petChar =
        await fetchCharacter(
          pet.file,
          `Pet character not found: ${pet.file}`
        )


      const petCard =
        template.content.cloneNode(
          true
        )


      // Pet slug / profile link

      const petSlug =
        pet.file
          .replace(".json", "")
          .split("/")
          .pop()

      const petProfileUrl =
        `pet-profile.html?char=${petSlug}`


      // Pet avatar

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


      const avatarLink =
        petCard.querySelector(
          ".pet-avatar-link"
        )

      if(avatarLink){

        avatarLink.href =
          petProfileUrl

      }


      // Pet name

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


      // Pet species

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


      // Pet gender

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


      // Pet notes

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
                note => `<li><span>${note}</span></li>`
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


      // Pet fullbody

      const fullbody =
        petCard.querySelector(
          ".pet-fullbody"
        )

      if(fullbody){

        fullbody.style.backgroundImage =
          petChar.fullbody
            ? `url("${petChar.fullbody}")`
            : `url("https://placehold.co/300x300")`

      }


      // Pet image link

      const imageLink =
        petCard.querySelector(
          ".pet-image-link"
        )

      if(imageLink){

        imageLink.href =
          petProfileUrl

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

function tagValue(tags, key){

  const value =
    tags?.[key]

  if(
    value === undefined ||
    value === null ||
    value === ""
  ){

    return "N/A"

  }

  if(Array.isArray(value)){

    if(value.length === 0){

      return "N/A"

    }

    return value.join(", ")

  }

  return value

}


// =================================================
// STORIES
// =================================================

async function setupStories(character){

  const section =
    document.getElementById(
      "stories-section"
    )

  const container =
    document.getElementById(
      "stories-container"
    )

  const template =
    document.getElementById(
      "story-template"
    )

  if(
    !section ||
    !container ||
    !template
  ){

    return

  }

  if(
    !Array.isArray(character.stories) ||
    character.stories.length === 0
  ){

    section.hidden =
      true

    return

  }

  container.innerHTML =
    ""

  let loadedStories =
    0


  for(
    const story of character.stories
  ){

    if(
      !story ||
      !story.file
    ){

      continue

    }

    try{

      const storyData =
        await fetchCharacter(
          story.file,
          `Story not found: ${story.file}`
        )


      const storyCard =
        template.content.cloneNode(
          true
        )


      // =========================
      // STORY PROFILE URL
      // =========================

      const storyName =
        storyData.name ||
        storyData.title ||
        story.name ||
        story.title ||
        ""


      const storyUrl =
  `story-profile.html?story=${
    encodeURIComponent(
      storyData.url
        .split("/")
        .pop()
        .replace(/\.html$/, "")
    )
  }`


      // =========================
      // AVATAR
      // =========================

      const avatar =
        storyCard.querySelector(
          ".story-avatar"
        )

      if(avatar){

        const fallback =
          "https://placehold.co/120"


        const imageUrl =
          storyData.avatar ||
          fallback


        const testImage =
          new Image()


        testImage.onload =
          () => {

            avatar.style.backgroundImage =
              `url("${imageUrl}")`

          }


        testImage.onerror =
          () => {

            avatar.style.backgroundImage =
              `url("${fallback}")`

          }


        testImage.src =
          imageUrl

      }


      // =========================
      // AVATAR LINK
      // =========================

      const avatarLink =
        storyCard.querySelector(
          ".story-avatar-link"
        )

      if(avatarLink){

        avatarLink.href =
          storyUrl

      }


      // =========================
      // TITLE
      // =========================

      const title =
        storyCard.querySelector(
          ".story-title"
        )

      if(title){

        title.textContent =
          text(
            storyName
          )

      }


      // =========================
      // TAGLINE
      // =========================

      const tagline =
        storyCard.querySelector(
          ".story-tagline"
        )

      if(tagline){

        tagline.textContent =
          text(
            storyData.tagline
          )

      }


      // =========================
      // BANNER
      // =========================

      const banner =
        storyCard.querySelector(
          ".story-banner"
        )

      if(banner){

        const fallback =
          "https://placehold.co/600x200"


        const imageUrl =
          storyData.banner ||
          fallback


        const testImage =
          new Image()


        testImage.onload =
          () => {

            banner.style.backgroundImage =
              `url("${imageUrl}")`

          }


        testImage.onerror =
          () => {

            banner.style.backgroundImage =
              `url("${fallback}")`

          }


        testImage.src =
          imageUrl

      }


      // =========================
      // DESCRIPTION
      // =========================

      const description =
        storyCard.querySelector(
          ".story-description"
        )

      if(description){

        const descriptionText =
          Array.isArray(
            storyData.description
          )
            ? storyData.description.join("\n\n")
            : storyData.description


        description.textContent =
          text(
            descriptionText
          )

      }


      // =========================
      // TAGS
      // =========================

      const tags =
        storyData.tags || {}


      const genre =
        storyCard.querySelector(
          ".story-genre"
        )

      if(genre){

        genre.textContent =
          tagValue(
            tags,
            "Genre"
          )

      }


      const ageRange =
        storyCard.querySelector(
          ".story-age-range"
        )

      if(ageRange){

        ageRange.textContent =
          tagValue(
            tags,
            "Age Range"
          )

      }


      const status =
        storyCard.querySelector(
          ".story-status"
        )

      if(status){

        status.textContent =
          tagValue(
            tags,
            "Status"
          )

      }


      const storyType =
        storyCard.querySelector(
          ".story-type"
        )

      if(storyType){

        storyType.textContent =
          tagValue(
            tags,
            "Story Type"
          )

      }


      // =========================
      // READ STORY BUTTON
      // =========================

      const readButton =
        storyCard.querySelector(
          ".story-read-button"
        )

      if(readButton){

        readButton.href =
          storyUrl

      }


      container.appendChild(
        storyCard
      )

      loadedStories++


    }catch(err){

      console.error(
        `Could not load story: ${story.file}`,
        err
      )

    }

  }


  section.hidden =
    loadedStories === 0

}


// =================================================
// FACTIONS
// =================================================

async function setupFactions(character){

  const section =
    document.getElementById(
      "factions-section"
    )

  const container =
    document.getElementById(
      "factions-container"
    )

  const template =
    document.getElementById(
      "faction-template"
    )

  if(
    !section ||
    !container ||
    !template
  ){

    return

  }

  if(
    !Array.isArray(character.factions) ||
    character.factions.length === 0
  ){

    section.hidden =
      true

    return

  }

  container.innerHTML =
    ""

  let loadedFactions =
    0


  for(
    const faction of character.factions
  ){

    if(
      !faction ||
      !faction.file
    ){

      continue

    }

    try{

      const factionData =
        await fetchCharacter(
          faction.file,
          `Faction not found: ${faction.file}`
        )


      const factionCard =
        template.content.cloneNode(
          true
        )


      // =========================
      // FACTION PROFILE URL
      // =========================

      const factionName =
        factionData.name ||
        factionData.title ||
        faction.name ||
        faction.title ||
        ""


      const factionUrl =
   `faction-profile.html?faction=${
    encodeURIComponent(
      factionData.url
        .split("/")
        .pop()
        .replace(/\.html$/, "")
    )
  }`



      // =========================
      // AVATAR
      // =========================

      const avatar =
        factionCard.querySelector(
          ".faction-avatar"
        )

      if(avatar){

        const fallback =
          "https://placehold.co/120"


        const imageUrl =
          factionData.avatar ||
          fallback


        const testImage =
          new Image()


        testImage.onload =
          () => {

            avatar.style.backgroundImage =
              `url("${imageUrl}")`

          }


        testImage.onerror =
          () => {

            avatar.style.backgroundImage =
              `url("${fallback}")`

          }


        testImage.src =
          imageUrl

      }


      // =========================
      // AVATAR LINK
      // =========================

      const avatarLink =
        factionCard.querySelector(
          ".faction-avatar-link"
        )

      if(avatarLink){

        avatarLink.href =
          factionUrl

      }


      // =========================
      // TITLE
      // =========================

      const title =
        factionCard.querySelector(
          ".faction-title"
        )

      if(title){

        title.textContent =
          text(
            factionName
          )

      }

      // =========================
      // DESCRIPTION
      // =========================

      const description =
        factionCard.querySelector(
          ".faction-description"
        )

      if(description){

        const descriptionText =
          Array.isArray(
            factionData.description
          )
            ? factionData.description.join("\n\n")
            : factionData.description


        description.textContent =
          text(
            descriptionText
          )

      }


      // =========================
      // TAGS
      // =========================

      const tags =
        factionData.tags || {}


      const parentFactions =
        factionCard.querySelector(
          ".faction-parent-factions"
        )

      if(parentFactions){

        parentFactions.textContent =
          tagValue(
            tags,
            "Parent Faction(s)"
          )

      }


      const type =
        factionCard.querySelector(
          ".faction-type"
        )

      if(type){

        type.textContent =
          tagValue(
            tags,
            "Type"
          )

      }


      // =========================
      // READ STORY BUTTON
      // =========================

      const readButton =
        factionCard.querySelector(
          ".faction-read-button"
        )

      if(readButton){

        readButton.href =
          factionUrl

      }


      container.appendChild(
        factionCard
      )

      loadedFactions++


    }catch(err){

      console.error(
        `Could not load faction: ${faction.file}`,
        err
      )

    }

  }


  section.hidden =
    loadedFactions === 0

}

async function setupLinks(character) {
  const section =
    document.getElementById(
      "links-section"
    );

  const container =
    document.getElementById(
      "links-container"
    );

  const template =
    document.getElementById(
      "link-template"
    );

  if (
    !section ||
    !container ||
    !template
  ) {
    return;
  }

  container.innerHTML =
    "";

  const links =
    character.links || {};

  let loadedLinks =
    0;

  // =========================
  // CREATE LINK CARD
  // =========================

  const createLinkCard =
    ({
      label,
      labelPrefix = null,
      url,
      image = null,
      icon = null,
      target = "_blank"
    }) => {
      if (
        !label ||
        !url
      ) {
        return;
      }

      const card =
        template.content.cloneNode(
          true
        );

      const link =
        card.querySelector(
          ".link-card"
        );

      const iconElement =
        card.querySelector(
          ".link-icon"
        );

      const labelEl =
        card.querySelector(
          ".link-label"
        );

      if (link) {
        link.href =
          url;

        link.target =
          target;
      }

      if(labelEl){

       if(labelPrefix){

        labelEl.innerHTML = `
          <span class="link-label-prefix">
            ${labelPrefix}
          </span>
          <span class="link-label-name">
            ${label}
          </span>
        `

        labelEl.classList.add(
          "link-label-related"
        )

      }else{

        labelEl.textContent =
          label

      }

    }

      // =========================
      // ICON
      // =========================

      if (iconElement) {
        const use =
          iconElement.querySelector(
            "use"
          );

        if (icon) {
          use?.setAttribute(
            "href",
            icon
          );
        } else if (image) {
          // Related character avatar

          iconElement.outerHTML = `
            <div
              class="link-icon link-icon-image"
              style="background-image:url('${image}')"
            ></div>
          `;
        } else {
          iconElement.outerHTML = `
            <div class="link-icon link-icon-placeholder">
              ↗
            </div>
          `;
        }
      }

      container.appendChild(
        card
      );

      loadedLinks++;
    };

  // =========================
  // STANDARD SOCIAL LINKS
  // =========================

  const standardLinks = [
    {
      key: "toyhouse",
      label: "Toyhouse",
      icon: "#icon-toyhouse"
    },

    {
      key: "gallery",
      label: "Gallery",
      icon: "#icon-gallery"
    },

    {
      key: "pinterest",
      label: "Pinterest",
      icon: "#icon-pinterest"
    },

    {
      key: "spotify",
      label: "Spotify",
      icon: "#icon-spotify"
    }
  ];


  standardLinks.forEach(
    item => {

      const url =
        links[item.key]

      if(
        typeof url !== "string" ||
        url.trim() === ""
      ){

        return

      }


      createLinkCard({

  label:
    item.label,

  url:
    url.trim(),

  icon:
    item.icon

})

    }
  )


  // =========================
  // RELATED CHARACTERS
  // =========================

  if(
    Array.isArray(
      links["related character(s)"]
    )
  ){

    for(
      const file of
      links["related character(s)"]
    ){

      if(
        typeof file !== "string" ||
        file.trim() === ""
      ){

        continue

      }


      try{

        const relatedCharacter =
          await fetchCharacter(
            file,
            `Related character not found: ${file}`
          )


        createLinkCard({

          label:
            text(
             relatedCharacter.name
           ),

         labelPrefix:
           "Related character",


          url:
            getProfileUrl(
              file
            ),

          image:
            relatedCharacter.avatar || null,

          target:
            "_self"

        })

      }catch(err){

        console.error(
          `Could not load related character: ${file}`,
          err
        )

      }

    }

  }


    // =========================
  // AU LINKS
  // =========================

  if(
    Array.isArray(
      links["AU(s)"]
    )
  ){

    links["AU(s)"].forEach(
      item => {

        if(
          !item ||
          !item.url ||
          !item.label
        ){

          return

        }


        createLinkCard({

          label:
            item.label,

          labelPrefix:
            "AU",

          url:
            item.url,

          icon:
            "#icon-au"

        })

      }
    )

  }


  // =========================
  // OTHER LINKS
  // =========================

  if(
    Array.isArray(
      links.other
    )
  ){

    links.other.forEach(
      item => {

        if(
          !item ||
          !item.url ||
          !item.label
        ){

          return

        }


        createLinkCard({

          label:
            item.label,

          url:
            item.url

        })

      }
    )

  }


  // =========================
  // SHOW / HIDE SECTION
  // =========================

  section.hidden =
    loadedLinks === 0

}


function setupDetailTabs(){

  const detailTabs =
    document.querySelectorAll(
      ".detail-switcher-tab"
    )

  const detailPanels =
    document.querySelectorAll(
      ".detail-switcher-panel"
    )

  if(
    !detailTabs.length ||
    !detailPanels.length
  ){

    return

  }


  detailTabs.forEach(
    tab => {

      tab.addEventListener(
        "click",
        () => {

          const targetId =
            tab.getAttribute(
              "aria-controls"
            )

          const targetPanel =
            document.getElementById(
              targetId
            )

          if(!targetPanel) return


          // Update buttons

          detailTabs.forEach(
            button => {

              button.classList.remove(
                "active"
              )

              button.setAttribute(
                "aria-selected",
                "false"
              )

            }
          )


          // Hide panels

          detailPanels.forEach(
            panel => {

              panel.hidden =
                true

            }
          )


          // Activate selected tab

          tab.classList.add(
            "active"
          )

          tab.setAttribute(
            "aria-selected",
            "true"
          )


          // Show selected panel

          targetPanel.hidden =
            false

        }
      )

    }
  )

}