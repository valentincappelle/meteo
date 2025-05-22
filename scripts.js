let inputcity = document.getElementById("buttonville");
let buttonsearch = document.getElementById("rechercher");
let loader = document.getElementById("chargement");
let resultContainer = document.getElementById("resultatmeteo");
let cityName = document.getElementById("nomville");
let temperature = document.getElementById("temperature");
let description = document.getElementById("description");
let icon = document.getElementById("iconemeteo");
let autocompletion = document.getElementById("autocompletion");
let wind = document.getElementById("vent");
let humidity = document.getElementById("humidite");

const apiKey = "3432083903fe6dfdc2e09fadb51702e9";


buttonsearch.addEventListener("click", (e) => {
    e.preventDefault();
  let city = inputcity.value.trim();
  if (city !== "") {
    fetchWeatherData(city);
    inputcity.value = ""; 
  }
});

async function fetchWeatherData(city) {
  showLoader();
  hideResult();

  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city},fr&units=metric&lang=fr&appid=${apiKey}`;

  try {
    let response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Ville non trouvée ou invalide");
    }

    let data = await response.json();
    displayWeather(data);
  } catch (error) {
    showError(error.message);
  } finally {
    hideLoader();
  }
}


function displayWeather(data) {
  cityName.textContent = data.name;
  temperature.textContent = `${data.main.temp.toFixed(1)}°C`;
  description.textContent = data.weather[0].description;
  icon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  icon.alt = data.weather[0].description;

  wind.textContent = `Vent : ${data.wind.speed} m/s`;
  humidity.textContent = `Humidité : ${data.main.humidity} %`;

  let weatherMain = data.weather[0].main.toLowerCase(); 
  let body = document.body;

  body.className = ""; 
  switch (weatherMain) {
    case "clear":
      body.classList.add("sunny");
      break;
    case "clouds":
      body.classList.add("cloudy");
      break;
    case "rain":
    case "drizzle":
    case "thunderstorm":
      body.classList.add("rainy");
      break;
    case "snow":
      body.classList.add("snowy");
      break;
    default:
      body.classList.add("default-weather");
      break;
  }

  resultContainer.classList.remove("hidden");
}


function showLoader() {
  loader.classList.remove("hidden");
}
function hideLoader() {
  loader.classList.add("hidden");
}
function hideResult() {
  resultContainer.classList.add("hidden");
}
function showError(message) {
  alert("Erreur : " + message);
}

inputcity.addEventListener("input", async () => {
  let query = inputcity.value.trim();

  if (query.length < 3) return;

  try {
    let response = await fetch(`https://geo.api.gouv.fr/communes?nom=${query}&fields=nom&boost=population&limit=5`);
    let cities = await response.json();

    autocompletion.innerHTML = "";

    cities.forEach(city => {
      let option = document.createElement("option");
      option.value = city.nom;
      autocompletion.appendChild(option);
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des villes :", error);
  }
});
fetchWeatherData("Beauvais")