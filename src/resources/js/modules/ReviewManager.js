import Templates    from './Templates';
import is           from 'is_js';

/**
 * Class to mange the review system
 */
export default class ReviewManager {

    /**
     * Constructor of the class
     * @param firebaseManager
     * @param uiManager
     */
    constructor(firebaseManager, uiManager) {
        this.firebaseManager = firebaseManager;
        this.uiManager = uiManager;
        this.firebaseManager.onLoggedIn(this.onLoggedIn.bind(this));

        this.modalElement = $('#review-modal');
        this.reviewContentElement = $('#review-form-content');
        this.reviewEmailElement = $('#review-form-email');
        this.reviewNameElement = $('#review-form-name');

        $('#review-form-submit').click(this.onReviewSubmitted.bind(this));

        this.place = null;
        this.initLoginListenners();
    }

    /**
     * Method triggered when the user wants to add a review
     */
    onAddReview() {
        $('#review-place-name').html(' about <strong>' + this.place + '</strong>');
        this.showModal();
    }

    /**
     * Method triggered when the user has submitted a review
     */
    onReviewSubmitted() {
        const content = this.getContent();

        this.removeErrors();

        if (content.length < 20 || content.length > 600) {
            this.setError('Review text length must be less than 600 characters and more than 20 characters');
            return;
        }

        if (this.firebaseManager.isLoggedIn && this.firebaseManager.user) {
            this.firebaseManager.writeReviewToDB(this.place, content);
            this.onSuccessfullyCreatedReview(this.firebaseManager.user.displayName, content);

        } else {
            const credentials = this.getCredentials();

            if (is.all.empty(credentials.email, credentials.name)) {
                this.setError('You must be logged to create a review.');
                return;
            }

            if (is.empty(credentials.email)) {
                this.setError('Email not set.');
                return;
            }

            if (is.empty(credentials.name)) {
                this.setError('Name not set.');
                return;
            }

            if (is.not.email(credentials.email)) {
                this.setError('Email format incorrect');
                return;
            }

            if (credentials.name.length < 3) {
                this.setError('Your name should be longer than 2 characters');
                return;
            }

            this.firebaseManager.writeReviewToDB(this.place, content, credentials.name, credentials.email);
            this.onSuccessfullyCreatedReview(credentials.name, content);

        }
    }

    /**
     * Method triggered when a review has been successfully added
     * @param name
     * @param content
     */
    onSuccessfullyCreatedReview(name, content) {
        this.closeModal();

        $('#review-header').empty();
        $('#review-header').html('<div class="alert-success alert alert-dismissible"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>Review successfuly added.</div>');

        $(this.reviewContentElement).val('');

        this.uiManager.setInTab('reviews', Templates.getReviewTemplate(
            {
                username: name,
                content: content,
                timestamp: Date.now()
            }), 'append');
    }

    /**
     * Method to set an error message on the 'add a review' form
     * @param text
     */
    setError(text) {
        $('#review-form-error').append(text);
        $('#review-form-error').show();
    }

    /**
     * Method to remove error messages on the 'add a review' form
     */
    removeErrors() {
        $('#review-form-error').empty();
        $('#review-form-error').hide();
    }

    /**
     * Method to get the credential the user has entered in the form
     * @returns {{email: {String}, name: {String}}}
     */
    getCredentials() {
        return {
            email: $(this.reviewEmailElement).val(),
            name: $(this.reviewNameElement).val(),
        }
    }

    /**
     * Get the content of the review
     * @returns {String}
     */
    getContent() {
        return $(this.reviewContentElement).val();
    }

    /**
     * Show the modal of the review form
     */
    showModal() {
        $(this.modalElement).modal('show');
    }

    /**
     * Hide the modal of the review form
     */
    closeModal() {
        $(this.modalElement).modal('hide');
    }

    /**
     * Method triggered when the user has logged in
     * @param user
     */
    onLoggedIn(user) {
        $('#review-form-credentials').empty();
        $('#review-form-credentials').html(`<div class="text-center">Your are logged as <strong>${user.displayName}</strong></div>`);
    }

    /**
     * Method that binds the button to the proper firebase login function
     */
    initLoginListenners() {
        $('#login-via-google').click(this.firebaseManager.loginViaGoogle.bind(this.firebaseManager));
        $('#login-via-facebook').click(this.firebaseManager.loginViaFacebook.bind(this.firebaseManager));
        $('#login-via-twitter').click(this.firebaseManager.loginViaTwitter.bind(this.firebaseManager));
        $('#login-via-github').click(this.firebaseManager.loginViaGithub.bind(this.firebaseManager));
    }
}