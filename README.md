[![Website](https://img.shields.io/website-up-down-green-red/https/all-about-a-place.corentin-thomasset.fr.svg?label=app-state)](https://all-about-a-place.corentin-thomasset.fr/)
[![License](https://img.shields.io/github/license/CorentinTh/all-about-a-place.svg)](https://github.com/CorentinTh/all-about-a-place/blob/master/LICENSE)

# all-about-a-place

Location based information analysis web application ([demo here](https://all-about-a-place.corentin-thomasset.fr/)).

## Context

This application is the result of the *API for the Web* course project of Metropolia University (Helsinki). Teacher: [Olli Alm](https://github.com/OAlm).

## Presentation

This web-application provides information for a given location. For a given city, this application provides:
* The current weather
* A weather forecast for the next 3 days
* A Wikipedia overview of this place
* Recent and popular tweets about this place
* The sentiment analysis for each tweet + the average of all sentiment analysis
* People personal reviews of this place
* Flickr pictures taken there

The first time you will land on the application you will be ask if you want to share you current location. If you accept, you will automatically get information for your location.

You can also choose a location by:
* Using the input field, which uses google maps autocomplete to predict a place
* Drag 'n drop the map cursor
* Using the text-to-speech features by clicking the microphone icon and shooting for example "Show me Paris".

As said previously, you can see people personal reviews for a place, but you can also leave your own review. To do so, you just have to click on button **Add a review** on the **review panel** and a modal with a form appears. You must provide basics credentials in order to leave a review (email and name) but you can also use 4 external services to log-in: Google, Facebook, Github  or Twitter.

## Technical aspect
### API requests
The application uses a proxy server in order to secure API requests. The application send a request to the proxy, then the server send a request to the API and give back the result to the application.
 
The purpose of such implementation is to not hard-code my API keys and credentials in the front end of the application.

### Technologies used
#### APIs
* **OpenWeather** (two endpoints: *current* and *forecast*)
* **Twitter**
* **IBM natural language understanding**
* **Flickr**
* **Wikipedia**
* **Google Maps**
    * Maps
    * Autocomplete
    * Geocode
* **Firebase**
* **OAuth2** (for reviews login)
    * **Twitter**
    * **Facebook**
    * **Google**
    * **Github**
* (+ Google Analytics)

#### View
* **Bootstrap**
* **Font-awesome**
* **Weather icons**
* **Chart.js**

### Other dependencies
* **JQuery**
* **is.js**
* **moment.js**

#### Dev
I used **[parcel bundler](https://github.com/parcel-bundler/parcel)** for building the application. It's a blazing fast, zero configuration web application bundler which I strongly recommend. It has allowed me to use **Less** and **PostCss** without configuration nor file watcher setup.

## License
[Project under MIT License](https://github.com/CorentinTh/all-about-a-place/blob/master/LICENSE) 

Copyright (c) 2018 Corentin THOMASSET