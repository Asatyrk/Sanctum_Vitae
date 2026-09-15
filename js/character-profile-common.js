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

      row.hidden =
        true

    }else{

      el.hidden =
        true

    }

    if(
      divider &&
      divider.classList.contains("info-divider")
    ){

      divider.hidden =
        true

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