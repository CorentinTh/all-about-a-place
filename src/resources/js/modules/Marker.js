/**
 * Class that permits to create customisable markers
 */
export default class Marker {

    /**
     * Constructor that requires the google object
     * @param google
     * @param settings Object containing the settings
     */
    constructor(google, settings) {
        this.google = google;

        if (settings.color){
            settings.icon = this.getMarkerImage(settings.color);
            delete settings.color;
        }

        this.marker = this.createMarker(settings)
    }

    /**
     * To change the marker color
     * @param color
     * @returns {google.maps.MarkerImage}
     */
    getMarkerImage(color) {
        return new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + color,
            new google.maps.Size(21, 34),
            new google.maps.Point(0, 0),
            new google.maps.Point(10, 34));
    }

    /**
     * To create the marker
     * @param settings
     * @returns {Marker}
     */
    createMarker(settings) {
        return new this.google.maps.Marker(settings);
    }

    /**
     * To get the google marker element
     * @returns {Marker|*}
     */
    getGoogleMarker(){
        return this.marker;
    }
}