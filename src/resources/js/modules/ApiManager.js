import ProxyRequest from './ProxyRequest'

/**
 * Class that add another level of abstraction for the requests to the proxy server
 */
export default class ApiManager {

    /**
     * Constructor
     * @param proxyBase The base
     */
    constructor(proxyBase) {
        this.PROXY_BASE = proxyBase;
    }

    /**
     * Method to get the sentiment analysis of a string
     * @param text
     * @param callback
     * @param targets
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
     * Method to get wikipedia information of a place using Geonames API
     * @param placename
     * @param callback
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

    /**
     * Method to get wikipedia information of a place using Wikipedia API
     * @param query
     * @param callback
     */
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

    /**
     * Method to get the current weather of a place
     * @param place
     * @param callback
     */
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

    /**
     * Method to get the weather forecast of a place
     * @param place
     * @param callback
     */
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

    /**
     * Method to get the tweet for a keyword
     * @param keyword
     * @param callback
     */
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

    /**
     * Method to get Flickr images for given coordinates
     * @param coords
     * @param callback
     */
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
