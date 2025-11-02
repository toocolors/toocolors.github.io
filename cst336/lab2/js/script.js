// Global variables
let randomNumber;
let attempts = 0;

/**
 * Initializes the game.
 */
function initializeGame() {
    // Get random number
    randomNumber = Math.floor(Math.random() * 99) + 1;
    console.log(`randomNumber: ${randomNumber}`);

    // Hide reset button
    document.querySelector("#resetBtn").computedStyleMap.display = "none";

    // Set focus to textbox
    document.querySelector("#playerGuess").focus();
}