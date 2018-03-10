import * as firebase from "firebase";

/**
 * Class that manage the firebase interaction
 */
export default class FirebaseManager {

    /**
     * Constructor
     * @param firebaseConfig
     */
    constructor(firebaseConfig) {
        this.initFirebase(firebaseConfig);
    }

    /**
     * Method to init the firebase element for the given configuration
     * @param firebaseConfig
     */
    initFirebase(firebaseConfig) {
        this.user = null;
        this.isLoggedIn = false;
        firebase.initializeApp(firebaseConfig);
    }

    /**
     * Method to register using credentials
     * @param credentials
     * @returns {Promise<any>|!firebase.Promise.<!firebase.User>}
     */
    loginViaCredentials(credentials) {
        return firebase.auth().createUserWithEmailAndPassword(credentials.email, credentials.password);
    }

    /**
     * Method to login via Google (OAuth)
     */
    loginViaGoogle() {
        const provider = new firebase.auth.GoogleAuthProvider();
        this.signingIn(provider);
    }

    /**
     * Method to login via Facebook (OAuth)
     */
    loginViaFacebook() {
        const provider = new firebase.auth.FacebookAuthProvider();
        provider.setCustomParameters({
            'display': 'popup'
        });
        this.signingIn(provider);
    }

    /**
     * Method to login via Github (OAuth)
     */
    loginViaGithub() {
        const provider = new firebase.auth.GithubAuthProvider();
        provider.setCustomParameters({
            'allow_signup': 'false'
        });
        this.signingIn(provider);
    }

    /**
     * Method to login via Twitter (OAuth)
     */
    loginViaTwitter() {
        const provider = new firebase.auth.TwitterAuthProvider();
        provider.setCustomParameters({
            lang: 'en'
        });
        this.signingIn(provider);
    }

    /**
     * Method to set the callback triggered when the user is logged in
     * @param callback
     */
    onLoggedIn(callback) {
        this.callback = callback;
    }

    /**
     * Method to set up the login request to the OAuth provider
     * @param provider
     */
    signingIn(provider) {
        firebase.auth().languageCode = 'en';
        firebase.auth().signInWithPopup(provider)
            .then((result) => {
                this.user = result.user;
                this.isLoggedIn = true;

                if (this.callback) {
                    this.callback(this.user);
                }
            })
            .catch((error) => {
                let errorCode = error.code;
                let errorMessage = error.message;
                let email = error.email;
                let credential = error.credential;

                if(errorCode == 'auth/account-exists-with-different-credential'){
                    alert('An account already exists with the same email address but different sign-in credentials. Sign in using a provider associated with this email address.');
                }

                console.log(`Signing in aborted. \nError code: ${errorCode}\nError message: ${errorMessage} `);
            });
    }

    /**
     * Method to write a review to the database
     * @param city
     * @param review
     * @param name
     * @param email
     */
    writeReviewToDB(city, review, name = null, email = null) {
        const newKey = firebase.database().ref().child('reviews').push().key;

        firebase.database().ref(`reviews/${city}/${newKey}`).set({
            content: review,
            username: name || this.user.displayName,
            email: email || this.user.email,
            timestamp: Date.now()
        });
    }

    /**
     * Method to get reviews from the database
     * @param city
     * @param callback
     * @returns {!firebase.Thenable.<*>|!firebase.Promise.<*>|Promise.<TResult>}
     */
    getReviewsByCity(city, callback){
        return firebase.database().ref(`reviews/${city}`).once('value').then(function(snapshot) {
            const reviews = snapshot.val();

            callback(reviews);
        });
    }
}




