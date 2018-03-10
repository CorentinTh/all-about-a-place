/**
 * Class that manages the slideshow for the flickr images
 */
export default class SlideShow {
    /**
     * Constructor of the class that require the container element of the slideshow
     * @param imgContainer
     * @param options
     * @returns {SlideShow}
     */
    constructor(imgContainer, options) {
        if (imgContainer === undefined) {
            throw new Error('First param \'imgContainer\' must be set. Please set an image container.');
        }

        imgContainer = this.stringToID(imgContainer);

        this.imgContainer = imgContainer;
        this.currentImg = '';

        this.appendStyle(imgContainer);

        if (options != undefined) {
            this.manageOptions(options);
        }

        return this;
    }

    /**
     * Method that append the css of the slideshow to the head element
     * @param imgContainer
     */
    appendStyle(imgContainer) {
        $('#style-slideshow').remove();
        $('head').append('<style id="style-slideshow">' + imgContainer + '{width:100%;height:300px;}' + imgContainer + ' img {height: 100%;width: 100%;margin: auto;object-fit: cover;}</style>');
    }

    /**
     * Add a '#' a the beginning of a string if their is none
     * @param str
     * @returns {String}
     */
    stringToID(str) {
        if (str.substring(0, 1) != '#') {
            str = '#' + str;
        }

        return str;
    }

    /**
     * Add an image to the slideshow
     * @param url
     * @returns {*|jQuery|HTMLElement}
     */
    addImage(url) {

        // Creation of the image
        let img = $('<img src=\'' + url + '\' alt=\'image\'>');

        // We append the image to the image container
        $(this.imgContainer).append(img);

        // We hide the image if it's not the first child
        if (img.is(':first-child')) {
            this.currentImg = img;
        } else {
            img.hide();
        }

        return img;
    }

    /**
     * Add several images to the slideshow
     * @param urls
     * @returns {SlideShow}
     */
    addImages(urls) {
        for (let i = 0; i < urls.length; i++) {
            this.addImage(urls[i]);
        }

        return this;
    }

    /**
     * Show the next image
     * @returns {Image}
     */
    nextImage() {
        let nextImg = $(this.currentImg).next();

        if (nextImg.length == 0) {
            nextImg = $(this.imgContainer).children().first();
        }

        return this.showImage(nextImg);
    }

    /**
     * Show the previous image
     * @returns {Image}
     */
    prevImage() {
        let nextImg = $(this.currentImg).prev();

        if (nextImg.length == 0) {
            nextImg = $(this.imgContainer).children().last();
        }

        return this.showImage(nextImg);
    }

    /**
     * Display an image
     * @param img
     * @returns {Image}
     */
    showImage(img) {
        // We hide the current image and show the image given as parameter
        $(this.currentImg).hide();
        $(img).show();

        // We set the current image to be the image given as parameter
        this.currentImg = img;

        this.currentImg.trigger('show');

        return img;
    }

    /**
     * Empty the slideshow
     * @returns {SlideShow}
     */
    clearImage() {
        $(this.imgContainer).empty();

        return this;
    }

    /**
     * Function that manage the options
     * @param options
     */
    manageOptions(options) {
        if (options.hasOwnProperty('buttonNextId')) {
            $(this.stringToID(options.buttonNextId)).click(this.nextImage.bind(this));
        }

        if (options.hasOwnProperty('buttonPrevId')) {
            $(this.stringToID(options.buttonPrevId)).click(this.prevImage.bind(this));
        }

        if (options.hasOwnProperty('buttonClearId')) {
            $(this.stringToID(options.buttonClearId)).click(this.clearImage.bind(this));
        }
    }
}