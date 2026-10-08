function updateBreadcrumb(){
  const container = document.querySelector(".breadcrumb-container");

  if(!container){
    return;
  }

  const pageName = document.body.dataset.page?.trim();

  if(!pageName){
    return;
  }

  const pathname = window.location.pathname
    .split("/")
    .pop()
    .toLowerCase();

  let parent = "";
  let parentHref = "";

  switch(pathname){
    case "character_profile.html":
      parent = "Characters";
      parentHref = "characters.html";
      break;

    case "pet_profile.html":
      parent = "Pets";
      parentHref = "pets.html";
      break;

    case "otherly_owned_profile.html":
      parent = "Otherly-Owned";
      parentHref = "otherly_owned.html";
      break;

    case "story_profile.html":
      parent = "Stories";
      parentHref = "stories.html";
      break;

    case "faction_profile.html":
      parent = "Factions";
      parentHref = "factions.html";
      break;

    case "mortal_concepts_profile.html":
      parent = "Mortal Concepts";
      parentHref = "mortal_concepts.html";
      break;

    case "monstrous_compendium_profile.html":
      parent = "Monstrous Compendium";
      parentHref = "monstrous_compendium.html";
      break;

    case "short_reads_profile.html":
      parent = "Short Reads";
      parentHref = "short_reads.html";
      break;
  }

  let trail = [];

  if(
    pageName.toLowerCase() === "home"
  ){
    trail = [
      {
        name: "Home",
        href: "home.html"
      }
    ];
  }

  else if(parent){
    trail = [
      {
        name: "Home",
        href: "home.html"
      },

      {
        name: parent,
        href: parentHref
      },

      {
        name: pageName
      }
    ];
  }

  else {
    trail = [
      {
        name: "Home",
        href: "home.html"
      },

      {
        name: pageName
      }
    ];
  }

  container.innerHTML = trail
    .map((item, index) => {
      const isCurrent = index === trail.length - 1;

      const separator = index > 0 ? `<span class="breadcrumb-separator">/</span>` : "";

      const content = isCurrent
        ? `<span class="breadcrumb-current">${item.name}</span>`
        : `<a class="breadcrumb-link" href="${item.href}">${item.name}</a>`;

      return separator + content;
    })
    .join("");
}

document.addEventListener("DOMContentLoaded", () => {
  updateBreadcrumb();
});
