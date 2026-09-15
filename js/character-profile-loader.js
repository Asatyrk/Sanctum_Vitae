async function loadCharacter(){

  const slug =
    getCharacter()

  if(!slug){

    document.body.innerHTML =
      "No character selected"

    return

  }


  try{

    const character =
      await fetchCharacter(
        `characters/${slug}.json`,
        "Character not found"
      )


    displayCharacter(
      character
    )


    setupDetailTabs()


  }catch(err){

    console.error(
      err
    )

    const page =
      document.querySelector(
        ".page-container"
      )

    if(page){

      page.innerHTML =
        "<h1>Character Not Found</h1>" +
        "<p>The requested character does not exist.</p>"

    }

  }

}


loadCharacter()