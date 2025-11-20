// Global Constants
const backgroundUrl = 'https://pixabay.com/api/?key=5589438-47a0bca778bf23fc2e8c5bf3e&per_page=50&orientation=horizontal&q=flowers';

// Global Variables
let quote;

// Event Listeners
document.querySelector('#authorBtn').addEventListener('click', showBio);
document.querySelector('#quotesBtn').addEventListener('click', getMoreQuotes);
document.querySelector('#langBtn').addEventListener('click', translateQuote);

// Call Functions
getBackground();
displayQuote();
showLangs();
setRadioListeners();

// Functions
/**
 * Gets a random quote and displays its text and author.
 */
async function displayQuote() {
    // Get quote
    quote = await getRandomQuote();

    // Display quote
    document.querySelector("#quote").textContent = quote.quoteText;
    document.querySelector("#author").textContent = `-${quote.firstName} ${quote.lastName}`;
} // displayQuote

/**
 * Fetches and returns one or more quotes form the quote API.
 * @param {String} url The url for the API request.
 * @returns One or more quotes from the quote API.
 */
async function fetchQuote(url) {
    // Get Quote
    let response = await fetch(url);
    let data = await response.json();

    // Return Quote
    console.log(data);
    return data;
} // fetchQuote

/**
 * Fetches a list of 50 different backgrounds from an API,
 *  and chooses a random one to display as the background image.
 */
async function getBackground() {
    // Get Background
    let response = await fetch(backgroundUrl);
    let json = await response.json();

    // Get random number from 0-49
    let rand = Math.floor(Math.random() * 50);

    // Get image url
    let url = json.hits[rand].largeImageURL;

    // Apply Background
    document.querySelector('body').style.backgroundImage = `url(${url})`;
} // getBackground

/**
 * Gets and displays the text and authors of 1-5 quotes.
 * @returns
 */
async function getMoreQuotes() {
    // Get number from input
    let amount = Number.parseInt(document.querySelector('#quoteNum').value);

    // Check if number is valid (1-5)
    if(!Number.isSafeInteger(amount) || amount < 1 || amount > 5) {
        document.querySelector("#error").innerHTML = 'Number must be integer between 1 and 5';
        return;
    }

    // Get and reset quotesDiv
    let quotesDiv = document.querySelector('#quotesDiv');
    quotesDiv.innerHTML = '';

    // Get Quotes
    let quotes = await getMultipleQuotes(amount);

    // Display Quotes
    for (let i = 0; i < quotes.length; i++) {
        // Display Quote
        quotesDiv.innerHTML += `${quotes[i].quoteText} <br> 
        -${quotes[i].firstName} ${quotes[i].lastName} <br><br>`
    }
} // getMoreQuotes

/**
 * Gets and returns 1-5 quotes.
 * @param {Integer} num The number of quotes to get.
 * @returns 1-5 quotes
 */
async function getMultipleQuotes(num) {
    // Get URL
    let multUrl = `https://csumb.space/api/famousQuotes/getQuotes.php?n=${num}`;

    // Get Quote
    return await fetchQuote(multUrl);
} // getMultipleQuotes

/**
 * Gets and returns a random quote.
 * @returns A random quote
 */
async function getRandomQuote() {
    // Get Url
    let randUrl = 'https://csumb.space/api/famousQuotes/getRandomQuote.php';

    // Get Quote
    return await fetchQuote(randUrl);
} // getRandomQuote

/**
 * Gets the translation of the displayed quote in the chosen language.
 * @param {Integer} id The id of the quote to translate.
 * @param {String} lang The language code of the language to translate to.
 * @returns The quote translation
 */
async function getTranslatedQuote(id, lang) {
    // Get URL
    let translateUrl = `https://csumb.space/api/famousQuotes/translateQuote.php?lang=${lang}&quoteId=${id}`;

    // Get Quote
    return await fetchQuote(translateUrl);
} // getTranslatedQuote

/**
 * Sets event listeners for each input element in the 'languages' radio group.
 */
function setRadioListeners() {
    // EN
    document.querySelector('#EN').addEventListener('click', updateFlag);

    // ES
    document.querySelector('#ES').addEventListener('click', updateFlag);

    // FR
    document.querySelector('#FR').addEventListener('click', updateFlag);

    // SP
    document.querySelector('#SP').addEventListener('click', updateFlag);
} // setRadioListeners

/**
 * Displays the quote author's image and bio.
 */
function showBio() {
    // Update Author Info
    document.querySelector("#authorImg").src = quote.picture;
    document.querySelector("#authorImg").alt = `${quote.firstName} ${quote.lastName}`;
    document.querySelector("#authorBio").textContent = quote.bio;

    // Show Author
    document.querySelector("#authorInfo").style.display = 'flex';
} // showBio

/**
 * Displays a radio input group of different languages.
 */
function showLangs() {
    // Get Languages
    let langs = [
        ['English', 'EN'], 
        ['Esperanto', 'ES'], 
        ['French', 'FR'], 
        ['Spanish', 'SP']
    ];

    // Get langsDiv
    let langsDiv = document.querySelector('#langsDiv');
    langsDiv.innerHTML = '';

    // Display languages
    while(langs.length > 0) {
        // Get Random Number
        let rand = Math.floor(Math.random() * langs.length);

        // Get Language
        let lang = langs[rand];

        // Remove language from langs
        langs.splice(rand, 1);

        // Display Radio
        langsDiv.innerHTML += `<input type='radio' name='language' 
        id='${lang[1]}' value='${lang[1]}'>
        <label for='${lang[1]}'>${lang[0]}</label>`;
    }
} // showLangs

/**
 * Updates the flag image to represent the currently selected language.
 */
function updateFlag() {
    // Get language
    let lang = document.querySelector('input[name="language"]:checked').value;
    let file = '';
    switch(lang) {
        case 'EN':
            file = 'english_flag';
            break;
        case 'ES':
            file = 'esperanto_flag';
            break;
        case 'FR':
            file = 'french_flag';
            break;
        case 'SP':
            file = 'spanish_flag'
            break;
    }

    // Update Flag Image
    document.querySelector('#flag').src = `img/${file}.png`;
    document.querySelector('#flag').alt = file;
} // updateFlag

/**
 * Gets the translation of the displayed quote in the chosen language
 *  and displays the translation.
 */
async function translateQuote() {
    // Get language
    let lang = document.querySelector('input[name="language"]:checked').value;

    // Get quote
    let translation = await getTranslatedQuote(quote.quoteId, lang);

    // Display quote
    document.querySelector("#quote").textContent = translation.translation;
} // translateQuote