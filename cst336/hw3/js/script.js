// Global Variables
const apiURL = "https://pokeapi.co/api/v2/pokemon";
let pokemon;
let pokemonList = [];
const statNames = ['HP', 'Attack', 'Defense', 'S. Attack', 'S. Defense', 'Speed'];
const wikiURL = "https://bulbapedia.bulbagarden.net/wiki/";

// Contains a list of moves with irregular names.
// Each element in the array is an array containing:
//  0 = String to compare to API data.
//  1 = String to be used for move name.
const irregularMoves = [
    ["double-edge", "Double-Edge"],
    ["self-destruct", "Self-Destruct"],
    ["soft-boiled", "Soft-Boiled",],
    ["mud-slap", "Mud-Slap"],
    ["lock-on", "Lock-On"],
    ["will-o-wisp", "Will-O-Wisp"],
    ["wake-up-slap", "Wake-Up Slap"],
    ["u-turn", "U-turn"],
    ["x-scissor", "X-Scissor"],
    ["v-create", "V-create"],
    ["trick-or-treat", "Trick-or-Treat"],
    ["freeze-dry", "Freeze-Dry"],
    ["topsy-turvy", "Topsy-Turvy"],
    ["baby-doll-eyes", "Baby-Doll Eyes"],
    ["power-up punch", "Power-Up Punch"],
    ["all-out pummeling", "All-Out Pummeling"],
    ["savage spin-out", "Savage Spin-Out"],
    ["never-ending nightmare", "Never-Ending Nightmare"],
    ["multi-attack", "Multi-Attack"]
]

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

// Clear Inputs
document.querySelector("#queryName").value = '';
document.querySelector("#queryName").placeholder = '';
document.querySelector("#queryNumber").value = '';
document.querySelector("#queryNumber").placeholder = '';

// FUNCTIONS

/**
 * Takes a string, capitalizes the first letter, 
 *  and returns the captalized string.
 * @param {String} str The string to be capitazlied
 * @returns The capitalized string
 */
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.substring(1, str.length);
}

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
    let mon;
    if(data != null) {
        try {
            mon = JSON.parse(data);
            console.log(`Found ${pokemonList.results[id].name} in session storage!`);
            return mon;
        } catch (err) {
            console.error("Could not parse session storage data.", err);
        }
    }

    // Get pokemon from PokeAPI
    console.log(`Getting ${pokemonList.results[id].name} from PokeAPI...`);
    let response = await fetch(pokemonList.results[id].url);
    mon = await response.json();
    console.log(`Got ${pokemonList.results[id].name} from PokeAPI!`);

    // Save pokemon to session storage
    sessionStorage.setItem(`pokemon-${id}`, JSON.stringify(mon));

    // Return pokemon
    return mon;
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

/**
 * Contructs an a element using the link text text parameters.
 * @param {String} link The url to assign to the a element.
 * @param {String} text The text to be displayed in the a element.
 * @returns The constructed a element.
 */
function linkify(link, text) {
    return `<a href='${link}' target='_blank'>${text}</a>`;
} // linkify

function linkifyGame(gName) {
    // Get second half of url
    let link;
    switch (gName) {
        case "red":
        case "blue":
            link = "Red_and_Green_Versions";
            break;
        case "yellow":
            link = "Yellow_Version";
            break;
        case "gold":
        case "silver":
            link = "Gold_and_Silver_Versions";
            break;
        case "crystal":
            link = "Crystal_Version";
            break;
        case "ruby":
        case "sapphire":
            link = "Ruby_and_Sapphire_Versions";
            break;
        case "firered":
        case "leafgreen":
            link = "FireRed_and_LeafGreen_Versions";
            break;
        case "emerald":
            link = "Emerald_Version";
            break;
        case "diamond":
        case "pearl":
            link = "Diamond_and_Pearl_Versions";
            break;
        case "platinum":
            link = "Platinum_Version";
            break;
        case "heartgold":
        case "soulsilver":
            link = "HeartGold_and_SoulSilver_Versions";
            break;
        case "black":
        case "white":
            link = "Black_and_White_Versions";
            break;
        case "black-2":
        case "white-2":
            link = "Black_and_White_Versions_2";
            break;
        default:
            link = "Generation";
            break;
    }

    // Build and Return link
    return linkify(wikiURL + "Pokémon_" + link, parseName(gName));
} // linkifyGame

function linkifyMove(mName) {
    // Format link (Turn spaces into '_')
    let linkName = mName;
    while (linkName.includes(' ')) {
        let i = linkName.indexOf(' ');
        linkName = linkName.substring(0, i) + '_' + linkName.substring(i + 1, linkName.length);
    }

    // Build HTML text
    let link = linkify(wikiURL + linkName + '_(move)', mName);
    return link;
} // linkifyMove

/**
 * Takes a pokemon name and builds an a element
 *  that displays its name and links to the pokemon's wiki page.
 * @param {String} pName The name of a pokemon.
 * @returns The a element for the pokemon.
 */
function linkifyPokemon(pName) {
    // Get first part of pokemon name
    let linkName = pName;
    if (pName.includes(' ')) {
        let i = pName.indexOf(' ');
        linkName = pName.substring(0, i);
    }

    // Build HTML text
    let link = linkify(wikiURL + linkName + '_(Pokémon)', pName);
    return link;
} // linkifyPokemon

/**
 * Takes a move name and returns a more readable version.
 * @param {String} move The name of the move to be parsed.
 * @returns The parsed move
 */
function parseMoveName(move) {
    // Look for move in irregular moves
    for(let i = 0; i < irregularMoves.length; i++) {
        if(irregularMoves[i][0] == move) {
            return irregularMoves[i][1];
        }
    }

    // Process move normally
    return parseName(move);
} // parseMoveName

function parseName(name) {
    // Capitalize mame
    name = capitalize(name);

    while(name.includes('-')) {
        let i = name.indexOf('-');
        name = name.substring(0, i) + ' ' + capitalize(name.substring(i + 1, name.length));
    }

    // Return name
    return name;
} // parseName

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

    // Show Dex
    document.querySelector("#dexBackground").style.display = "block";
    document.querySelector("#dex").style.display = "block";

    // Get Pokemon
    pokemon = await getPokemon(id);

    // Update Sprite
    document.querySelector("#dexSprite").innerHTML = `<img 
    src=${pokemon.sprites.front_default} alt=${pokemon.name}
    height='192px' width='192px'>`;

    // Update Cry
    document.querySelector("#dexCry").innerHTML = `<audio controls><source 
    src='${pokemon.cries.latest}'></audio>`;

    // Update Pokemon Name
    document.querySelector("#dexName").innerHTML = `${linkifyPokemon(parseName(pokemonList.results[id].name))}`;
    
    // Update Pokemon ID
    document.querySelector("#dexNumber").innerHTML = `No. ${id + 1}`;
    
    // Update Pokemon Types
    let firstType = pokemon.types[0].type.name;
    document.querySelector("#dexType").innerHTML = `<span 
    class='${firstType} typeSpan'>${capitalize(firstType)}</span>`;
    if(pokemon.types.length == 2) {
        let secondType = pokemon.types[1].type.name;
        document.querySelector("#dexType").innerHTML += `<span 
        class='${secondType} typeSpan'>${capitalize(secondType)}</span>`;
    }

    // Update Dex Background
    document.querySelector("#dexBackground").style.backgroundImage = `url('img/${pokemon.types[0].type.name}.png')`;

    // Update Height
    document.querySelector("#dexHeight").innerHTML = `Height: ${pokemon.height * 3.937008}`;

    // Update Weight
    document.querySelector("#dexWeight").innerHTML = `Weight: ${pokemon.weight * 0.2204623}`;

    // Update Stats
    // 0 = HP, 1 = Attack, 2 = S. Attack, 3 = Defense, 4 = S. Defense, 5 = Speed
    let total = 0;
    for(let i = 0; i < pokemon.stats.length; i++) {
        // Update table text
        document.querySelector(`#dexStat${i}`).innerHTML = `${statNames[i]}: ${pokemon.stats[i].base_stat}`;
        // Update Stat Bar
        document.querySelector(`#stat${[i]}Bar`).style.width = `${pokemon.stats[i].base_stat}px`;
        // Update total
        total += pokemon.stats[i].base_stat;
    }
    // Update total text
    document.querySelector("#dexTotal").innerHTML = total;

    // Update Games
    // Get dexGames div
    let gamesDiv = document.querySelector("#dexGames");
    // Check if pokemon has games listed:
    if(pokemon.game_indices.length > 0) {
        // Show games div and header
        gamesDiv.style.display = "block";
        gamesDiv.innerHTML = "<h3>Games:</h3>";
    } else {
        // Hide games div
        gamesDiv.style.display = "none";
    }
    // Populate games list (Only if there are games)
    for(let i = 0; i < pokemon.game_indices.length; i++) {
        let game = pokemon.game_indices[i].version.name;
        gamesDiv.innerHTML += `<span id='game${i}'>${linkifyGame(game)}</span><br>`
    }

    // Update Moves
    // Get dexMoves div
    let movesDiv = document.querySelector("#dexMoves");
    let moves = [];
    // Check if pokemon has moves listed
    if(pokemon.game_indices.length > 0) {
        // Show moves div and header
        movesDiv.style.display = "block";
        movesDiv.innerHTML = "<h3>Moves:</h3>";
        // Get and sort moves
        for(let i = 0; i < pokemon.moves.length; i++) {
            moves.push(pokemon.moves[i].move.name);
        }
        moves = moves.sort();
    } else {
        // Hide moves div
        movesDiv.style.display = "none";
    }
    // Populate moves list (Only if there are moves)
    for(let i = 0; i < moves.length; i++) {
        let move = parseMoveName(moves[i]);
        // movesDiv.innerHTML += `<span id='move${i}'>${linkifyMove(move)}</span><br>`;
        movesDiv.innerHTML += `${linkifyMove(move)}<br>`;
    }
} // submitQuery

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
    let name = parseName(pokemonList.results[id].name);
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