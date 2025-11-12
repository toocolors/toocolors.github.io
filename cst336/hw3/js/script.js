// Global Variables
const apiURL = "https://pokeapi.co/api/v2/pokemon";
let pokemonList = [];

// Event Listeners
document.querySelector("#queryButton").addEventListener("click", querySubmit);
document.querySelector("#queryNumber").addEventListener("input", updateNameQuery);
document.querySelector("#queryName").addEventListener("input", updateNumberQuery);
document.querySelector("#queryNumber").addEventListener("keypress", function(event) {
    if(event.key === "Enter") {
        querySubmit();
    }
});
document.querySelector("#queryName").addEventListener("keypress", function(event) {
    if(event.key === "Enter") {
        querySubmit();
    }
});

// Call Functions
checkExpDate();

// FUNCTIONS

/**
 * Checks expiration date of pokemon storage,
 *  calls getPokemonList if date is valid,
 *  calls updatePokemonList if date is invalid.
 * @returns 
 */
function checkExpDate() {
    // Get expiration date
    console.log("Getting expiration date from local storage...");
    let isDateValid = true;
    let expDate;
    try {
        expDate = Date.parse(localStorage.getItem("pokemonListExpirationDate"));
    } catch (err) {
        console.error("Failed to parse expiration date.", err);
        updatePokemonList();
        return;
    }
    
    // Check for expiration date in local storage, compare it to current date
    let currentDate = new Date();
    if (expDate == null) {
        console.log("Expiration date not found.");
        isDateValid = false;
    } else if (expDate < currentDate) {
        console.log("Pokemon list has expired.");
        isDateValid = false;
    }

    // Check for expiration date validity
    if(!isDateValid) {
        updatePokemonList();
    } else {
        console.log("Expiration date is valid!");
        getPokemonList();
    }
} // checkExpDate

/**
 * Gets pokemon data associated with the given id.
 * Looks for pokemon data in session storage,
 *  then from PokeAPI if nothing is found in session storage,
 *  then saves the pokemon data to session storage if it was retreived from PokeAPI.
 * @param {Number} id The id of the pokemon
 * @returns The JSON of the requested pokemon.
 */
async function getPokemon(id) {
    // Look for pokemon in session storage
    console.log(`Looking for ${pokemonList.results[id].name} in session storage...`);
    let data = sessionStorage.getItem(`pokemon-${id}`);
    let pokemon;
    if(data != null) {
        try {
            pokemon = JSON.parse(data);
            console.log(`Found ${pokemonList.results[id].name} in session storage!`);
            return pokemon;
        } catch (err) {
            console.error("Could not parse session storage data.", err);
        }
    }

    // Get pokemon from PokeAPI
    console.log(`Getting ${pokemonList.results[id].name} from PokeAPI...`);
    let response = await fetch(pokemonList.results[id].url);
    pokemon = await response.json();
    console.log(`Got ${pokemonList.results[id].name} from PokeAPI!`);

    // Save pokemon to session storage
    sessionStorage.setItem(`pokemon-${id}`, JSON.stringify(pokemon));

    // Return pokemon
    return pokemon;
} // getPokemon

/**
 * Gets pokemon list from local storage.
 * Calls updatePokemonList if pokemon list cannot 
 *  be retrieved or parsed from local storage.
 * @returns 
 */
async function getPokemonList() {
    // Check for Pokemon List in local storage
    console.log("Getting pokemon list from local storage...")
    let data = localStorage.getItem("pokemonList");
    if (data == null) {
        updatePokemonList();
        return;
    }

    // Parse pokemon list from local storage text
    try {
        pokemonList = await JSON.parse(data);
        console.log("Got pokemon list from local storage!")
    } catch (err) {
        console.error("Failed to parse pokemon list JSON.", err);
        updatePokemonList();
    }
} // getPokemonList

function parsePokemonName(name) {
    name = name.charAt(0).toUpperCase() + name.substring(1, name.length);
    return name;
}

async function querySubmit() {
    // Get id
    let queryNumber = document.querySelector("#queryNumber");
    let id;
    if (queryNumber.value != "") {
        id = queryNumber.value - 1;
    } else if (queryNumber.placeholder != "") {
        id = queryNumber.placeholder - 1;
    }

    // Check if id is valid
    if (!Number.isInteger(id) || id < 0 || pokemonList.count <= id) {
        return;
    }

    // Get Pokemon
    let pokemon = await getPokemon(id);

    // Update Sprite
    document.querySelector("#dexSprite").innerHTML = `<img src=${pokemon.sprites.front_default} alt=${pokemon.name}>`;

    // Update Cry
    document.querySelector("#dexCry").innerHTML = `<audio controls><source 
        src='${pokemon.cries.latest}'></audio>`;

    // Update Pokemon Name
    document.querySelector("#dexName").innerHTML = `${parsePokemonName(pokemonList.results[id].name)}`;
    
    // Update Pokemon ID
    document.querySelector("#dexNumber").innerHTML = id + 1;
    
    // Update Pokemon Types
    document.querySelector("#dexType").innerHTML = pokemon.types[0].type.name;
    if(pokemon.types.length == 2) {
        document.querySelector("#dexType").innerHTML += `, ${pokemon.types[1].type.name}`;
    }

    // Update Height
    document.querySelector("#dexHeight").innerHTML = `Height: ${pokemon.height * 3.937008}`;

    // Update Weight
    document.querySelector("#dexWeight").innerHTML = `Weight: ${pokemon.weight * 0.2204623}`;

    // Update Games
    let gamesDiv = document.querySelector("#dexGames");
    gamesDiv.innerHTML = "";
    for(let i = 0; i < pokemon.game_indices.length; i++) {
        let game = pokemon.game_indices[i].version.name;
        gamesDiv.innerHTML += `<span id='game${i}'>${game}</span><br>`
    }

    // Update Moves
    let movesDiv = document.querySelector("#dexMoves");
    movesDiv.innerHTML = "";
    for(let i = 0; i < pokemon.moves.length; i++) {
        let move = pokemon.moves[i].move.name;
        move = move.replace('-', ' ');
        movesDiv.innerHTML += `<span id='move${i}'>${move}</span><br>`
    }
}

/**
 * Saves a new expiration date into local storage.
 * The new expiration date is exactly a month from when this function is called.
 */
function updateExpDate() {
    let newDate = new Date()
    newDate = new Date(newDate.setMonth(newDate.getMonth() + 1));
    localStorage.setItem("pokemonListExpirationDate", newDate.toString());
} // updateExpDate

/**
 * Updates the placeholder text of queryName
 *  to the pokemon with the currently entered id.
 * Displays an error message if an invalid id is entered.
 * @returns 
 */
function updateNameQuery() {
    // Get id, reset queryName
    let id = document.querySelector("#queryNumber").value - 1;
    let queryName = document.querySelector("#queryName");
    queryName.value = "";

    // Check if id is valid
    if (!Number.isSafeInteger(id) || id < 0 ) {
        queryName.placeholder = "Invalid ID.";
        return;
    } else if (pokemonList.count <= id) {
        queryName.placeholder = "Pokémon not found."
        return;
    }

    // Update queryName with name of pokemon
    let name = parsePokemonName(pokemonList.results[id].name);
    queryName.placeholder = `${name}`;
} // updateNameQuery

/**
 * Updates queryNumber based on the pokemon name entered.
 * Displays an error message if the pokemon name is invalid.
 * @returns 
 */
function updateNumberQuery() {
    // Get name, reset queryNumber
    let name = document.querySelector("#queryName").value.toLowerCase();
    let queryNumber = document.querySelector("#queryNumber");
    queryNumber.value = "";

    // Find Pokemon
    for(let i = 0; i < pokemonList.count; i++) {
        if (name == pokemonList.results[i].name) {
            queryNumber.placeholder = i + 1;
            return;
        }
    }

    // Display error message
    queryNumber.placeholder = "Pokemon not found.";
} // updateNumberQuery

/**
 * Gets a new pokemon list from PokeAPI.
 * Calls updateExpDate after retrieving the new list.
 */
async function updatePokemonList() {
    // Get Pokemon list from API
    console.log("Getting pokemon list from PokeAPI...")
    let url = `${apiURL}?limit=100000`
    let response = await fetch(url);
    let data = await response.json();
    pokemonList = data;

    // Save Pokemon list in local storage
    console.log("Saving pokemon list to local storage...");
    localStorage.setItem("pokemonList", JSON.stringify(data));

    // Save new expiration date
    updateExpDate();
} // updatePokemonList