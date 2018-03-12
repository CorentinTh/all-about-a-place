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
The application embeds a proxy server written in PHP in order to secure API requests. The front end application send a request to the proxy, then the server send a request to the API and give back the result to the application.

What would happen without the proxy server:

![without-proxy-server](/src/resources/img/without-server.PNG?raw=true)

And with it (what the application is currently doing):

![wit-proxy-server](/src/resources/img/with-server.PNG?raw=true)


The main advantages for such architecture:
* Protection of the API keys. Since my API keys and credentials are all stored in the server, the client cannot see them and so he will not be able to reuse them.
* Huge abstraction level for the request on the client side. To request information to the server, all my request all have the same aspect, for example :
  * base-url.tld/api/**weather**?place=Helsinki
  * base-url.tld/api/**wikipedia**?place=Helsinki
  * base-url.tld/api/**tweets**?place=Helsinki
* Easy maintenance. If I need to change API for a reason, I will just have to change a really small part in the server, and I don’t need to update my client code. I have one file per API so it’s really easy to maintain.
* Filter requests and prevent spam. As my server acts as a really between the client and the API provider, I could make sure that the requests are ok and make sense, so I don’t bother the API with wrong requests.

### Technologies used
#### APIs
* OpenWeather (two endpoints: *current* and *forecast*)
* Twitter
* IBM natural language understanding
* Flickr
* Wikipedia
* Google Maps
    * Maps
    * Autocomplete
    * Geocode
* Firebase
* OAuth2 (for reviews login)
    * Twitter
    * Facebook
    * Google
    * Github
* HTML5 Speech recognition API
* HTML5 Geolocation API
* (+ Google Analytics)

#### View
* Bootstrap
* Font-awesome
* Weather icons
* Chart.js

#### Other dependencies
* JQuery
* is.js
* moment.js

#### Dev
I used **[parcel bundler](https://github.com/parcel-bundler/parcel)** for building the application. It's a blazing fast, zero configuration web application bundler which I strongly recommend. It has allowed me to use **Less** and **PostCss** without configuration nor file watcher setup.

## License
[Project under MIT License](https://github.com/CorentinTh/all-about-a-place/blob/master/LICENSE) 

Copyright (c) 2018 Corentin THOMASSET
