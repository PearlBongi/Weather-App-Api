const apiKey = "567b716e0b71da076e76f1df2393ab28";
let currentUnit = "metric";

async function getWeatherData(city) {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${currentUnit}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    alert("Error fetching weather data. Please try again later.");
  }
}

function displayWeatherData(data) {
  document.getElementById("cityName").innerText =
    data.name + ", " + data.sys.country;
  document.getElementById("temperature").innerText = data.main.temp + " °C";
  document.getElementById("localTime").innerText = getLocalTime(data.timezone);
  document.getElementById("weatherDescription").innerText =
    data.weather[0].description;
  document.getElementById("temperature").innerText = Math.round(data.main.temp);
  document.getElementById("precipitation").innerText =
    "Precipitation: " + data.main.humidity + "%";
  document.getElementById("humidity").innerText =
    "Humidity: " + data.main.humidity + "%";
  document.getElementById("wind").innerText =
    "Wind: " + data.wind.speed + " km/h";
  document.getElementById("weatherIcon").src = getWeatherIconUrl(
    data.weather[0].icon
  );
}

function convertTemperature() {
  currentUnit = currentUnit === "metric" ? "imperial" : "metric";
  const cityInput = document.getElementById("cityInput").value;
  searchCity(cityInput);
}
function getLocalTime(timezone) {
  const localTime = new Date();
  const utc = localTime.getTime() + localTime.getTimezoneOffset() * 60000;
  return new Date(utc + 1000 * timezone).toLocaleTimeString();
}

function getWeatherIconUrl(icon) {
  return "https://openweathermap.org/img/wn/" + icon + ".png";
}
function searchCity() {
  const cityInput = document.getElementById("cityInput").value;
  getWeatherData(cityInput).then((data) => displayWeatherData(data));
}

function getCurrentLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
          );
          displayWeatherData(response.data);
        } catch (error) {
          console.error("Error fetching weather data:", error);
          alert("Error fetching weather data. Please try again later.");
        }
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Error getting your location. Please try again later.");
      }
    );
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}
document
  .getElementById("searchButton")
  .addEventListener("click", function (event) {
    event.preventDefault();
    searchCity();
  });

document
  .getElementById("temperature-link")
  .addEventListener("click", function (event) {
    event.preventDefault();
    convertTemperature();
  });
