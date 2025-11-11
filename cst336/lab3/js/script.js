// event listeners
document.querySelector("#zip").addEventListener("change", displayCity);

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