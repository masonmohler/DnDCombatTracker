let characters = [];

// Load characters from localStorage when the page loads
window.onload = () => {
  const savedCharacters = localStorage.getItem("characters");
  if (savedCharacters) {
    characters = JSON.parse(savedCharacters);
    displayCharacters();
    displaySavedStatusDescriptions();
  }
};

// Function to display saved status descriptions on page load
function displaySavedStatusDescriptions() {
  characters.forEach((character) => {
    if (character.status) {
      displayStatusDescription(character.name, character.status);
    }
  });
}

function addCharacter(event) {
  event.preventDefault();

  const name = document.getElementById("charName").value;
  const initiative = parseInt(document.getElementById("initiative").value);
  const ac = parseInt(document.getElementById("ac").value);
  const hp = parseInt(document.getElementById("hp").value);

  const character = { name, initiative, ac, hp };

  characters.push(character);
  characters.sort((a, b) => b.initiative - a.initiative); // Sort characters by initiative (highest to lowest)

  document.getElementById("characterForm").reset();

  saveCharacters();
  displayCharacters();
  displaySavedStatusDescriptions();
}

function saveCharacters() {
  localStorage.setItem("characters", JSON.stringify(characters));
}

function displayCharacters() {
  const charactersContainer = document.querySelector(".characters");
  charactersContainer.innerHTML = "";

  characters.forEach((character) => {
    const characterCard = document.createElement("div");
    characterCard.classList.add("character-card");

    characterCard.innerHTML = `
      <h2>${character.name}</h2>
      <p>Initiative: ${character.initiative}</p>
      <p>AC: ${character.ac}</p>
      <p>HP: <span id="${character.name}-hp">${character.hp}</span></p>
      <input type="number" id="${character.name}-damage" placeholder="Enter Damage">
      <button onclick="updateHP('${character.name}')">Update HP</button>
      <input type="number" id="${character.name}-initiative" placeholder="Enter New Initative">
      <button onclick="updateInit('${character.name}')">Update Initiative</button>
      <select id="${character.name}-status">
        <option value="">Select Status</option>
        <option value=" ">None</option>
        <option value="blinded">Blinded</option>
        <option value="charmed">Charmed</option>
        <option value="deafened">Deafened</option>
        <option value="frightened">Frightened</option>
        <option value="grappled">Grappled</option>
        <option value="incapacitated">Incapacitated</option>
        <option value="invisible">Invisible</option>
        <option value="paralyzed">Paralyzed</option>
        <option value="petrified">Petrified</option>
        <option value="poisoned">Poisoned</option>
        <option value="restrained">Restrained</option>
        <option value="stunned">Stunned</option>
        <option value="unconscious">Unconscious</option>
      </select>
  <button onclick="applyStatus('${character.name}')">Apply</button>
  <div class="status-description" id="${character.name}-status-desc"></div>
  <button id="delete" onclick="deleteCharacter('${character.name}')">Delete Character</button>
    `;
    charactersContainer.appendChild(characterCard);
  });
}

function deleteCharacter(name) {
  characters = characters.filter((character) => character.name !== name);
  saveCharacters();
  displayCharacters();
  displaySavedStatusDescriptions();
}

function applyStatus(name) {
  const statusSelect = document.getElementById(`${name}-status`);
  const selectedStatus = statusSelect.value;
  const character = characters.find((char) => char.name === name);

  if (selectedStatus) {
    character.status = selectedStatus;
    displayCharacters();
    displayStatusDescription(name, selectedStatus); // Display status description
  }
  displaySavedStatusDescriptions();
  saveCharacters();
}

function displayStatusDescription(name, status) {
  const descriptions = {
    blinded: "Blinded: Can't see, auto-fails checks requiring sight.",
    charmed: "Charmed: Can't attack charmer, charm might alter actions.",
    deafened: "Deafened: Can't hear, auto-fails checks requiring hearing.",
    frightened:
      "Frightened: Disadvantage on ability checks and attacks, can't move closer to source of fear.",
    grappled: "Grappled: Speed becomes 0, can't benefit from bonuses to speed.",
    incapacitated: "Incapacitated: Can't take actions or reactions.",
    invisible:
      "Invisible: Can't be seen without special abilities, gains advantage on attacks.",
    paralyzed: "Paralyzed: Can't move or speak, auto-fails checks and attacks.",
    petrified: "Petrified: Turned to stone, incapacitated.",
    poisoned: "Poisoned: Disadvantage on attacks and ability checks.",
    restrained:
      "Restrained: Speed becomes 0, attacks have disadvantage, disadvantage on Dex saves.",
    stunned: "Stunned: Incapacitated, can't move, auto-fails Str/Dex saves.",
    unconscious: "Unconcious: Incapacitated, can't move or speak, drops prone.",
    // Add more descriptions as needed
  };

  const statusDesc = document.getElementById(`${name}-status-desc`);
  statusDesc.textContent = descriptions[status] || "";
}

function updateHP(name) {
  const damageInput = document.getElementById(`${name}-damage`);
  const damage = parseInt(damageInput.value);
  const character = characters.find((char) => char.name === name);

  if (!isNaN(damage)) {
    character.hp -= damage;
    if (character.hp < 0) {
      character.hp = 0; // Ensure HP doesn't go below 0
    }
    document.getElementById(`${name}-hp`).textContent = character.hp;
    damageInput.value = ""; // Clear the input field
  }

  // Re-sort characters after HP update
  characters.sort((a, b) => b.initiative - a.initiative);
  saveCharacters();
  displayCharacters();
  displaySavedStatusDescriptions();
}

function updateInit(name) {
  const newInit = document.getElementById(`${name}-initiative`);
  const initiative = parseInt(newInit.value);
  const character = characters.find((char) => char.name === name);

  character.initiative = initiative;

  document.getElementById(`${name}-initiative`).textContent =
    character.initiative;
  newInit.value = ""; // Clear the input field

  // Re-sort characters after initiative update
  characters.sort((a, b) => b.initiative - a.initiative);
  saveCharacters();
  displayCharacters();
  displaySavedStatusDescriptions();
}

document
  .getElementById("characterForm")
  .addEventListener("submit", addCharacter);
