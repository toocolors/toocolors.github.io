// Add event listeners
document.querySelector("button").addEventListener("click", gradeQuiz);

function gradeQuiz() {
    console.log("Grading quiz...");
    document.querySelector("#q1Feedback").innerHTML = "";
    if (!isFormValid()) {
        return;
    }

    let q1Response = document.querySelector("#q1").value;
    console.log(q1Response);
}

function isFormValid() {
    let isValid = true;
    if(document.querySelector("#q1").value == "") {
        isValid = false;
        document.querySelector("#q1Feedback").innerHTML = "Question 1 was not answered";
    }
    return isValid;
} //isFormValid