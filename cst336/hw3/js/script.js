// Global Variables
const apiURL = "https://pokeapi.co/api/v2/pokemon";
let pokemonList = []


// Event Listeners

// Call Functions
checkExpDate();

// FUNCTIONS

function checkExpDate() {
    // Get expiration date
    console.log("Getting expiration date from local storage...");
    let isDateValid = true;
    let expDate = Date.parse(localStorage.getItem("pokemonListExpirationDate"));
    let currentDate = new Date();
    
    // Check for expiration date in local storage, compare it to current date
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
        return;
    } else {
        console.log("Expiration date is valid!");
        getPokemonList();
    }
}

async function getPokemonList() {
    // Check for Pokemon List in local storage
    console.log("Getting pokemon list from local storage...")
    let data = localStorage.getItem("pokemonList");
    let json;
    if (data == null) {
        updatePokemonList();
        return;
    }

    // Parse pokemon list from local storage text
    try {
        json = await JSON.parse(data);
        pokemonList = json;
        console.log("Got pokemon list from local storage!")
    } catch (err) {
        console.error("Failed to parse pokemon list JSON", err);
        updatePokemonList();
    }
}

function updateExpDate() {
    let newDate = new Date()
    newDate = new Date(newDate.setMonth(newDate.getMonth() + 1));
    localStorage.setItem("pokemonListExpirationDate", newDate.toString());
}

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
}