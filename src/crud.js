const fs = require('fs');
const path = require('path');

// HTML element references
const btnCreate = document.getElementById('btnCreate');
const fileName = document.getElementById('fileName');
const fileContents = document.getElementById('fileContents');
const viewAllButtonContainer = document.getElementById('viewAllButtonContainer');

// Directory to store itinerary files
const pathName = path.join(__dirname, 'Files');
if (!fs.existsSync(pathName)) fs.mkdirSync(pathName);

// Create Itinerary with Weather Data
btnCreate.addEventListener('click', function() {
    const filePath = path.join(pathName, `${fileName.value}.txt`);

    // Retrieve weather data from localStorage
    const weatherData = {
        location: localStorage.getItem("location"),
        temperature: localStorage.getItem("temperature"),
        feelsLike: localStorage.getItem("feelsLike"),
        description: localStorage.getItem("description"),
        wind: localStorage.getItem("wind"),
        humidity: localStorage.getItem("humidity")
    };

    // Combine weather data with itinerary details
    const content = `
    Weather Data:
    - Location: ${weatherData.location}
    - Temperature: ${weatherData.temperature}
    - Feels Like: ${weatherData.feelsLike}
    - Condition: ${weatherData.description}
    - Wind Speed: ${weatherData.wind}
    - Humidity: ${weatherData.humidity}

    Itinerary Details:
    ${fileContents.value}
    `;

    fs.writeFile(filePath, content, (err) => {
        if (err) {
            return console.error('Error creating file:', err);
        }
        alert(`Itinerary "${fileName.value}" created successfully!`);

        // Show the "View All Itineraries" button
        viewAllButtonContainer.style.display = "block";
        fileName.value = "";
        fileContents.value = "";
    });
});

// Redirect to manage.html to view all itineraries
function goToManagePage() {
    window.location.href = "crud2.html";
}
