// event listeners
document.querySelector("#zip").addEventListener("change", displayCity);
document.querySelector("#state").addEventListener("change", displayState);
document.querySelector("#username").addEventListener("change", checkUsername);
document.querySelector("#signupForm").addEventListener("submit", function(event) {
    validateForm(event);
});

/**
 * Checks whether the entered username is available,
 *  then displays the result.
 * Uses CSUMB usernames API.
 */
async function checkUsername() {
    // Get username
    let username = document.querySelector("#username").value;

    // Get URL
    let url = `https://csumb.space/api/usernamesAPI.php?username=${username}`;

    // Get data
    let response = await fetch(url);
    let data = await response.json();

    // Check username
    let usernameError = document.querySelector("#usernameError");
    if(data.available) {
        usernameError.innerHTML = "Username available!";
        usernameError.style.color = "green";
    } else {
        usernameError.innerHTML = "Username taken!";
        usernameError.style.color = "red";
    }
}

/**
 * Gets data about the ZIP code entered in the #zip text box,
 *  then displays the data on screen.
 * Uses CSUMB City Info API.
 */
async function displayCity() {
    // Get ZIP code
    let zipCode = document.querySelector("#zip").value;

    // Get URL
    let url = `https://csumb.space/api/cityInfoAPI.php?zip=${zipCode}`;

    // Get Response
    let response = await fetch(url);
    let data = await response.json();
    // console.log(data);

    // Display data
    document.querySelector("#city").innerHTML = data.city;
    document.querySelector("#latitude").innerHTML = data.latitude;
    document.querySelector("#longitude").innerHTML = data.longitude;
}

/**
 * Gets the counties within the currently selected state,
 *  then displays those counties.
 * Uses CSUMB County List API.
 * @returns 
 */
async function displayState() {
    // Get State
    let state = document.querySelector("#state").value;

    // Check if state is valid
    if (state == "Select One") {
        document.querySelector("#county").innerHTML = "";
        return;
    }

    // Get URL
    let url = `https://csumb.space/api/countyListAPI.php?state=${state}`;

    // Get data
    let response = await fetch(url);
    let data = await response.json();

    // Display data
    let countyList = document.querySelector("#county");
    countyList.innerHTML = "<option> Select County </option>";
    for (let i = 0; i < data.length; i++) {
        countyList.innerHTML += `<option> ${data[i].county} </option>`;
    }
}

function validateForm(e) {
    let isValid = true;

    // Check username
    let username = document.querySelector("#username").value;
    if (username.length == 0) {
        document.querySelector("#usernameError").innerHTML = "Username Required!";
        isValid = false;
    }

    // Check if form is valid
    if (!isValid) {
        e.preventDefault();
    }
}