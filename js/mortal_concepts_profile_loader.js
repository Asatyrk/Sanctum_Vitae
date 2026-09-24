/* =========================================================
   MORTAL CONCEPT PROFILE LOADER
   ========================================================= */


/* =========================================================
   HELPERS
   ========================================================= */

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


function getConcept(){

  const params =
    new URLSearchParams(
      window.location.search
    )

  return params.get("species")

}


/* =========================================================
   DOM HELPERS
   ========================================================= */

function setText(id, value){

  const element =
    document.getElementById(
      id
    )

  if(!element) return

  element.textContent =
    text(value)

}


function hasValue(value){

  return (
    value !== undefined &&
    value !== null &&
    value !== ""
  )

}


function setOptionalElement(
  element,
  value
){

  if(!element) return

  if(hasValue(value)){

    element.textContent =
      value

    element.hidden =
      false

  }else{

    element.textContent =
      ""

    element.hidden =
      true

  }

}


function setSectionVisibility(
  element,
  visible
){

  if(!element) return

  element.hidden =
    !visible

}


/* =========================================================
   IMAGE HELPERS
   ========================================================= */

function setImage(
  element,
  imageUrl
){

  if(!element) return

  if(
    typeof imageUrl !== "string" ||
    imageUrl.trim() === ""
  ){

    element.removeAttribute(
      "src"
    )

    element.hidden =
      true

    return

  }

  const image =
    new Image()

  image.onload =
    () => {

      element.src =
        imageUrl

      element.hidden =
        false

    }

  image.onerror =
    () => {

      element.removeAttribute(
        "src"
      )

      element.hidden =
        true

    }

  image.src =
    imageUrl

}


/* =========================================================
   SLUG HELPERS
   ========================================================= */

function slugify(value){

  return String(
    value ?? ""
  )
    .toLowerCase()
    .replace(
      /[^a-z0-9]+/g,
      "-"
    )
    .replace(
      /^-+|-+$/g,
      "")

}


/* =========================================================
   FETCH
   ========================================================= */

async function fetchConcepts(
  path
){

  const response =
    await fetch(
      path
    )

  if(!response.ok){

    throw new Error(
      `Species not found: ${path}`
    )

  }

  return await response.json()

}


/* =========================================================
   LOAD CONCEPT
   ========================================================= */

async function loadMortalConcept(){

  const slug =
    getConcept()

  if(!slug){

    showConceptError(
      "No Species Selected",
      "No species was specified."
    )

    return

  }

  try{

    const conceptPath =
      `mortal_concepts/${slug}.json`

    const concept =
      await fetchConcepts(
        conceptPath
      )

    if(
      !concept ||
      typeof concept !== "object" ||
      Array.isArray(concept)
    ){

      throw new Error(
        `Invalid species data: ${conceptPath}`
      )

    }

    displayMortalConcept(
      concept
    )

  }catch(error){

    console.error(
      "Could not load species:",
      error
    )

    showConceptError(
      "Species Not Found",
      "The requested species could not be loaded."
    )

  }

}



/* =========================================================
   ERROR DISPLAY
   ========================================================= */

function showConceptError(
  title,
  message
){

  const page =
    document.querySelector(
      ".page-container"
    )

  if(!page) return

  page.innerHTML = `
    <h1>${title}</h1>
    <p>${message}</p>
  `

}


/* =========================================================
   DISPLAY CONCEPT
   ========================================================= */

function displayMortalConcept(
  concept
){

  if(!concept){

    return

  }


  const name =
    text(
      concept.name
    )


  /* =========================
     PAGE TITLE
     ========================= */

  const pageTitle =
    document.getElementById(
      "page-title"
    )

  if(pageTitle){

    pageTitle.textContent =
      name

  }

  document.title =
    "Mortal Concepts | " + name


  /* =========================
     HEADER / BREADCRUMB
     ========================= */

  const headerLogoText =
    document.querySelector(
      ".site-logo-text"
    )

  if(headerLogoText){

    headerLogoText.textContent =
      `Mortal Concepts | ${name}`

  }

  document.body.dataset.page =
    name

  if(
    typeof updateBreadcrumb ===
    "function"
  ){

    updateBreadcrumb()

  }


  /* =========================
     MAIN INFORMATION
     ========================= */

  populateBasicInformation(
    concept
  )


  /* =========================
     QUICK FACTS
     ========================= */

  populateQuickFacts(
    concept.quick_facts
  )


  /* =========================
     BEHAVIOUR
     ========================= */

  populateBehaviour(
    concept.behaviour
  )


  /* =========================
     ABILITIES
     ========================= */

  populateAbilities(
    concept.abilities
  )


  /* =========================
     FIELD NOTES
     ========================= */

  populateFieldNotes(
    concept["field notes"]
  )


  /* =========================
     EXTRA INFORMATION
     ========================= */

  populateExtraInformation(
    concept["extra information"]
  )


  /* =========================
     SUBSPECIES
     ========================= */

  populateSubspecies(
    concept.subspecies
  )

}


/* =========================================================
   BASIC INFORMATION
   ========================================================= */

function populateBasicInformation(
  concept
){

  /* =========================
     NAME
     ========================= */

  const nameElement =
    document.getElementById(
      "concept-name"
    )

  if(nameElement){

    nameElement.textContent =
      text(
        concept.name
      )

    nameElement.hidden =
      !hasValue(
        concept.name
      )

  }


  /* =========================
     OTHER NAMES
     ========================= */

  const akaElement =
    document.getElementById(
      "aka-names"
    )

  const otherNames =
    Array.isArray(
      concept["other names"]
    )
      ? concept["other names"].filter(
          Boolean
        )
      : []

  if(akaElement){

    if(otherNames.length){

      akaElement.textContent =
        otherNames.join(
          ", "
        )

      akaElement.hidden =
        false

    }else{

      akaElement.textContent =
        ""

      akaElement.hidden =
        true

    }

  }


  /* =========================
     LATIN NAME
     ========================= */

  const latinElement =
    document.getElementById(
      "latin-name"
    )

  if(latinElement){

    if(
      hasValue(
        concept["latin name"]
      )
    ){

      const italic =
        latinElement.querySelector(
          "i"
        )

      if(italic){

        italic.textContent =
          concept["latin name"]

      }else{

        latinElement.textContent =
          concept["latin name"]

      }

      latinElement.hidden =
        false

    }else{

      latinElement.textContent =
        ""

      latinElement.hidden =
        true

    }

  }


  /* =========================
     DESCRIPTION
     ========================= */

  const description =
    document.getElementById(
      "description"
    )

  if(description){

    if(
      hasValue(
        concept.description
      )
    ){

      description.textContent =
        concept.description

      description.hidden =
        false

    }else{

      description.textContent =
        ""

      description.hidden =
        true

    }

  }


  /* =========================
     IMAGE
     ========================= */

  const image =
    document.getElementById(
      "concept-image"
    )

  if(image){

    const imageUrl =
      concept.fullbody ||
      ""

    image.alt =
      hasValue(
        concept.name
      )
        ? `${concept.name} image`
        : ""

    setImage(
      image,
      imageUrl
    )

  }

}


/* =========================================================
   QUICK FACTS
   ========================================================= */

function populateQuickFacts(
  facts
){

  const section =
    document.getElementById(
      "quick-facts-section"
    )

  if(!section){

    return

  }


  const mappings = {

    "family":
      "quick-family",

    "rarity":
      "quick-rarity",

    "origin":
      "quick-origin",

    "range/habitat":
      "quick-range",

    "lifespan":
      "quick-lifespan",

    "height/build":
      "quick-height",

    "gender ratio":
      "quick-gender",

    "diet":
      "quick-diet",

    "native languages":
      "quick-languages"

  }


  let visibleFacts =
    0


  Object.entries(
    mappings
  ).forEach(
    ([key, id]) => {

      const element =
        document.getElementById(
          id
        )

      if(!element){

        return

      }


      const row =
        element.closest(
          ".info-row"
        )

      const separator =
        row?.nextElementSibling


      const value =
        facts?.[key]


      if(
        hasValue(
          value
        )
      ){

        element.textContent =
          value

        if(row){

          row.hidden =
            false

        }

        if(
          separator &&
          separator.classList.contains(
            "line_thin"
          )
        ){

          separator.hidden =
            false

        }

        visibleFacts++

      }else{

        element.textContent =
          ""

        if(row){

          row.hidden =
            true

        }

        if(
          separator &&
          separator.classList.contains(
            "line_thin"
          )
        ){

          separator.hidden =
            true

        }

      }

    }
  )

  const image =
    document.getElementById(
      "concept-image"
    )

  const hasImage =
    image &&
    !image.hidden &&
    image.getAttribute(
      "src"
    )

  setSectionVisibility(
    section,
    visibleFacts > 0 ||
    Boolean(
      hasImage
    )
  )

}


/* =========================================================
   TEXT SECTION HELPER
   ========================================================= */

function populateTextSection(
  sectionId,
  data,
  mappings
){

  const section =
    document.getElementById(
      sectionId
    )

  if(!section){

    return

  }


  let visibleItems =
    0


  Object.entries(
    mappings
  ).forEach(
    ([key, id]) => {

      const element =
        document.getElementById(
          id
        )

      if(!element){

        return

      }


      const value =
        data?.[key]


      const heading =
        element.previousElementSibling


      if(
        hasValue(
          value
        )
      ){

        element.textContent =
          value

        element.hidden =
          false

        if(
          heading &&
          heading.classList.contains(
            "box__title_small"
          )
        ){

          heading.hidden =
            false

        }

        visibleItems++

      }else{

        element.textContent =
          ""

        element.hidden =
          true

        if(
          heading &&
          heading.classList.contains(
            "box__title_small"
          )
        ){

          heading.hidden =
            true

        }

      }

    }
  )


  section.hidden =
    visibleItems === 0

}


/* =========================================================
   BEHAVIOUR
   ========================================================= */

function populateBehaviour(
  behaviour
){

  populateTextSection(
    "behaviour-section",
    behaviour,
    {

      "disposition":
        "behaviour-disposition",

      "social structure":
        "behaviour-social-structure",

      "communication":
        "behaviour-communication"

    }
  )

}


/* =========================================================
   ABILITIES
   ========================================================= */

function populateAbilities(
  abilities
){

  populateTextSection(
    "abilities-section",
    abilities,
    {

      "strengths":
        "abilities-strengths",

      "weaknesses":
        "abilities-weaknesses",

      "notable skills":
        "abilities-notable-skills"

    }
  )

}


/* =========================================================
   FIELD NOTES
   ========================================================= */

function populateFieldNotes(
  fieldNotes
){

  populateTextSection(
    "field-notes-section",
    fieldNotes,
    {

      "danger level":
        "field-danger-level",

      "signs of presence":
        "field-signs-of-presence",

      "approach advice":
        "field-approach-advice"

    }
  )

}


/* =========================================================
   EXTRA INFORMATION
   ========================================================= */

function populateExtraInformation(
  information
){

  const section =
    document.getElementById(
      "extra-information-section"
    )

  const container =
    document.getElementById(
      "extra-information"
    )

  if(
    !section ||
    !container
  ){

    return

  }


  container.innerHTML =
    ""


  const validInformation =
    Array.isArray(
      information
    )
      ? information.filter(
          Boolean
        )
      : []


  if(!validInformation.length){

    section.hidden =
      true

    return

  }


  validInformation.forEach(
    paragraph => {

      const element =
        document.createElement(
          "p"
        )

      element.className =
        "text-box__text"

      element.textContent =
        paragraph

      container.appendChild(
        element
      )

    }
  )


  section.hidden =
    false

}


/* =========================================================
   SUBSPECIES
   ========================================================= */

function populateSubspecies(
  subspecies
){

  const section =
    document.getElementById(
      "subspecies-section"
    )

  const container =
    document.getElementById(
      "subspecies-container"
    )

  if(
    !section ||
    !container
  ){

    return

  }


  container.innerHTML =
    ""


  const validSubspecies =
    Array.isArray(
      subspecies
    )
      ? subspecies.filter(
          subspeciesEntry => {

            if(
              !subspeciesEntry ||
              typeof subspeciesEntry !==
                "object"
            ){

              return false

            }

            return (
              hasValue(
                subspeciesEntry.name
              ) ||
              hasValue(
                subspeciesEntry["latin name"]
              ) ||
              hasValue(
                subspeciesEntry.description
              )
            )

          }
        )
      : []


  if(!validSubspecies.length){

    section.hidden =
      true

    return

  }


  validSubspecies.forEach(
    subspeciesEntry => {

      const wrapper =
        document.createElement(
          "div"
        )

      wrapper.className =
        "subspecies-entry"


      /* =========================
         NAME
         ========================= */

      if(
        hasValue(
          subspeciesEntry.name
        )
      ){

        const name =
          document.createElement(
            "h2"
          )

        name.className =
          "box__title_small"

        name.textContent =
          subspeciesEntry.name

        wrapper.appendChild(
          name
        )

      }


      /* =========================
         LATIN NAME
         ========================= */

      if(
        hasValue(
          subspeciesEntry["latin name"]
        )
      ){

        const latin =
          document.createElement(
            "p"
          )

        latin.className =
          "text-box__text"


        const italic =
          document.createElement(
            "i"
          )

        italic.textContent =
          subspeciesEntry[
            "latin name"
          ]


        latin.appendChild(
          italic
        )

        wrapper.appendChild(
          latin
        )

      }


      /* =========================
         DESCRIPTION
         ========================= */

      if(
        hasValue(
          subspeciesEntry.description
        )
      ){

        const description =
          document.createElement(
            "p"
          )

        description.className =
          "text-box__text"

        description.textContent =
          subspeciesEntry.description

        wrapper.appendChild(
          description
        )

      }


      container.appendChild(
        wrapper
      )

    }
  )


  section.hidden =
    false

}


/* =========================================================
   START
   ========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    loadMortalConcept()

  }
)