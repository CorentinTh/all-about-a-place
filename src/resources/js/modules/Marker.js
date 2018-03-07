/**
 * Created by Corentin THOMASSET on 27/02/2018.
 */

export default class Marker {

    constructor(google, settings) {
        this.google = google;

        if (settings.color){
            settings.icon = this.getMarkerImage(settings.color);
            delete settings.color;
        }

        this.marker = this.createMarker(settings)
    }

    getMarkerImage(color) {
        return new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + color,
            new google.maps.Size(21, 34),
            new google.maps.Point(0, 0),
            new google.maps.Point(10, 34));
    }

    createMarker(settings) {
        return new this.google.maps.Marker(settings);
    }

    getGoogleMarker(){
        return this.marker;
    }
}