Application Météo - Projet JavaScript

Objectif
Créer une application météo responsive et fonctionnelle permettant à l’utilisateur de rechercher une ville française et d’obtenir en temps réel :
- La température actuelle
- Une description de la météo
- Une icône météo
- Des prévisions sur 5 jours
- Et (en bonus) une autocomplétion dynamique des villes
git 
Fonctionnalités principales

- Champ de recherche pour entrer une ville française
- Bouton pour lancer la recherche
- Affichage de la ville sélectionnée
- Température en temps réel
- Description météo + icône météo
- Loader pendant le chargement
- Changement automatique du fond d’écran selon le type de météo
- Affichage des prévisions météo pour les 5 prochains jours

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