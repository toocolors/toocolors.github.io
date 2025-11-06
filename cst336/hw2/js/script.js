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
// Q8
q8CorrectChoices = ["Guam", "Puerto Rico", "Virgin Isles", "Baker Island", "Kingman Reed"];
q8WrongChoices = ["Guadalajara", "Great Barrier Reef", "Antigua", "Barbuda", "Redonda"];
// Q9
q9CorrectStates = ["dc", "wdc", "washington dc"];
q9CorrectCountries = ["us", "usa", "united states", "the united states", 
    "united states of america", "the united states of america"];

// Add event listeners
document.querySelector("button").addEventListener("click", gradeQuiz);
document.querySelector("#latitude").addEventListener("input", updateRanges);
document.querySelector("#longitude").addEventListener("input", updateRanges);


// Call functions
displayChoices(q4Choices, "radio", 4); // Q4
mixChoicesCheckBox(q5CorrectChoices, q5WrongChoices, 5); // Q5
mixChoicesRadio("Reno", q6WrongChoices, 6) // Q6
mixChoicesCheckBox(q8CorrectChoices, q8WrongChoices, 8); // Q8
updateRanges();

/**
 * Displays elements of array as choices for the appropriate question.
 * @param {*} array The array of answers to be displayed.
 * @param {*} type The type of input used (checkbox, radio)
 * @param {int} index The index of the question.
 */
function displayChoices(array, type, index) {
    array = _.shuffle(array);
    for (let i = 0; i < array.length; i++) {
        document.querySelector(`#q${index}Choices`).innerHTML += `<input type='${type}' 
        name='q${index}' id='${array[i]}' value='${array[i]}' class='q${index}'>
        <label for='${array[i]}'>${array[i]}</label>`;
    }
} //displayChoices

/**
 * Grades the check boxes for the question at index.
 * @param {int} index The question to be graded.
 * @param {array} corrects The array of correct choices for the question.
 * @returns True = correct, False = incorrect
 */
function gradeCheckbox(index, corrects) {
    let answers = [];
    answers = answers.concat(Array.from(document.getElementsByClassName(`q${index}`)));
    for (let i = 0; i < answers.length; i++) {
        let checkbox = answers[i];
        let inCorrects = corrects.includes(checkbox.value);
        if (inCorrects && !checkbox.checked || !inCorrects && checkbox.checked) {
            return false;
        }
    }
    return true;
} //gradeCheckbox

/**
 * Grades each question and displays the total score.
 * Returns early if one or more questions is missing an answer.
 */
function gradeQuiz() {
    console.log("Grading quiz...");
    document.querySelector("#validation").innerHTML = "";

    // Check if questions are missing
    if (!isFormValid()) {
        return;
    }

    // variables
    score = 0;
    let q1Response = document.querySelector("#q1").value.toLowerCase();
    let q2Response = document.querySelector("#q2").value;
    let q4Response = document.querySelector("input[name=q4]:checked");
    let q6Response = document.querySelector("input[name=q6]:checked");
    //Q9
    let q9Address = document.querySelector("#address").value.toLowerCase();
    q9Address = q9Address.replace(/[.,]/g, '');
    let q9State = document.querySelector("#state").value.toLowerCase();
    q9State = q9State.replace(/[.,]/g, '');
    let q9Zip = document.querySelector("#zip").value.toLowerCase();
    let q9Country = document.querySelector("#country").value.toLowerCase();
    q9Country = q9Country.replace(/[.,]/g, '');

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
    if (q4Response != null  && q4Response.value == "Rhode Island") {
        rightAnswer(4);
    } else {
        wrongAnswer(4);
    }

    // Grading Question 5
    if (gradeCheckbox(5, q5CorrectChoices)) {
        rightAnswer(5);
    } else {
        wrongAnswer(5);
    }

    // Grading Question 6
    if (q6Response != null  && q6Response.value == "Reno") {
        rightAnswer(6);
    } else {
        wrongAnswer(6);
    }

    // Grading Question 7
    if (document.querySelector("#territories").value == 14) {
        rightAnswer(7);
    } else {
        wrongAnswer(7);
    }

    // Grading Question 8
    if (gradeCheckbox(5, q8CorrectChoices)) {
        rightAnswer(8);
    } else {
        wrongAnswer(8);
    }

    // Grading Question 9
    if(q9Address == "1600 pennsylvania avenue nw" &&
        q9CorrectStates.includes(q9State) &&
        q9Zip == "20500" &&
        q9CorrectCountries.includes(q9Country)) {
            rightAnswer(9);
    } else {
        wrongAnswer(9);
    }

    // Grading Question 10
    if(document.querySelector("#latitude").value == 80 &&
        document.querySelector("#longitude").value == 94) {
            rightAnswer(10);
    } else {
        wrongAnswer(10);
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
    if (score >= 100) {
        feedback.innerHTML = "Amazing! You got a perfect score!"
        feedback.className = "text-success";
    } else if (score >= 90) {
        feedback.innerHTML = "Wow! You got an A!"
        feedback.className = "text-success";
    }
    else if (score >= 80) {
        feedback.innerHTML = "Nice work! You got a B."
        feedback.className = "text-success";
    } else if (score >= 70) {
        feedback.innerHTML = "You passed with a C."
        feedback.className = "text-warning";
    } else if (score >= 60) {
        feedback.innerHTML = "You got a D. Better study next time."
        feedback.className = "text-danger";
    } else {
        feedback.innerHTML = "You got an F..."
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
    score += 10;
} //rightAnswer

/**
 * Checks all questions to see if they have been answered.
 * @returns true = All questions are answers, false = answers are missing
 */
function isFormValid() {
    let unanswered = [];

    // Check Question 1
    if (document.querySelector("#q1").value == "") {
        unanswered.push(1);
    }

    // Check Question 2
    if (document.querySelector("#q2").value == "") {
        unanswered.push(2);
    }

    // Check Question 3
    if (!document.querySelector("#Jackson").checked &&
    !document.querySelector("#Franklin").checked &&
    !document.querySelector("#Jefferson").checked &&
    !document.querySelector("#Roosevelt").checked) {
        unanswered.push(3);
    }

    // Check Question 4
    if (document.querySelector("input[name=q4]:checked") == null) {
        unanswered.push(4);
    }

    // Check Question 6
    if (document.querySelector("input[name=q6]:checked") == null) {
        unanswered.push(6);
    }

    // Check Question 7
    if (document.querySelector("#territories").value = "") {
        unanswered.push(7);
    }

    // Check Question 9
    if(document.querySelector("#address").value == "" ||
    document.querySelector("#state").value == "" ||
    document.querySelector("#zip").value == "" ||
    document.querySelector("#country").value == "") {
        unanswered.push(9);
    }

    // Check if there are unanswered questions
    if (unanswered.length == 0) {
        return true;
    }

    // Print error message to user.
    // Set beginning of message.
    let validation = document.querySelector("#validation")
    if (unanswered.length == 1) {
        validation.innerHTML = "Question ";
    } else {
        validation.innerHTML = "Questions ";
    }
    
    // Add question numbers to message
    for(let i = 0; i < unanswered.length; i++) {
        if (i != unanswered.length - 1) {
            validation.innerHTML += `${unanswered[i]}, `;
        } else {
            validation.innerHTML += unanswered[i];
        }
    }

    // Add the rest of the message
    if(unanswered.length == 1) {
        validation.innerHTML += " is ";
    } else {
        validation.innerHTML += " are ";
    }
    validation.innerHTML += "unanswered.";

    // Finally return false
    return false;

} //isFormValid

/**
 * Creates an array of answers by pulling values from two arrays,
 *  then calls displayChoices.
 * @param {array} correctChoices Possible correct answers to the question.
 * @param {array} wrongChoices Possible incorrect answers to the question.
 */
function mixChoicesCheckBox(correctChoices, wrongChoices, index) {
    // Clone arrays
    let rights = [...correctChoices];
    let wrongs = [...wrongChoices];
    // Create array
    let array = [];
    for (let i = 0; i < 4; i++) {
        if (Math.random() >= 0.5) { // Add element from rights
            let arrIndex = Math.floor(Math.random() * rights.length)
            array.push(rights[arrIndex]);
            rights.splice(arrIndex, 1);
        } else { // Add element from wrongs
            let arrIndex = Math.floor(Math.random() * wrongs.length)
            array.push(wrongs[arrIndex]);
            wrongs.splice(arrIndex, 1);
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
    // Clone arrays
    let wrongs = [...wrongChoices];
    // Create array
    let array = [];
    let answerAdded = false;
    for(let i = 0; i < 4; i++) {
        if (!answerAdded && (i == 3 || Math.random() <= 0.5)) {
            array.push(answer);
            answerAdded = true;
        } else {
            let arrIndex = Math.floor(Math.random() * wrongs.length);
            array.push(wrongs[arrIndex]);
            wrongs.splice(arrIndex, 1);
        }
    }

    // Display array
        displayChoices(array, "radio", index);
} //mixChoicesRadio

/**
 * Update the text displayed next to the ranges for Question 10.
 * Called when either range is moved.
 */
function updateRanges() {
    // Update latitude
    let latitude = document.querySelector("#latitude").value;
    if (latitude >= 100) {
        document.querySelector("#latitudeLabel").textContent = `Latitude: 37.00`;
    } else {
        document.querySelector("#latitudeLabel").textContent = `Latitude: 36.${latitude}`;
    }

    // Update longitude
    let longitude = document.querySelector("#longitude").value;
    if (longitude >= 100) {
        document.querySelector("#longitudeLabel").textContent = `Longitude: -122.00`;
    } else {
        document.querySelector("#longitudeLabel").textContent = `Longitude: -121.${longitude}`;
    }
    
}

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