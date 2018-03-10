import Marker from './Marker';

/**
 * Class to handle the map element
 */
export default class Map {

    /**
     * Creator of the class
     * @param google
     * @param id
     */
    constructor(google, id) {
        this.id = id;
        this.google = google;

        this.element = document.getElementById(this.id);
        this.map = {};
        this.markers = [];

        this.initMap();
    }

    /**
     * Function to initialize the map instance
     */
    initMap() {
        this.map = new this.google.maps.Map(this.element, {
            zoom: 4,
            center: {
                lat: 47.0,
                lng: 44.0
            },
            disableDefaultUI: true,
            gestureHandling: 'greedy'
        });
    }

    /**
     * Setting the center of the map
     * @param center
     */
    setCenter(center) {
        this.map.panTo(center);
    }

    /**
     * Method to offset the center of the map
     * @param center
     * @param offsetX
     * @param offsetY
     */
    offsetCenter(center, offsetX, offsetY) {
        const scale = Math.pow(2, this.map.getZoom());

        const worldCoordinateCenter = this.map.getProjection().fromLatLngToPoint(center);
        const pixelOffset = new this.google.maps.Point((offsetX / scale) || 0, (offsetY / scale) || 0);

        const worldCoordinateNewCenter = new this.google.maps.Point(
            worldCoordinateCenter.x - pixelOffset.x,
            worldCoordinateCenter.y + pixelOffset.y
        );

        const newCenter = this.map.getProjection().fromPointToLatLng(worldCoordinateNewCenter);

        this.setCenter(newCenter);
    }

    /**
     * Method to offset the center one forth of the window to the left, except if the window width is below 576px to make it responsive
     * @param center
     */
    centerOneForthLeft(center) {
        if($(window).width() <= 576){
            this.offsetCenter(center, 0, 0);
        }else{
            this.offsetCenter(center, Map.ONE_FOURTH_LEFT, 0);
        }
    }

    /**
     * Method to set the zoom level
     * @param level
     */
    setZoom(level) {
        this.map.setZoom(level);
    }


    /**
     * Method to set a marker on the map
     * @param coordinates
     * @param color
     * @param settings
     * @returns {Marker|*}
     */
    setMarker(coordinates, color, settings) {
        settings.map = this.map;
        settings.position = coordinates;

        if (color && color != '') {
            settings.color = color;
        }

        const marker = new Marker(this.google, settings);

        this.markers.push(marker);

        return marker.getGoogleMarker();
    }

    /**
     * Method to remove all markers on the map
     */
    removeMarkers(){
        this.markers.forEach((marker) => {
            marker.getGoogleMarker().setMap(null);
        });

        this.markers = [];
    }

    /**
     * @return {number}
     */
    static get ONE_FOURTH_LEFT() {
        return -$(window).width() / 4;
    }
}