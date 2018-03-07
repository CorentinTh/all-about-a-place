/**
 * Created by Corentin THOMASSET on 23/02/2018.
 */

export default class InputAutocomplete {

    constructor(id) {
        this.id = id;
        this.element = document.getElementById(this.id);
        this.params = {};

        return this;
    }

    onAutocomplete(callback){
        this.callback = callback;
        return this;
    }

    setParams(params){
        this.params = params;
        return this;
    }

    setText(text){
        $(this.element).val(text);
    }

    init(google) {
        this.autocompleter = new google.maps.places.Autocomplete(this.element, this.params);
        google.maps.event.addListener(this.autocompleter, 'place_changed', () => {
            let place = this.autocompleter.getPlace();
            this.callback(place);
        });

        return this;
    }
}
