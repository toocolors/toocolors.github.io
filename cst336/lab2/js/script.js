// Global variables
let randomNumber;
let attempts = 0;

// Event Listeners
document.querySelector("#guessBtn").addEventListener("click", checkGuess);
document.querySelector("#resetBtn").addEventListener("click", initializeGame);

// Start game
initializeGame();

/**
 * Checks if player guess is valid and compares it against randomNumber.
 * Edits feedback div according to guess validity and correctness.
 * Calls gameOver if guess is correct.
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

    // Add guess to guesses element
    document.querySelector("#guesses").textContent += `${guess} `;
    
    // Increment attempts
    attempts++;
    console.log(`Attempts: ${attempts}`);

    // Check if guess == randomNumber (player won)
    if (guess == randomNumber) {
        feedback.textContent = "You guessed it! You won!";
        feedback.style.color = "darkgreen";
        gameOver();
        return;
    }

    // Check if attempts == 7 (player lost)
    if (attempts >= 7) {
        feedback.textContent = "Sorry, you lost!";
        feedback.style.color = "red";
        gameOver();
        return;
    }

    // Check if guess was higher or lower then randomNumber (player guessed wrong, but hasn't lost)
    feedback.style.color = "orange";
    if (guess > randomNumber) {
        feedback.textContent = "Guess was too high!";
    } else {
        feedback.textContent = "Guess was too low!"
    }
}

/**
 * Hides guessBtn, Shows resetBtn
 */
function gameOver() {
    // Hide guessBtn
    let guessBtn = document.querySelector("#guessBtn");
    guessBtn.style.display = "none";

    // Show resetBtn
    let resetBtn = document.querySelector("#resetBtn");
    resetBtn.style.display = "inline";
}

/**
 * Initializes the game.
 */
function initializeGame() {
    // Get random number
    randomNumber = Math.floor(Math.random() * 99) + 1;
    console.log(`randomNumber: ${randomNumber}`);

    // Hide reset button
    document.querySelector("#resetBtn").style.display = "none";

    // Show guess button
    document.querySelector("#guessBtn").style.display = "inline";

    // Set focus to textbox and clear it
    playerGuess = document.querySelector("#playerGuess");
    playerGuess.focus();
    playerGuess.value = "";

    // Clear feedback
    document.querySelector("#feedback").textContent = "";

    // Clear previous guesses
    document.querySelector("#guesses").textContent = "";
}