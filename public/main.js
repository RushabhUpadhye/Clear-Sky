let map; // Declare map variable globally
let marker; // Declare marker variable globally

async function fetchWeather() {
  const city = document.getElementById("city").value;

  if (!city) {
    alert("Please enter a city name");
    return;
  }

  try {
    const response = await fetch(`/weather?city=${city}`);
    const data = await response.json();

    // Debugging: Log the response
    console.log("Weather Data Response:", data);

    if (data.error) {
      alert(data.error);
      return;
    }

    const weatherInfo = document.getElementById("weather-info");
    const { currentWeather } = data;

    // Display weather data
    weatherInfo.innerHTML = `
      <h3>Weather in ${currentWeather.name}, ${currentWeather.sys.country}</h3>
      <p>Temperature: ${currentWeather.main.temp}°C</p>
      <p>Weather: ${currentWeather.weather[0].description}</p>
      <p>Humidity: ${currentWeather.main.humidity}%</p>
      <p>Wind Speed: ${currentWeather.wind.speed} m/s</p>
    `;

    const lat = currentWeather.coord.lat;
    const lon = currentWeather.coord.lon;

    // Initialize or update the map
    initMap(lat, lon);
  } catch (error) {
    alert("Error fetching weather data.");
    console.error("Error fetching weather data:", error);
  }
}

function initMap(lat, lon) {
  const location = [lat, lon];

  if (!map) {
    // Initialize the map if it doesn't already exist
    map = L.map("map").setView(location, 10);

    // Add OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Add marker
    marker = L.marker(location).addTo(map);
  } else {
    // Update map view and marker location
    map.setView(location, 10);
    marker.setLatLng(location);
  }
}

document.getElementById("weather-form").addEventListener("submit", (e) => {
  e.preventDefault();
  fetchWeather();
});
