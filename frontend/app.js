// frontend/app.js
const weatherForm = document.getElementById('weatherForm');
const cityInput = document.getElementById('cityInput');
const weatherDisplay = document.getElementById('weatherDisplay');
const statusMessage = document.getElementById('statusMessage');

const cityName = document.getElementById('cityName');
const weatherDate = document.getElementById('weatherDate');
const weatherIcon = document.getElementById('weatherIcon');
const temperature = document.getElementById('temperature');
const description = document.getElementById('description');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');

weatherForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const city = cityInput.value.trim();
    if (!city) return;

    // Reset layout interface and show premium loading stream status
    statusMessage.innerText = `Streaming real-time tracking parameters...`;
    weatherDisplay.classList.add('hidden');

    try {
        // 🚀 RELATIVE PATH: Tells Chrome to talk directly to your running backend port
        const response = await fetch(`/api/weather?city=${city}`);

        if (!response.ok) {
            throw new Error('Location profile unmatched. Try another spelling.');
        }

        const data = await response.json();
        displayWeatherData(data);

    } catch (error) {
        console.error("Frontend Query Error:", error);
        statusMessage.innerText = `⚠️ ${error.message}`;
    }
});
// Function to take clean normalized fields and map them directly into your HTML elements
function displayWeatherData(data) {
    // 1. Inject textual data fields
    cityName.innerText = `${data.name}, ${data.sys.country}`;
    temperature.innerText = `${Math.round(data.main.temp)}°C`;
    description.innerText = data.weather.description;
    humidity.innerText = `${data.main.humidity}%`;
    windSpeed.innerText = `${data.wind.speed} m/s`;

    // 2. Format and display today's current date strings dynamically
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    weatherDate.innerText = new Date().toLocaleDateString('en-US', options);

    // 3. Load the crisp graphic icon delivered directly from our normalized backend proxy
    weatherIcon.src = data.weather.iconUrl;

    // 4. Reveal the beautifully styled layout canvas container over the 4K video canvas
    statusMessage.innerText = ""; 
    weatherDisplay.classList.remove('hidden'); 
}

