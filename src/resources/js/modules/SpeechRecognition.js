/**
 * Class that handle the HTML5 speech recognition API
 */
export default class SpeechRecognition {

    /**
     * Constructor of the class. Require the app element
     * @param app
     * @returns {SpeechRecognition}
     */
    constructor(app) {
        this.app = app;
        this._isAvailable = false;


        this.logger = console.log;

        this.setupRecognition();

        if (this.isAvailable()) {
            this.displayAndInitMicrophone();
        }

        return this;
    }

    /**
     * Function that setups the recognition
     */
    setupRecognition() {
        try {
            let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = true;
            this.recognition.lang = 'en-US';
            this._isAvailable = true;
            this.logger('[SpeechRecognition] Speech recognition available.');
        } catch (e) {
            console.error(e);
            console.error("Browser doesn't support speech recognition");
        }
    }

    /**
     * Check if the recognition API is available
     * @returns {boolean}
     */
    isAvailable() {
        return this._isAvailable;
    }

    /**
     * Handle the starting of the API
     * @returns {SpeechRecognition}
     */
    onStart() {
        this.logger('[SpeechRecognition] onStart triggered.');
        this.setMicrophoneIconOn();
        return this;
    }

    /**
     * Handle the ending of the API
     * @returns {SpeechRecognition}
     */
    onEnd() {
        this.logger('[SpeechRecognition] onEnd triggered.');
        this.setMicrophoneIconOff();
        return this;
    }

    /**
     * Handle the errors
     * @returns {SpeechRecognition}
     */
    onError(callback) {
        this.logger('[SpeechRecognition] onError triggered.');
        this.recognition.onerror = callback;
        return this;
    }

    /**
     * Function that handles the results. You get the spoken text here
     * @param event
     */
    onResults(event) {
        this.logger('[SpeechRecognition] onResults triggered.');

        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript;

        const matches = /(?:show me )(.*)/gi.exec(transcript);

        if (matches) {
            const place = matches[1];

            this.logger('[SpeechRecognition] City detected: ' + place);
            this.app.onPlaceChose({name: place});
            this.app.mainInput.setText(place);
        }
    }

    /**
     * Handles the begining of the recognition
     * @returns {SpeechRecognition}
     */
    startRecognition() {
        this.logger('[SpeechRecognition] starting recognition.');
        this.recognition.start();
        return this;
    }

    /**
     * Handles the end of the recognition
     * @returns {SpeechRecognition}
     */
    stopRecognition() {
        this.logger('[SpeechRecognition] stopping recognition.');
        this.recognition.stop();
        return this;
    }

    /**
     * Method that sets the microphone on listening mode
     */
    setMicrophoneIconOn() {
        $('#speak-button').html('<i class="fa fa-fw fa-microphone"></i>')
        $('#speak-hint').show();
    }

    /**
     * Method that sets the microphone off
     */
    setMicrophoneIconOff() {
        $('#speak-button').html('<i class="fa fa-fw fa-microphone-slash"></i>');
        $('#speak-hint').hide();
    }

    /**
     * Method that handles the clicks on the microphone icon
     */
    onMicrophoneClicked() {
        if (this.microIsOn) {
            this.stopRecognition()
        } else {
            this.startRecognition()
        }

        this.microIsOn = !this.microIsOn;
    }

    /**
     * Method that init the microphone and display the microphone icon
     */
    displayAndInitMicrophone() {
        $('#input-container').addClass(['input-group speak-allowed']);
        $('#speak-button-container').show();

        this.recognition.onstart = this.onStart.bind(this);
        this.recognition.onend = this.onEnd.bind(this);
        this.recognition.onresult = this.onResults.bind(this);


        $('#speak-button').click(this.onMicrophoneClicked.bind(this));
        this.microIsOn = false;
    }
}