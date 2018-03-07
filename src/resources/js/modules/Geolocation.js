/**
 * Created by Corentin THOMASSET on 06/03/2018.
 */

export default class Geolocation {

    constructor() {
        this._isAvailable = navigator.geolocation != undefined;
    }

    isAvailable() {
        return this._isAvailable
    }

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