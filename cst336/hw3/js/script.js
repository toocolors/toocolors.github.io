// Global Variables
const apiURL = "https://pokeapi.co/api/v2/pokemon";
let pokemonList = []


// Event Listeners

// Call Functions
updatePokemonList()

// FUNCTIONS

async function updatePokemonList() {
    // Check for Pokemon List in local storage
    let data = localStorage.getItem("pokemonList");
    let json;
    if (data != null) {
        try {
            json = await JSON.parse(data);
            pokemonList = json;
            return;
        } catch (err) {
            console.error("Failed to parse pokemon list JSON", err);
        }
    }

    // Get Pokemon list from API
    let url = `${apiURL}?limit=100000`
    data = await fetch(url);
    json = await data.json();
    pokemonList = json;

    // Save Pokemon list in local storage
    localStorage.setItem("pokemonList", JSON.stringify(json));
}