/**
 * Created by Corentin THOMASSET on 06/03/2018.
 */

import * as firebase from "firebase";

export default class FirebaseManager {

    constructor(firebaseConfig) {
        this.initFirebase(firebaseConfig);
    }

    initFirebase(firebaseConfig) {
        this.user = null;
        this.isLoggedIn = false;
        firebase.initializeApp(firebaseConfig);
    }

    loginViaCredentials(credentials) {
        return firebase.auth().createUserWithEmailAndPassword(credentials.email, credentials.password);
    }

    onLoggedIn(callback) {
        this.callback = callback;
    }

    loginViaGoogle() {
        const provider = new firebase.auth.GoogleAuthProvider();
        this.signingIn(provider);
    }

    loginViaFacebook() {
        const provider = new firebase.auth.FacebookAuthProvider();
        provider.setCustomParameters({
            'display': 'popup'
        });
        this.signingIn(provider);
    }

    loginViaGithub() {
        const provider = new firebase.auth.GithubAuthProvider();
        provider.setCustomParameters({
            'allow_signup': 'false'
        });
        this.signingIn(provider);
    }

    loginViaTwitter() {
        const provider = new firebase.auth.TwitterAuthProvider();
        provider.setCustomParameters({
            lang: 'en'
        });
        this.signingIn(provider);
    }

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

    writeReviewToDB(city, review, name = null, email = null) {

        const newKey = firebase.database().ref().child('reviews').push().key;

        firebase.database().ref(`reviews/${city}/${newKey}`).set({
            content: review,
            username: name || this.user.displayName,
            email: email || this.user.email,
            timestamp: Date.now()
        });
    }


    getReviewsByCity(city, callback){
        return firebase.database().ref(`reviews/${city}`).once('value').then(function(snapshot) {
            const reviews = snapshot.val();

            callback(reviews);
        });
    }
}




