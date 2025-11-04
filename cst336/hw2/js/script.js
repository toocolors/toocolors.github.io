// Global variables
let score = 0;
let attempts = localStorage.getItem("total_attempts");

// Add event listeners
document.querySelector("button").addEventListener("click", gradeQuiz);

// Call functions
displayQ4Choices();

function displayQ4Choices() {
    let q4ChoicesArray = ["Maine", "Rhode Island", "Maryland", "Delaware"];
    q4ChoicesArray = _.shuffle(q4ChoicesArray);
    for (let i = 0; i < q4ChoicesArray.length; i++) {
        document.querySelector("#q4Choices").innerHTML += `<input type='radio' name='q4'
        id='${q4ChoicesArray[i]}' value='${q4ChoicesArray[i]}'>
        <label for='${q4ChoicesArray[i]}'>${q4ChoicesArray[i]}</label>`;
    }
} //displayQ4Choices

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

function wrongAnswer(index) {
    document.querySelector(`#q${index}Feedback`).innerHTML = "Incorrect!";
    document.querySelector(`#q${index}Feedback`).className = "bg-warning text-white";
    document.querySelector(`#markImg${index}`).innerHTML = "<img src='img/xmark.png' alt=Checkmark'>"
} //wrongAnswer