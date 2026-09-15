function getOtherlyOwned(){

  const params =
    new URLSearchParams(window.location.search)

  return params.get("char")

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
    `characters/otherly-owned/${slug}.json`


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