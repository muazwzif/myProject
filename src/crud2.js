const fs = require('fs');
const path = require('path');

// HTML element references
const itineraryDisplay = document.getElementById('itineraryDisplay');
const fileContentDisplay = document.getElementById('fileContentDisplay');
const weatherLocation = document.getElementById('weatherLocation');
const weatherTemperature = document.getElementById('weatherTemperature');
const weatherFeelsLike = document.getElementById('weatherFeelsLike');
const weatherDescription = document.getElementById('weatherDescription');
const weatherWind = document.getElementById('weatherWind');
const weatherHumidity = document.getElementById('weatherHumidity');
const displayItineraryData = document.getElementById('displayItineraryData');
const btnUpdate = document.getElementById('btnUpdate');
const btnConfirmUpdate = document.getElementById('btnConfirmUpdate');
const btnCancelUpdate = document.getElementById('btnCancelUpdate');
const btnDelete = document.getElementById('btnDelete');
const deleteConfirmation = document.getElementById('deleteConfirmation');
const btnYesDelete = document.getElementById('btnYesDelete');
const btnNoDelete = document.getElementById('btnNoDelete');

let currentFilePath = ""; // Store the current file path for update or delete
let originalItineraryData = ""; // Store original content for Cancel Update

// Directory to store itinerary files
const pathName = path.join(__dirname, 'Files');

// Display Saved Itineraries
function displayItineraries() {
    itineraryDisplay.innerHTML = ""; // Clear previous entries

    fs.readdir(pathName, (err, files) => {
        if (err) {
            return console.error('Error reading directory:', err);
        }

        files.forEach(file => {
            const filePath = path.join(pathName, file);

            const fileBox = document.createElement('div');
            fileBox.classList.add('file-box');
            fileBox.textContent = file.replace('.txt', ''); // Display file name without extension

            // Create a "Read" button that appears on hover
            const readButton = document.createElement('button');
            readButton.classList.add('read-btn');
            readButton.textContent = "Read";
            readButton.style.display = "none";

            // Show "Read" button on hover
            fileBox.addEventListener("mouseenter", () => {
                readButton.style.display = "inline";
            });
            fileBox.addEventListener("mouseleave", () => {
                readButton.style.display = "none";
            });

            // Show itinerary details and weather data on "Read" button click
            readButton.addEventListener('click', () => {
                displayItinerary(filePath);
            });

            fileBox.appendChild(readButton);
            itineraryDisplay.appendChild(fileBox);
        });
    });
}

// Display itinerary content and weather data
function displayItinerary(filePath) {
    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            return console.error('Error reading file:', err);
        }

        // Separate and display weather data and itinerary content
        const [weatherSection, itinerarySection] = data.split("Itinerary Details:");
        displayWeatherData(weatherSection);
        displayItineraryData.value = itinerarySection.trim();
        displayItineraryData.readOnly = true; // Make it read-only until 'Update' is clicked

        originalItineraryData = displayItineraryData.value;

        fileContentDisplay.style.display = "block";
        btnUpdate.style.display = "inline";
        btnDelete.style.display = "inline";
        btnConfirmUpdate.style.display = "none"; // Hide confirm button initially
        btnCancelUpdate.style.display = "none"; // Hide cancel update button initially
        currentFilePath = filePath; // Store the current file path for update or delete

    });
}

// Display weather data in a structured format
function displayWeatherData(weatherSection) {
    const weatherLines = weatherSection.split("\n").map(line => line.trim());
    weatherLocation.textContent = weatherLines[0];
    weatherTemperature.textContent = weatherLines[1];
    weatherFeelsLike.textContent = weatherLines[2];
    weatherDescription.textContent = weatherLines[3];
    weatherWind.textContent = weatherLines[4];
    weatherHumidity.textContent = weatherLines[5];
}

// Update itinerary
btnUpdate.addEventListener('click', () => {
    displayItineraryData.readOnly = false; // Allow editing
    btnConfirmUpdate.style.display = "inline"; // Show confirm update button
    btnCancelUpdate.style.display = "inline"; // Show cancel update button
    btnUpdate.style.display = "none"; // Hide update button
    btnDelete.style.display = "none"; // Hide delete button
});

// Confirm Update functionality
btnConfirmUpdate.addEventListener('click', () => {
    const updatedContent = `
    ${displayWeatherData.textContent}

    Itinerary Details:
    ${displayItineraryData.value}
    `;

    fs.writeFile(currentFilePath, updatedContent, (err) => {
        if (err) {
            return console.error('Error updating file:', err);
        }
        alert("Itinerary updated successfully!");
        displayItineraryData.readOnly = true;
        btnConfirmUpdate.style.display = "none";
        btnCancelUpdate.style.display = "none";
        btnUpdate.style.display = "inline";
        btnDelete.style.display = "inline";
    });
});

// Cancel Update functionality
btnCancelUpdate.addEventListener('click', () => {
    displayItineraryData.value = originalItineraryData; // Revert to original content
    displayItineraryData.readOnly = true; // Make it read-only again

    // Revert buttons to their original state
    btnConfirmUpdate.style.display = "none";
    btnCancelUpdate.style.display = "none";
    btnUpdate.style.display = "inline";
    btnDelete.style.display = "inline";
});

// Delete confirmation dialog
btnDelete.addEventListener('click', () => {
    deleteConfirmation.style.display = "block"; // Show delete confirmation dialog
});

// Confirm deletion
btnYesDelete.addEventListener('click', () => {
    fs.unlink(currentFilePath, (err) => {
        if (err) {
            return console.error('Error deleting file:', err);
        }
        alert("File deleted successfully!");
        deleteConfirmation.style.display = "none"; // Hide confirmation dialog
        fileContentDisplay.style.display = "none"; // Hide file content display
        displayItineraries(); // Refresh the file list
    });
});

// Cancel deletion
btnNoDelete.addEventListener('click', () => {
    deleteConfirmation.style.display = "none"; // Hide confirmation dialog
});

// Initial display of saved itineraries on page load
displayItineraries();
