document.addEventListener("DOMContentLoaded", () => {

  /*
   * ============================================================
   * CHARACTER GROUPS
   * ============================================================
   */

  const characterGroups = {

    highGods: [
      "test",
      "person"
    ],

    coreGods: [
      "test"
    ],

    primaryGods: [
      "test"
    ],

    generalGods: [
      "test"
    ],

    minorGods: [
      "test"
    ],

    trainingGods: [
      "test"
    ],

    retiredGods: [
      "test"
    ]

  };


  /*
   * ============================================================
   * PATHS
   * ============================================================
   */

  const CHARACTER_JSON_PATH = "/characters/";
  const CHARACTER_PROFILE_PAGE = "/character_profile.html";


  /*
   * ============================================================
   * GROUP CONTAINERS
   * ============================================================
   */

  const groupContainers = {
    highGods: document.getElementById("pantheon-high-gods"),
    coreGods: document.getElementById("pantheon-core-gods"),
    primaryGods: document.getElementById("pantheon-primary-gods"),
    generalGods: document.getElementById("pantheon-general-gods"),
    minorGods: document.getElementById("pantheon-minor-gods"),
    trainingGods: document.getElementById("pantheon-training-gods"),
    retiredGods: document.getElementById("pantheon-retired-gods")
  };


  /*
   * ============================================================
   * TEMPLATE
   * ============================================================
   */

  const template = document.getElementById("pantheon-template");


  if (!template) {
    console.error(
      "Pantheon JS: #pantheon-template was not found."
    );
    return;
  }


  /*
   * ============================================================
   * CREATE CHARACTER CARD
   * ============================================================
   */

  async function createCharacterCard(characterId) {

    try {

      /*
       * Load the character JSON.
       */

      const response = await fetch(
        `${CHARACTER_JSON_PATH}${encodeURIComponent(characterId)}.json`,
        {
          cache: "no-cache"
        }
      );


      if (!response.ok) {
        throw new Error(
          `HTTP ${response.status} while loading ${characterId}.json`
        );
      }


      const data = await response.json();


      /*
       * Clone the HTML template.
       */

      const card = template.content.cloneNode(true);


      const cardElement = card.querySelector(".pantheon-card");
      const avatarLink = card.querySelector(".pantheon-avatar-link");
      const avatarContainer = card.querySelector(".pantheon-avatar");
      const nameElement = card.querySelector(".pantheon-name");
      const titleElement = card.querySelector(".god-title");


      /*
       * ========================================================
       * NAME
       * ========================================================
       */

      nameElement.textContent = data.name;


      /*
       * ========================================================
       * GOD TITLE
       * ========================================================
       */

      if (
        Array.isArray(data.occupation) &&
        data.occupation.length > 0
      ) {
        titleElement.textContent = data.occupation[0];
      } else {
        titleElement.textContent = "";
      }


      /*
       * ========================================================
       * PROFILE LINK
       * ========================================================
       */

      avatarLink.href =
        `${CHARACTER_PROFILE_PAGE}?char=${encodeURIComponent(characterId)}`;


      /*
       * ========================================================
       * AVATAR
       * ========================================================
       */

      if (data.avatar) {

        const image = document.createElement("img");

        image.src = data.avatar;
        image.alt = data.name;
        image.loading = "lazy";

        avatarContainer.appendChild(image);

      }


      /*
       * Store the character ID on the card.
       */

      cardElement.dataset.character = characterId;


      return card;


    } catch (error) {

      console.error(
        `Pantheon JS: Failed to load "${characterId}.json".`,
        error
      );

      return null;

    }

  }


  /*
   * ============================================================
   * LOAD ONE GROUP
   * ============================================================
   */

  async function loadGroup(groupName) {

    const container = groupContainers[groupName];

    if (!container) {
      console.error(
        `Pantheon JS: Container for "${groupName}" was not found.`
      );
      return;
    }


    const characters = characterGroups[groupName];

    if (!characters || characters.length === 0) {
      return;
    }


    /*
     * Load all characters in this group.
     */

    const cards = await Promise.all(
      characters.map(characterId =>
        createCharacterCard(characterId)
      )
    );


    /*
     * Add cards in the same order as the character list.
     */

    cards.forEach(card => {

      if (card) {
        container.appendChild(card);
      }

    });

  }


  /*
   * ============================================================
   * LOAD ALL GROUPS
   * ============================================================
   */

  async function loadAllGroups() {

    for (const groupName of Object.keys(characterGroups)) {
      await loadGroup(groupName);
    }

  }


  /*
   * ============================================================
   * START
   * ============================================================
   */

  loadAllGroups();

});