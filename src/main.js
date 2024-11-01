function buttonClicked() {
    const city = document.getElementById("city_input").value;

    fetch(`https://api.weatherapi.com/v1/forecast.json?key=32804b24a847407391c53709241010&q=${city}&days=1`)
        .then(response => response.json())
        .then(data => {
            // Display current weather information
            displayCurrentWeather(data);
            storeWeatherData(data);

            // Display hourly forecast
            displayHourlyForecast(data.forecast.forecastday[0].hour);
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            alert("Unable to retrieve weather information. Please try again.");
        });
}

// Function to display current weather information
function displayCurrentWeather(data) {
    const name = data.location.name;
    const region = data.location.region;
    const country = data.location.country;
    const localTime = data.location.localtime;
    const temp = data.current.temp_c;
    const feelsLike = data.current.feelslike_c;
    const weatherDesc = data.current.condition.text;
    const icon = `https:${data.current.condition.icon}`;
    const windSpeed = data.current.wind_kph;
    const humidity = data.current.humidity;

    document.getElementById("location").innerHTML = `Location: ${name}, ${region}, ${country}`;
    document.getElementById("localTime").innerHTML = `Local Time: ${localTime}`;
    document.getElementById("temperature").innerHTML = `Temperature: ${temp}°C`;
    document.getElementById("feelsLike").innerHTML = `Feels like: ${feelsLike}°C`;
    document.getElementById("description").innerHTML = `Weather: ${weatherDesc}`;
    document.getElementById("wind").innerHTML = `Wind Speed: ${windSpeed} kph`;
    document.getElementById("humidity").innerHTML = `Humidity: ${humidity}%`;

    const iconElement = document.getElementById("currentIcon");
    iconElement.src = icon;
    iconElement.alt = weatherDesc;

    const clothingAdvice = getClothingRecommendation(temp, weatherDesc);
    document.getElementById("clothingAdvice").innerHTML = `Clothing Recommendation: ${clothingAdvice}`;
}
function storeWeatherData(data) {
    // Save data to localStorage for CRUD page
    localStorage.setItem("location", `${data.location.name}, ${data.location.region}, ${data.location.country}`);
    localStorage.setItem("localTime", data.location.localtime);
    localStorage.setItem("temperature", `${data.current.temp_c}°C`);
    localStorage.setItem("feelsLike", `${data.current.feelslike_c}°C`);
    localStorage.setItem("description", data.current.condition.text);
    localStorage.setItem("icon", `https:${data.current.condition.icon}`);
    localStorage.setItem("wind", `${data.current.wind_kph} kph`);
    localStorage.setItem("humidity", `${data.current.humidity}%`);
    localStorage.setItem("clothingAdvice", getClothingRecommendation(data.current.temp_c));
}

// Function to generate clothing recommendations
function getClothingRecommendation(temp, weatherDesc) {
    if (temp > 30) return "Wear light, breathable fabrics like cotton and stay hydrated.";
    if (temp > 20) return "Light clothing like t-shirts and shorts are suitable.";
    if (temp > 10) return "Wear a light jacket or sweater.";
    if (temp > 0) return "Wear a warm coat and consider layering.";
    return "Bundle up in a heavy coat, scarf, gloves, and a hat.";
}

// Function to display hourly forecast
function displayHourlyForecast(hourlyData) {
    const hourlyContainer = document.getElementById("hourlyContainer");
    hourlyContainer.innerHTML = ""; // Clear previous hourly data

    hourlyData.forEach(hour => {
        const hourlyBox = document.createElement("div");
        hourlyBox.classList.add("hourly-box");

        const time = document.createElement("p");
        time.classList.add("hourly-time");
        time.textContent = hour.time.split(" ")[1]; // Display only the hour part

        const icon = document.createElement("img");
        icon.classList.add("hourly-icon");
        icon.src = `https:${hour.condition.icon}`;
        icon.alt = hour.condition.text;

        const temp = document.createElement("p");
        temp.classList.add("hourly-temp");
        temp.textContent = `${hour.temp_c}°C`;

        const condition = document.createElement("p");
        condition.classList.add("hourly-condition");
        condition.textContent = hour.condition.text;

        hourlyBox.appendChild(time);
        hourlyBox.appendChild(icon);
        hourlyBox.appendChild(temp);
        hourlyBox.appendChild(condition);

        hourlyContainer.appendChild(hourlyBox);
    });
}

// Navigate to create.html
function navigateToCreatePage() {
    window.location.href = "crud.html";
}