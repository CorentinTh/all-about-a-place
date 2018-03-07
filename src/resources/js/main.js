
import 'bootstrap';
import '../../vendors/font-awesome/font-awesome'
import GoogleMapsLoader from 'google-maps';
import ApplicationManager from './modules/ApplicationManager';
import ProxyRequest from './modules/ProxyRequest';

String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

let BASE_URL = '';

if (location.host == 'localhost:1234') {
    BASE_URL = 'http://api-project.local/api/';
} else {
    BASE_URL = location.protocol + '//' + location.host + location.pathname + '/api/';
    console.log = () => {};
}

const app = new ApplicationManager({baseUrl: BASE_URL});

new ProxyRequest(BASE_URL).get('get-api-key').data({api: 'google-maps'}).onSuccess(initGoogleMaps).execute();

function initGoogleMaps(data) {
    const firebaseConfig = JSON.parse(data.firebase);

    GoogleMapsLoader.KEY = data.key;
    GoogleMapsLoader.LIBRARIES = ['geometry', 'places'];
    GoogleMapsLoader.LANGUAGE = 'en';

    GoogleMapsLoader.load(function (google) {
        app.initComponents(google, firebaseConfig);
    });
}
