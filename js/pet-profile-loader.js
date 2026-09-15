function getPet() {

  const params = new URLSearchParams(window.location.search)

  return params.get("char")

}


async function loadPet() {

  const slug = getPet()

  if (!slug) {

    document.body.innerHTML = "No pet selected"

    return

  }


  const path = `characters/pets/${slug}.json`


  try {

    const response = await fetch(path)

    if (!response.ok) {

      throw new Error("Pet not found")

    }


    const pet = await response.json()

    console.log("Loaded pet:", pet)

  } catch (err) {

    console.error(err)

    document.body.innerHTML =
      "<h1>Pet Not Found</h1><p>The requested pet does not exist.</p>"

  }

}


loadPet()