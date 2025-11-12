// Global Variables
const apiURL = "https://pokeapi.co/api/v2/pokemon";
let pokemonList = [];

// Event Listeners
document.querySelector("#queryButton").addEventListener("click", getPokemon);
document.querySelector("#queryNumber").addEventListener("input", updateNameQuery);
document.querySelector("#queryName").addEventListener("input", updateNumberQuery);
document.querySelector("#queryNumber").addEventListener("keypress", function(event) {
    if(event.key === "Enter") {
        getPokemon();
    }
});
document.querySelector("#queryName").addEventListener("keypress", function(event) {
    if(event.key === "Enter") {
        getPokemon();
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

function getPokemon() {
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

    document.querySelector("#dexName").innerHTML = `${pokemonList.results[id].name}`;
    document.querySelector("#dexNumber").innerHTML = id + 1;
}

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

function parsePokemonName(id) {
    let name = pokemonList.results[id].name;
    name = name.charAt(0).toUpperCase() + name.substring(1, name.length);
    return name;
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
    let name = parsePokemonName(id);
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