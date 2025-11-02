// Global variables
let randomNumber;
let attempts = 0;

// Event Listeners
document.querySelector("#guessBtn").addEventListener("click", checkGuess);

/**
 * Checks if player guess is valid and compares it against randomNumber.
 * @returns 
 */
function checkGuess() {
    // Get guess
    let guess = document.querySelector("#playerGuess").value;
    guess = Number(guess);
    console.log(`Player guess: ${guess}`);

    // Check is guess is valid
    // Check if guess is an integer
    if (!Number.isInteger(guess)) {
        alert("Guess is not an integer!");
        return;
    }
    // Check if guess is within bounds
    if (guess < 1 || 99 < guess) {
        alert("Guess out of range!");
        return;
    }
    

}

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