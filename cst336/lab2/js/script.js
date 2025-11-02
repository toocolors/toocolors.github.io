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
    // Get and reset feedback
    let feedback = document.querySelector("#feedback");
    feedback.textContent = "";

    // Get guess
    let guess = document.querySelector("#playerGuess").value;
    guess = Number(guess);
    console.log(`Player guess: ${guess}`);

    // Check if guess is valid (an integer between 1 and 99)
    if (!Number.isInteger(guess) || guess < 1 || 99 < guess) {
        // Update feedback
        feedback.textContent = "Enter an integer between 1 and 99";
        feedback.style.color = "red";
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