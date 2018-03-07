/**
 * Created by Corentin THOMASSET on 26/02/2018.
 */

import Marker from './Marker';

export default class Map {

    constructor(google, id) {
        this.id = id;
        this.google = google;

        this.element = document.getElementById(this.id);
        this.map = {};
        this.markers = [];

        this.initMap();
    }

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

    setCenter(center) {
        this.map.panTo(center);
    }

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

    centerOneForthLeft(center) {
        if($(window).width() <= 576){
            this.offsetCenter(center, 0, 0);
        }else{
            this.offsetCenter(center, Map.ONE_FOURTH_LEFT, 0);
        }
    }

    setZoom(level) {
        this.map.setZoom(level);
    }


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