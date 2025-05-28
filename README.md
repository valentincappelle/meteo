Application Météo - Projet JavaScript

APIs utilisées :

OpenWeatherMap (https://openweathermap.org)
Permet de récupérer :
- La météo actuelle (`/weather`)
- Les prévisions sur 5 jours (`/forecast`)
- Température, vent, humidité, icônes météo, etc.
Cette Api requiert une clé API personnelle.


API Geo Gouv (https://geo.api.gouv.fr/communes)
Utilisée pour l’autocomplétion des villes françaises.
- Donne une liste de villes correspondant à la saisie de l’utilisateur
- Classe les villes selon leur population
- Permet d’éviter les erreurs de saisie