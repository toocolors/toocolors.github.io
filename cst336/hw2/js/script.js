// Add event listeners
document.querySelector("button").addEventListener("click", gradeQuiz);

function gradeQuiz() {
    console.log("Grading quiz...");
    document.querySelector("#q1Validation").innerHTML = "";
    if (!isFormValid()) {
        return;
    }

    // variables
    let score = 0;
    let q1Response = document.querySelector("#q1").value.toLowerCase();
    console.log(q1Response);

    // Grading Question 1
    if (q1Response == "sacramento") {
        document.querySelector("#q1Feedback").innerHTML = "Correct!";
        document.querySelector("#q1Feedback").className = "bg-success text-white";
        document.querySelector("#markImg1").innerHTML = "<img src='img/checkmark.png' alt=Checkmark'>"
        score += 20;
    } else {
        document.querySelector("#q1Feedback").innerHTML = "Inorrect!";
        document.querySelector("#q1Feedback").className = "bg-warning text-white";
        document.querySelector("#markImg1").innerHTML = "<img src='img/xmark.png' alt=Checkmark'>"
    }
    document.querySelector("#totalScore").innerHTML = `Total Score: ${score}`;
}//gradeQuiz

function isFormValid() {
    let isValid = true;
    if(document.querySelector("#q1").value == "") {
        isValid = false;
        document.querySelector("#q1Validation").innerHTML = "Question 1 was not answered";
    }
    return isValid;
} //isFormValid