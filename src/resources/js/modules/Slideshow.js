/**
 * Created by Corentin THOMASSET on 06/03/2018.
 */

export default class SlideShow {
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

    appendStyle(imgContainer) {
        $('head').append('<style>' + imgContainer + '{width:100%;height:300px;}' + imgContainer + ' img {height: 100%;width: 100%;margin: auto;object-fit: cover;}</style>');
    }

    stringToID(str) {
        if (str.substring(0, 1) != '#') {
            str = '#' + str;
        }

        return str;
    }

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

    addImages(urls) {
        for (let i = 0; i < urls.length; i++) {
            this.addImage(urls[i]);
        }

        return this;
    }

    nextImage() {
        let nextImg = $(this.currentImg).next();

        if (nextImg.length == 0) {
            nextImg = $(this.imgContainer).children().first();
        }

        return this.showImage(nextImg);
    }

    prevImage() {
        let nextImg = $(this.currentImg).prev();

        if (nextImg.length == 0) {
            nextImg = $(this.imgContainer).children().last();
        }

        return this.showImage(nextImg);
    }

    showImage(img) {
        // We hide the current image and show the image given as parameter
        $(this.currentImg).hide();
        $(img).show();

        // We set the current image to be the image given as parameter
        this.currentImg = img;

        this.currentImg.trigger('show');

        return img;
    }

    clearImage() {
        $(this.imgContainer).empty();

        return this;
    }

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