/**
 * Created by Corentin THOMASSET on 27/02/2018.
 */

export default class SpeechRecognition {

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

    isAvailable() {
        return this._isAvailable;
    }

    onStart() {
        this.logger('[SpeechRecognition] onStart triggered.');
        this.setMicrophoneIconOn();
        return this;
    }

    onEnd() {
        this.logger('[SpeechRecognition] onEnd triggered.');
        this.setMicrophoneIconOff();
        return this;
    }

    onError(callback) {
        this.logger('[SpeechRecognition] onError triggered.');
        this.recognition.onerror = callback;
        return this;
    }

    onResults(event) {
        this.logger('[SpeechRecognition] onResults triggered.');

        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript;

        const matches = /(?:show me )(.*)/gi.exec(transcript);

        if(matches){
            const place = matches[1];

            this.logger('[SpeechRecognition] City detected: ' + place);
            this.app.onPlaceChose({name:place});
            this.app.mainInput.setText(place);
        }

    }

    startRecognition() {
        this.logger('[SpeechRecognition] starting recognition.');
        this.recognition.start();
        return this;
    }

    stopRecognition() {
        this.logger('[SpeechRecognition] stopping recognition.');
        this.recognition.stop();
        return this;
    }

    setMicrophoneIconOn() {
        $('#speak-button').html('<i class="fa fa-fw fa-microphone"></i>')
        $('#speak-hint').show();
    }

    setMicrophoneIconOff() {
        $('#speak-button').html('<i class="fa fa-fw fa-microphone-slash"></i>');
        $('#speak-hint').hide();
    }

    onMicrophoneClicked() {
        if (this.microIsOn) {
            this.stopRecognition()
        } else {
            this.startRecognition()
        }

        this.microIsOn = !this.microIsOn;
    }

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