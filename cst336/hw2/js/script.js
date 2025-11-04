// Global variables
let score = 0;
let attempts = localStorage.getItem("total_attempts");

// Choices Arrays
// Q4
q4Choices = ["Maine", "Rhode Island", "Maryland", "Delaware"];
// Q5
q5CorrectChoices = ["California", "Arizona", "New Mexico", "Texas"];
q5WrongChoices = ["Louisiana", "Mississipi", "Alabama", "Georgia", "Florida"];
// Q6
q6WrongChoices = ["Log Angeles", "San Diego", "Las Vegas", "Spokane", "Boise", "New York"];

// Add event listeners
document.querySelector("button").addEventListener("click", gradeQuiz);

// Call functions
displayChoices(q4Choices, "radio", 4); // Q4
mixChoicesCheckBox(q5CorrectChoices, q5WrongChoices, 5); // Q5
mixChoicesRadio("Reno", q6WrongChoices, 6) // Q6

/**
 * Displays elements of array as choices for the appropriate question.
 * @param {*} array The array of answers to be displayed.
 * @param {*} type The type of input used (checkbox, radio)
 * @param {int} index The index of the question.
 */
function displayChoices(array, type, index) {
    array = _.shuffle(array);
    for (let i = 0; i < array.length; i++) {
        document.querySelector(`#q${index}Choices`).innerHTML += `<input type='${type}' name='q4'
        id='${array[i]}' value='${array[i]}'>
        <label for='${array[i]}'>${array[i]}</label>`;
    }
} //displayChoices

function gradeQuiz() {
    console.log("Grading quiz...");
    document.querySelector("#validation").innerHTML = "";
    if (!isFormValid()) {
        return;
    }

    // variables
    score = 0;
    let q1Response = document.querySelector("#q1").value.toLowerCase();
    let q2Response = document.querySelector("#q2").value;
    let q4Response = document.querySelector("input[name=q4]:checked").value;

    // Grading Question 1
    if (q1Response == "sacramento") {
        rightAnswer(1);
    } else {
        wrongAnswer(1)
    }

    // Grading Question 2
    if(q2Response == "mo") {
        rightAnswer(2);
    } else {
        wrongAnswer(2);
    }

    // Grading Question 3
    if (document.querySelector("#Jefferson").checked && 
        document.querySelector("#Roosevelt").checked &&
        !document.querySelector("#Jackson").checked &&
        !document.querySelector("#Franklin").checked) {
            rightAnswer(3);
    } else {
        wrongAnswer(3);
    }

    // Grading Question 4
    if (q4Response == "Rhode Island") {
        rightAnswer(4);
    } else {
        wrongAnswer(4);
    }

    // Update total score
    let totalScore = document.querySelector("#totalScore");
    totalScore.innerHTML = `Total Score: ${score}`;
    if (score >= 80) {
        totalScore.className = "text-success";
    } else {
        totalScore.className = "text-danger";
    }

    // Update quiz feedback
    let feedback = document.querySelector("#quizFeedback");
    if (score >= 80) {
        feedback.innerHTML = "Congrats! You passed!"
        feedback.className = "text-success";
    } else {
        feedback.innerHTML = "You failed..."
        feedback.className = "text-danger";
    }

    // Show total number of attempts
    document.querySelector("#totalAttempts").innerHTML = `Total Attempts: ${++attempts}`;
    localStorage.setItem("total_attempts", attempts);
} //gradeQuiz

function rightAnswer(index) {
    document.querySelector(`#q${index}Feedback`).innerHTML = "Correct!";
    document.querySelector(`#q${index}Feedback`).className = "bg-success text-white";
    document.querySelector(`#markImg${index}`).innerHTML = "<img src='img/checkmark.png' alt=Checkmark'>"
    score += 20;
} //rightAnswer

function isFormValid() {
    let isValid = true;
    if(document.querySelector("#q1").value == "") {
        isValid = false;
        document.querySelector("#validation").innerHTML = "Question 1 was not answered";
    }
    return isValid;
} //isFormValid

/**
 * Creates an array of answers by pulling values from two arrays,
 *  then calls displayChoices.
 * @param {array} correctChoices Possible correct answers to the question.
 * @param {array} wrongChoices Possible incorrect answers to the question.
 */
function mixChoicesCheckBox(correctChoices, wrongChoices, index) {
    // Create array
    let array = [];
    for (let i = 0; i < 4; i++) {
        if (Math.random() >= 0.5) { // Add element from correctChoices
            array.push(correctChoices[Math.floor(Math.random() * correctChoices.length)]);
        } else { // Add element from wrongChoices
            array.push(wrongChoices[Math.floor(Math.random() * wrongChoices.length)]);
        }
    }

    // Call displayChoices
    displayChoices(array, "checkbox", index);
} //mixChoicesCheckbox

/**
 * Creates an array of answers by pulling values from an array and the correct answer,
 *  then calls displayChoices.
 * @param {string} answer The correct answer to the question
 * @param {array} wrongChoices Possible incorrect answers to the question.
 */
function mixChoicesRadio(answer, wrongChoices, index) {
    // Create array
    let array = [];
    let answerAdded = false;
    for(let i = 0; i < 4; i++) {
        if (!answerAdded && (i == 3 || Math.random() <= 0.5)) {
            array.push(answer);
            answerAdded = true;
        } else {
            let arrIndex = Math.floor(Math.random() * wrongChoices.length);
            array.push(wrongChoices[arrIndex]);
            wrongChoices.splice(arrIndex, 1);
        }
    }

    // Display array
        displayChoices(array, "radio", index);
} //mixChoicesRadio

/**
 * Updates feedback and markImg of question at index.
 * Called when question is answered wrong.
 * @param {int} index The index of the question.
 */
function wrongAnswer(index) {
    document.querySelector(`#q${index}Feedback`).innerHTML = "Incorrect!";
    document.querySelector(`#q${index}Feedback`).className = "bg-warning text-white";
    document.querySelector(`#markImg${index}`).innerHTML = "<img src='img/xmark.png' alt=Checkmark'>"
} //wrongAnswer