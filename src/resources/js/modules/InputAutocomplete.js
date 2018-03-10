/**
 * Class to create an input with autocompletion
 */
export default class InputAutocomplete {

    /**
     * Constructor of InputAutocomplete
     * @param id The id of the element that will handle the autocomplete
     * @returns {InputAutocomplete}
     */
    constructor(id) {
        this.id = id;
        this.element = document.getElementById(this.id);
        this.params = {};

        return this;
    }

    /**
     * Method to set the callback that will be triggered at the end of the autocompletion
     * @param callback
     * @returns {InputAutocomplete}
     */
    onAutocomplete(callback){
        this.callback = callback;
        return this;
    }

    /**
     * Method to set diverse params to the google element
     * @param params An object containing the params
     * @returns {InputAutocomplete}
     */
    setParams(params){
        this.params = params;
        return this;
    }

    /**
     * Method to change the text of the element
     * @param text
     * @return {InputAutocomplete}
     */
    setText(text){
        $(this.element).val(text);
        return this;
    }

    /**
     * The method to init the autocompleter using the google variable
     * @param google The google variable
     * @returns {InputAutocomplete}
     */
    init(google) {
        this.autocompleter = new google.maps.places.Autocomplete(this.element, this.params);
        google.maps.event.addListener(this.autocompleter, 'place_changed', () => {
            let place = this.autocompleter.getPlace();
            this.callback(place);
        });

        return this;
    }
}
