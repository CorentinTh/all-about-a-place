/**
 * Created by Corentin THOMASSET on 23/02/2018.
 */

import InputAutocomplete    from './InputAutocomplete';
import SpeechRecognition    from './SpeechRecognition';
import FirebaseManager      from './FirebaseManager';
import Geolocation          from './Geolocation';
import UIManager            from './UIManager';
import ApiManager           from './ApiManager';
import Map                  from './Map';

export default class ApplicationManager {

    constructor(params) {
        this.params = params;
    }

    initComponents(google, firebaseConfig) {
        this.google = google;

        this.firebaseManager = new FirebaseManager(firebaseConfig);

        //this.firebaseManager.loginViaGithub();

        this.speechRecognition = new SpeechRecognition(this);
        this.geolocation = new Geolocation();

        if (this.geolocation.isAvailable()) {
            this.geolocation.getUserLocation(this.onGetUserLocation.bind(this));
        }
        //console.log(this.speechRecognition.isAvailable());

        this.apiManager = new ApiManager(this.params.baseUrl);
        this.uiManager = new UIManager('#tabs-container', this.firebaseManager);
        this.map = {};

        this.mainInput = new InputAutocomplete('input-search-place')
            .onAutocomplete(this.onPlaceChose.bind(this))
            .setParams({types: ['(cities)']})
            .init(google);
        this.map = new Map(google, 'container-map');
        //this.apiManager.getSentimentAnalysis('', (result) => {console.log(result)})
    }

    onGetUserLocation(coords) {
        const geocoder = new this.google.maps.Geocoder();

        geocoder.geocode({location: coords, language: 'en'}, (result) => {
            if (result.length > 0) {
                let el = result[result.length > 1 ? 1 : 0];

                const place = el.address_components.filter(x => x.types.includes('locality') || x.types.includes('administrative_area_level_3'))[0].long_name;

                el.name = place;

                this.onPlaceChose(el);
                this.mainInput.setText(place);
            }
        });

    }

    onPlaceChose(data) {
        const place = data.name;

        this.apiManager.getWikipedia(place, this.onWikipediaSearch.bind(this));
        this.apiManager.getWeatherCurrent(place, this.onWeatherCurrent.bind(this));
        this.apiManager.getWeatherForecast(place, this.onWeatherForecast.bind(this));
        this.apiManager.getTweets(place, this.onTweets.bind(this));

        this.uiManager.cleanTabs();
        this.map.setZoom(9);

        this.firebaseManager.getReviewsByCity(place, this.onReviews.bind(this));
        this.uiManager.reviewManager.place = place;

        const setWithCoordinates = (location) => {
            this.apiManager.getFlickr(location, this.onFlickr.bind(this));

            this.map.centerOneForthLeft(location);
            this.map.removeMarkers();

            const marker = this.map.setMarker(location, '', {draggable: true});

            marker.addListener('dragend', () => {
                this.onMarkerDragged(marker.getPosition());
            })
        };

        if (data.geometry == undefined) {
            const geocoder = new this.google.maps.Geocoder();

            geocoder.geocode({address: place, language: 'en'}, (result) => {
                setWithCoordinates(result[0].geometry.location);
            });
        } else {
            setWithCoordinates(data.geometry.location);
        }

    }

    onReviews(reviews){
        this.uiManager.setReviews(reviews);
    }

    onMarkerDragged(position) {
        const geocoder = new this.google.maps.Geocoder();

        geocoder.geocode({latLng: position, language: 'en'}, (result) => {
            if (result.length > 0) {
                let el = result[0];

                const place = el.address_components.filter(x => x.types.includes('locality') || x.types.includes('administrative_area_level_3'))[0].long_name;

                el.name = place;

                this.onPlaceChose(el);
                this.mainInput.setText(place);
            }
        });
    }

    onWikipediaSearch(data) {
        if (!data.hasError && data.hasOwnProperty("extract")) {
            let sanitizedExtract = data.extract.replace(/\( listen\)/g, '');
            sanitizedExtract = sanitizedExtract.replace(/^(.{0,50})(\([^\)]*\))/g, '$1');

            this.uiManager.setWikipediaText(sanitizedExtract);
        } else {
            this.uiManager.setWikipediaText("<i>No information found</i>");
        }
    }

    onWeatherCurrent(data) {
        if (data.hasError) {
            this.uiManager.setWeatherCurrent("<i>No information found</i>");
        } else {
            this.uiManager.setWeatherCurrent(data);
        }
    }

    onWeatherForecast(data) {
        if (data.hasError) {
            this.uiManager.setWeatherForecast("<i>No information found</i>");
        } else {
            this.uiManager.setWeatherForecast(data);
        }
    }

    onTweets(data) {
        if (data.hasError) {
            this.uiManager.setTweets("<i>No information found</i>");
        } else {

            const tweets = data.statuses;

            this.uiManager.setTweets(tweets);

            for (const tweet of tweets) {
                this.apiManager.getSentimentAnalysis(tweet.text, (result) => {

                    if (result.hasError) {
                        this.uiManager.setSentimentToTweet({}, tweet.id, 'Cannot analyse the sentiments.');
                    } else {
                        this.uiManager.setSentimentToTweet(result.emotion.document.emotion, tweet.id);
                        this.uiManager.updateSentimentAnalysisOverview(result.emotion.document.emotion);
                    }
                })
            }
        }
    }

    onFlickr(data) {
        if (data.hasError) {
            this.uiManager.setFlickr("<i>No information found</i>");
        } else {
            this.uiManager.setFlickr(data);
        }
    }

}

