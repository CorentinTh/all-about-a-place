/**
 * Created by Corentin THOMASSET on 23/02/2018.
 */


import ProxyRequest from './ProxyRequest'

export default class ApiManager {

    constructor(proxyBase) {
        this.PROXY_BASE = proxyBase;
    }

    /**
     * Method to get sentiment analysis of some text
     * @param text The text that must be analysed
     * @param callback The callback that will handle the response
     * @param targets An array of keywords
     */
    getSentimentAnalysis(text, callback, targets = undefined) {
        const data = {
            text: text,
            features: {
                emotion: {}
            }
        };

        if (targets) {
            data.features.emotion.targets = targets;
        }

        new ProxyRequest(this.PROXY_BASE)
            .post('sentiment-analysis')
            .data({data: JSON.stringify(data)})
            .onSuccess(callback)
            .execute();
    }

    /**
     *
     * @param placename The name o the place to get the wikipedia article
     * @param callback The callback that will handle the response
     */
    getWikipediaByPlaceName(placename, callback) {

        new ProxyRequest(this.PROXY_BASE)
            .get('geonames-wipipedia-place')
            .data({place: placename})
            .onSuccess((result) => {
                if (result && result.hasOwnProperty('geonames')) {
                    callback(result)
                } else {
                    callback({
                        hasError: true,
                        error: true
                    })
                }
            })
            .execute();
    }

    getWikipedia(query, callback) {
        new ProxyRequest(this.PROXY_BASE)
            .get('wikipedia')
            .data({query: query})
            .onSuccess((result) => {
                if (result && result.hasOwnProperty('query')) {
                    const field = Object.getOwnPropertyNames(result.query.pages)[0];

                    callback(result.query.pages[field]);
                } else {
                    callback({
                        hasError: true,
                        error: true
                    })
                }
            })
            .execute();
    }

    getWeatherCurrent(place, callback) {
        new ProxyRequest(this.PROXY_BASE)
            .get('open-weather-current')
            .data({place: place})
            .onSuccess((result) => {
                if (result && result.hasOwnProperty('cod') && (result.cod == 200 || result.cod == "200")) {
                    callback(result);
                } else {
                    callback({
                        hasError: true,
                        error: true
                    })
                }
            })
            .execute();
    }

    getWeatherForecast(place, callback) {
        new ProxyRequest(this.PROXY_BASE)
            .get('open-weather-forecast')
            .data({place: place})
            .onSuccess((result) => {
                if (result && result.hasOwnProperty('cod') && (result.cod == 200 || result.cod == "200")) {
                    callback(result);
                } else {
                    callback({
                        hasError: true,
                        error: true
                    })
                }
            })
            .execute();
    }

    getTweets(keyword, callback) {
        new ProxyRequest(this.PROXY_BASE)
            .get('twitter')
            .data({query: keyword})
            .onSuccess((result) => {
                if (result && result.hasOwnProperty('search_metadata')) {
                    callback(result);
                } else {
                    callback({
                        hasError: true,
                        error: true
                    })
                }
            })
            .execute();
    }

    getFlickr(coords, callback) {
        new ProxyRequest(this.PROXY_BASE)
            .get('flickr')
            .data({lat: coords.lat(), lng: coords.lng()})
            .onSuccess((result) => {
                if (result && result.hasOwnProperty('stat')) {
                    callback(result.photos.photo);
                } else {
                    callback({
                        hasError: true,
                        error: true
                    })
                }
            })
            .execute();
    }

}
