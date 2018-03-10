import is from 'is_js'

/**
 * Class to easily send a request to the proxy server
 */
export default class ProxyRequest {

    /**
     * Constrctor of the class
     * @param baseUrl The base url of the proxy server
     */
    constructor(baseUrl) {
        this.api = '';
        this.baseUrl = baseUrl;
        this.settings = {
            type: 'get',
            error: () => console.error('ProxyRequest error with: ' + this.settings.url),
            success: (result) => console.log(result)
        };
    }

    /**
     * Method to get a response from an api through the proxy
     * @param api
     * @returns {ProxyRequest}
     */
    get(api) {
        this.api = api;
        this.settings.type = 'get';
        return this;
    }

    /**
     * Method to post data to an api through the proxy
     * @param api
     * @returns {ProxyRequest}
     */
    post(api) {
        this.api = api;
        this.settings.type = 'post';
        return this;
    }

    /**
     * Set the data to set or post
     * @param data
     * @returns {ProxyRequest}
     */
    data(data) {
        this.settings.data = data;
        return this;
    }

    /**
     * Setting the success callback
     * @param callback
     * @returns {ProxyRequest}
     */
    onSuccess(callback) {
        if (callback && is.function(callback)) {

            this.settings.success = (result) => {
                let data = {};

                try {
                    data = JSON.parse(result);

                } catch (e) {
                    //console.error("ProxyRequest: response was not json.");

                    data = {
                        hasError: true,
                        error: true
                    };
                }

                callback(data);
            }
        }
        return this;
    }

    /**
     * Setting the error callback
     * @param callback
     * @returns {ProxyRequest}
     */
    onError(callback) {
        this.settings.error = callback;
        return this;
    }

    /**
     * Handle http errors
     */
    setErrorHandler() {
        this.settings.statusCode = {
            400: (url) => { console.log("Proxy manager: Error 400 bad request " + url); },
            401: (url) => { console.log("Proxy manager: Error 401 unauthorized " + url); },
            404: (url) => { console.log("Proxy manager: Error 404 page not found " + url); },
            500: (url) => { console.log("Proxy manager: Error 500 internal server error " + url); }
        }
    }

    /**
     * Getting the complete url
     * @returns {ProxyRequest}
     */
    setUrl() {
        this.settings.url = this.baseUrl.replace(/^\/+|\/+$/g, '') + "/" + this.api.replace(/^\/+|\/+$/g, '');
        return this;
    }

    /**
     * Execute the request to the proxy
     */
    execute() {
        this.setUrl();
        $.ajax(this.settings);
    }

}



