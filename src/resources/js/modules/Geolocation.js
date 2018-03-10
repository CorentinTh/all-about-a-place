/**
 * Class to retrieve the current user location
 */
export default class Geolocation {

    constructor() {
        this._isAvailable = navigator.geolocation != undefined;
    }

    isAvailable() {
        return this._isAvailable
    }

    /**
     * Method to retrieve the user current location
     * @param callback
     */
    getUserLocation(callback) {
        navigator.geolocation.getCurrentPosition(function (position) {
            console.log(position);

            const pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            callback(pos)
        });
    }
}