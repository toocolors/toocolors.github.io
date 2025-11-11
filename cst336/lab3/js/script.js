// Global variables
const usStates = [
  { name: "Alabama", code: "AL" },
  { name: "Alaska", code: "AK" },
  { name: "Arizona", code: "AZ" },
  { name: "Arkansas", code: "AR" },
  { name: "California", code: "CA" },
  { name: "Colorado", code: "CO" },
  { name: "Connecticut", code: "CT" },
  { name: "Delaware", code: "DE" },
  { name: "Florida", code: "FL" },
  { name: "Georgia", code: "GA" },
  { name: "Hawaii", code: "HI" },
  { name: "Idaho", code: "ID" },
  { name: "Illinois", code: "IL" },
  { name: "Indiana", code: "IN" },
  { name: "Iowa", code: "IA" },
  { name: "Kansas", code: "KS" },
  { name: "Kentucky", code: "KY" },
  { name: "Louisiana", code: "LA" },
  { name: "Maine", code: "ME" },
  { name: "Maryland", code: "MD" },
  { name: "Massachusetts", code: "MA" },
  { name: "Michigan", code: "MI" },
  { name: "Minnesota", code: "MN" },
  { name: "Mississippi", code: "MS" },
  { name: "Missouri", code: "MO" },
  { name: "Montana", code: "MT" },
  { name: "Nebraska", code: "NE" },
  { name: "Nevada", code: "NV" },
  { name: "New Hampshire", code: "NH" },
  { name: "New Jersey", code: "NJ" },
  { name: "New Mexico", code: "NM" },
  { name: "New York", code: "NY" },
  { name: "North Carolina", code: "NC" },
  { name: "North Dakota", code: "ND" },
  { name: "Ohio", code: "OH" },
  { name: "Oklahoma", code: "OK" },
  { name: "Oregon", code: "OR" },
  { name: "Pennsylvania", code: "PA" },
  { name: "Rhode Island", code: "RI" },
  { name: "South Carolina", code: "SC" },
  { name: "South Dakota", code: "SD" },
  { name: "Tennessee", code: "TN" },
  { name: "Texas", code: "TX" },
  { name: "Utah", code: "UT" },
  { name: "Vermont", code: "VT" },
  { name: "Virginia", code: "VA" },
  { name: "Washington", code: "WA" },
  { name: "West Virginia", code: "WV" },
  { name: "Wisconsin", code: "WI" },
  { name: "Wyoming", code: "WY" }
];

// event listeners
document.querySelector("#zip").addEventListener("change", displayCity);
document.querySelector("#state").addEventListener("change", displayState);
document.querySelector("#username").addEventListener("change", checkUsername);
document.querySelector("#password").addEventListener("click", suggestPassword);
document.querySelector("#signupForm").addEventListener("submit", function(event) {
    validateForm(event);
});

// Call functions
displayStates()

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

    // Reset data
    let zipError = document.querySelector("#zipError");
    zipError.innerHTML = "";
    document.querySelector("#city").innerHTML = "";
    document.querySelector("#latitude").innerHTML = "";
    document.querySelector("#longitude").innerHTML = "";
    
    // Display Data
    if (data == false) {
        zipError.innerHTML = "ZIP code not found.<br>";
        return;
    }
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

/**
 * Adds each state in usStates to the states dropdown.
 */
function displayStates() {
    let states = document.querySelector("#state");
    for (let i = 0; i < usStates.length; i++) {
        states.innerHTML += `<option value="${usStates[i].code}">${usStates[i].name}</option>`;
    }
}

/**
 * Displays a potential password next to the password input text box.
 */
function suggestPassword() {
    // Get random password
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_!@';
    const passwordLength = Math.floor(Math.random() * (20 - 6 + 1) + 6);
    let password = '';
    for (let i = 0; i < passwordLength; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    // Display random password
    document.querySelector("#suggestedPassword").innerHTML = password;
}

/**
 * Checks to see if the username and password are valid,
 *  then blocks the form from completing if either are not.
 * @param {event} e The event related to the form submission.
 */
function validateForm(e) {

    let isValid = true;

    // Check username
    let username = document.querySelector("#username").value;
    if (username.length == 0) {
        document.querySelector("#usernameError").innerHTML = "Username Required!<br>";
        isValid = false;
    }

    // Check password
    let password = document.querySelector("#password").value;
    let retypedPassword = document.querySelector("#retypePassword").value;
    if (password.length < 6) {
        document.querySelector("#passwordError").innerHTML = "Invalid Password!<br>";
        isValid = false;
    }
    if(retypedPassword == null || password != retypedPassword) {
        document.querySelector("#retypeError").innerHTML = "Passwords don't match!<br>";
        isValid = false;
    }

    // Check if form is valid
    if (!isValid) {
        e.preventDefault();
    }
}