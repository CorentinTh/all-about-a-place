import is from 'is_js'

export default class ProxyRequest {

    constructor(baseUrl) {
        this.api = '';
        this.baseUrl = baseUrl;
        this.settings = {
            type: 'get',
            error: () => console.error('ProxyRequest error with: ' + this.settings.url),
            success: (result) => console.log(result)
        };
    }

    get(api) {
        this.api = api;
        this.settings.type = 'get';
        return this;
    }

    post(api) {
        this.api = api;
        this.settings.type = 'post';
        return this;
    }

    data(data) {
        this.settings.data = data;
        return this;
    }

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

    onError(callback) {
        this.settings.error = callback;
        return this;
    }

    setErrorHandler() {
        this.settings.statusCode = {
            400: (url) => { console.log("Proxy manager: Error 400 bad request " + url); },
            401: (url) => { console.log("Proxy manager: Error 401 unauthorized " + url); },
            404: (url) => { console.log("Proxy manager: Error 404 page not found " + url); },
            500: (url) => { console.log("Proxy manager: Error 500 internal server error " + url); }
        }
    }

    setUrl() {
        this.settings.url = this.baseUrl.replace(/^\/+|\/+$/g, '') + "/" + this.api.replace(/^\/+|\/+$/g, '');
        return this;
    }

    execute() {
        this.setUrl();
        $.ajax(this.settings);
    }

}



