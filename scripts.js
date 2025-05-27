// Récupération des éléments HTML pour manipuler l'interface
let input = document.getElementById("inputville");
let button = document.getElementById("rechercher");
let resultat = document.getElementById("resultatmeteo");
let nomVille = document.getElementById("nomville");
let temperature = document.getElementById("temperature");
let description = document.getElementById("description");
let icon = document.getElementById("iconemeteo");
let autocompletion = document.getElementById("autocompletion");
let vent = document.getElementById("vent");
let humidite = document.getElementById("humidite");
let chargement = document.getElementById("chargement");

// Clé API pour OpenWeatherMap
const apiKey = "3432083903fe6dfdc2e09fadb51702e9";

// Lorsqu'on clique sur le bouton de recherche
button.addEventListener("click", () => {
  let city = input.value.trim(); // Récupère le nom de la ville
  if (city !== "") {
    WeatherData(city); // Lance la requête météo
    input.value = ""; // Vide le champ après recherche
  }
});

// Fonction principale qui va chercher les données météo et prévisions
async function WeatherData(city) {
  showLoader(); // Affiche l'indicateur de chargement
  hideResult(); // Cache les anciens résultats
  hideForecast(); // Cache les anciennes prévisions

  // URLs des deux appels API (météo actuelle + prévisions)
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city},fr&units=metric&lang=fr&appid=${apiKey}`;
  let forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city},fr&units=metric&lang=fr&appid=${apiKey}`;

  try {
    // Appel des deux APIs en parallèle
    let [response, forecastResponse] = await Promise.all([
      fetch(apiUrl),
      fetch(forecastUrl),
    ]);

    // Gestion d'erreur si une des réponses échoue
    if (!response.ok || !forecastResponse.ok) {
      throw new Error("Ville non trouvée ou invalide");
    }

    // Conversion des réponses en JSON
    let data = await response.json();
    let forecastData = await forecastResponse.json();

    // Affichage des données
    Weather(data);
    Forecast(forecastData);
  } catch (error) {
    showError(error.message); // Affiche une alerte si erreur
  } finally {
    hideLoader(); // Masque le chargement dans tous les cas
  }
}

// Affiche la météo actuelle
function Weather(data) {
  nomVille.textContent = data.name;
  temperature.textContent = `${data.main.temp.toFixed(1)}°C`;
  description.textContent = data.weather[0].description;
  icon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  icon.alt = data.weather[0].description;

  // Informations complémentaires
  vent.textContent = `Vent : ${data.wind.speed} m/s`;
  humidite.textContent = `Humidité : ${data.main.humidity} %`;

  // Gestion du fond selon la météo
  let weatherMain = data.weather[0].main.toLowerCase();
  let weatherDesc = data.weather[0].description.toLowerCase();
  let body = document.body;
  body.className = ""; // Réinitialise les classes

  switch (weatherMain) {
    case "clear":
      body.classList.add("sunny");
      break;
    case "clouds":
      if (weatherDesc.includes("peu nuageux")) {
        body.classList.add("fewclouds");
      } else {
        body.classList.add("cloudy");
      }
      break;
    case "rain":
    case "drizzle":
    case "thunderstorm":
      body.classList.add("rainy");
      break;
    case "snow":
      body.classList.add("snowy");
      break;
    case "mist":
      body.classList.add("foggy");
      break;
  }

  resultat.classList.remove("hidden"); // Affiche le bloc météo
}

// Affiche les prévisions météo sur 5 jours
function Forecast(data) {
  let joursDiv = document.getElementById("jours");
  joursDiv.innerHTML = ""; // Vide les anciennes prévisions

  let joursMap = {}; // Objet pour regrouper les données par jour

  // Parcourt chaque prévision (toutes les 3 heures sur 5 jours)
  data.list.forEach((item) => {
    let date = new Date(item.dt * 1000);
    let jour = date.toLocaleDateString("fr-FR", { weekday: "long" });

    // Si c'est la première fois qu'on voit ce jour
    if (!joursMap[jour]) {
      joursMap[jour] = {
        min: item.main.temp_min,
        max: item.main.temp_max,
        icon: item.weather[0].icon.replace("n", "d"),
        descriptions: [item.weather[0].description],
      };
    } else {
      // Mise à jour des min/max pour le jour
      joursMap[jour].min = Math.min(joursMap[jour].min, item.main.temp_min);
      joursMap[jour].max = Math.max(joursMap[jour].max, item.main.temp_max);
      joursMap[jour].descriptions.push(item.weather[0].description);
    }
  });

  // Affiche seulement les 5 premiers jours
  let compteur = 0;
  for (let jour in joursMap) {
    if (compteur >= 5) break;

    let div = document.createElement("div");
    div.className = "jour"; // Pour le style CSS

    // Création de l'affichage du jour
    div.innerHTML = `
      <h3>${jour.charAt(0).toUpperCase() + jour.slice(1)}</h3>
      <img src="https://openweathermap.org/img/wn/${
        joursMap[jour].icon
      }@2x.png" alt="Météo" />
      <p>${joursMap[jour].min.toFixed(0)}°C / ${joursMap[jour].max.toFixed(
      0
    )}°C</p>
    `;

    joursDiv.appendChild(div);
    compteur++;
  }

  document.getElementById("previsions").classList.remove("hidden");
}

// Cache le bloc des prévisions
function hideForecast() {
  document.getElementById("previsions").classList.add("hidden");
}

// Affiche le loader
function showLoader() {
  chargement.classList.remove("hidden");
}

// Masque le loader
function hideLoader() {
  chargement.classList.add("hidden");
}

// Masque les résultats météo
function hideResult() {
  resultat.classList.add("hidden");
}

// Affiche une alerte en cas d’erreur
function showError(message) {
  alert("Erreur : " + message);
}

// Auto-complétion des villes pendant la saisie
input.addEventListener("input", async () => {
  let cityName = input.value.trim();
  if (cityName.length < 1) return;

  try {
    // Requête vers l’API gouvernementale française des communes
    let response = await fetch(
      `https://geo.api.gouv.fr/communes?nom=${cityName}&fields=nom&boost=population&limit=5`
    );
    let cities = await response.json();

    // Réinitialise les suggestions
    autocompletion.innerHTML = "";

    // Ajoute les villes proposées
    cities.forEach((city) => {
      let option = document.createElement("option");
      option.value = city.nom;
      autocompletion.appendChild(option);
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des villes :", error);
  }
});

// Chargement initial de la météo d'une ville par défaut
WeatherData("Beauvais");
