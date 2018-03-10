import ReviewManager    from './ReviewManager';
import Templates        from './Templates';
import Slideshow        from './Slideshow';
import Chart            from 'chart.js/dist/Chart.bundle.min';

/**
 * Class that manages the user interface
 */
export default class UIManager {

    /**
     * Constructor of the class
     * @param tabscontainer
     * @param firebaseManager
     */
    constructor(tabscontainer, firebaseManager) {
        this.firebaseManager = firebaseManager;
        this.reviewManager = new ReviewManager(this.firebaseManager, this);

        this.tabsContainerID = tabscontainer;
        this.panelsContainerID = "#panels-container";
        this.navsContainerID = "#navs-container";

        this.tabConfig = {
            wikipedia: {
                title: 'Information',
                icon: '<i class="fab fa-fw fa-wikipedia-w"></i>'
            },
            weather: {
                title: 'Weather',
                icon: '<i class="fa fa-fw fa-sun"></i>'
            },
            twitter: {
                title: 'Twitter',
                icon: '<i class="fab fa-fw fa-twitter"></i>'
            },
            reviews: {
                title: 'Reviews',
                icon: '<i class="far fa-fw fa-file-alt"></i>'
            },
            flickr: {
                title: 'Flickr',
                icon: '<i class="fab fa-fw fa-flickr"></i>'
            }
        }
    }

    /**
     * Method that set the wikipedia information in the UI
     * @param text
     */
    setWikipediaText(text) {
        this.setInTab('wikipedia', text);
    }

    /**
     * Method that set the current weather information in the UI
     * @param data
     */
    setWeatherCurrent(data) {
        let html = '';

        if (data.cod) {
            html = Templates.getHtmlWeatherCurrent(data);
        } else {
            html = data;
        }

        this.remove('.current-weather');
        this.setInTab('weather', html, 'prepend');
    }

    /**
     * Method that set the weather forecast information in the UI
     * @param data
     */
    setWeatherForecast(data) {
        let html = '';

        if (data.cod) {
            html = '<div id="container-canvas-weather-forecast"><canvas id="canvas-weather-forecast"></canvas></div>';
            this.remove('#container-canvas-weather-forecast');
            this.setInTab('weather', html, 'append');
        } else {
            html = data;
            this.remove('#container-canvas-weather-forecast');
            this.setInTab('weather', html, 'append');
            return;
        }

        this.remove('#container-canvas-weather-forecast');
        this.setInTab('weather', html, 'append');

        const graphData = data.list.reduce((acc, data) => {
            acc.timestamps.push(data.dt * 1000);
            acc.temperature.push(data.main.temp);
            acc.humidity.push(data.main.humidity);
            return acc;
        }, {timestamps: [], humidity: [], temperature: []});


        if (this.forecastChart) {
            this.forecastChart.destroy();
        }

        this.forecastChart = new Chart('canvas-weather-forecast', {
            type: 'line',
            data: {
                labels: graphData.timestamps,
                datasets: [{
                    label: 'Temperature',
                    data: graphData.temperature,
                }]
            },
            options: {
                scales: {
                    xAxes: [{
                        type: "time",
                        display: true,
                        time: {
                            displayFormats: {
                                hour: 'DD/MM'
                            }
                        }
                    }],
                    yAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Temperature'
                        }
                    }]
                },
                legend: {
                    display: false,
                }
            }
        });

    }

    /**
     * Method that format the sentiment analysis of a tweet into a table
     * @param sentiments
     * @param tweetId
     * @param error
     */
    setSentimentToTweet(sentiments, tweetId, error) {

        const sentimentElement = $('#tweet-id-' + tweetId).find('.tweet-sentiments')[0];

        if (error) {
            $(sentimentElement).html(error);
            return;
        } else {
            $(sentimentElement).html(Templates.getSentimentTable(sentiments));
        }

    }

    /**
     * Method that set the tweets information in the UI
     * @param data
     */
    setTweets(data) {

        let html = Templates.getSentimentAnalysisOverview();


        for (const tweet of data) {
            //console.log(tweet);
            html += Templates.getTweet(tweet);
        }

        this.setInTab('twitter', html);
    }

    /**
     * Method that set the Flickr images in the UI
     * @param data
     */
    setFlickr(data) {
        if (data.length > 0) {
            let html = Templates.getSlideshow();
            this.setInTab('flickr', html);

            this.slideShow = new Slideshow('flick-slideshow-container', {
                buttonNextId:'flick-slideshow-button-next',
                buttonPrevId:'flick-slideshow-button-prev',
            });

            for (const img of data) {
                this.slideShow.addImage(img.url_m);
            }
        } else {
            this.setInTab('flickr', data);
        }

    }

    /**
     * Method that updates the sentiment analysis averages
     * @param sentiments
     */
    updateSentimentAnalysisOverview(sentiments) {
        $('#tweet-sentiment-overview-no-sentiment').hide();
        $('#tweet-sentiment-overview').show();

        let toPercent = (nb) => Math.floor(nb * 100);
        let tweetAmount = parseInt($('#tweet-amount').html()) + 1;
        $('#tweet-amount').html(tweetAmount);

        for (const sentiment in sentiments) {
            const el = `#tweet-sentiment-overview-bar-${sentiment}`;

            const newWidth = Math.floor((($(el).width() * (tweetAmount - 1)) + toPercent(sentiments[sentiment])) / tweetAmount);

            $(el).width(newWidth);
        }
    }

    /**
     * Method that display the reviews of a city
     * @param reviews
     */
    setReviews(reviews){
        let html = Templates.getReviewsHeader();

        console.log(reviews);

        let hasReview = false;
        for (let reviewID in reviews){
            if(reviews.hasOwnProperty(reviewID)){
                html += Templates.getReviewTemplate(reviews[reviewID]);
                hasReview = true;
            }
        }

        if(!hasReview){
            html += '<div class="text-center"><i>No reviews for this city</i></div>';
        }

        this.setInTab('reviews', html);
        $('#reviews-add-review-button').click(this.reviewManager.onAddReview.bind(this.reviewManager));

    }

    /**
     * Method to remove an element
     * @param id
     */
    remove(id) {
        $(id).remove();
    }

    /**
     * Method that permit to set information into a tab
     * @param tabName
     * @param text
     * @param append
     */
    setInTab(tabName, text, append) {
        const config = this.tabConfig[tabName];

        if (config) {
            let tab = $(this.tabsContainerID).find('#tab-panel-' + tabName);

            if (tab.length == 0) {
                this.createTab(tabName);
            }

            tab = $(this.tabsContainerID).find('#tab-panel-' + tabName);

            if (append) {
                if (append == 'prepend') {
                    $(tab).prepend(text);
                } else {
                    $(tab).append(text);
                }
            } else {
                $(tab).html(text);
            }

        } else {
            console.error('UIManager: Tab ' + tabName + ' do not have config.')
        }
    }

    /**
     * Method that create a tab given a tab name
     * @param tabName
     */
    createTab(tabName) {
        $(this.tabsContainerID).show();

        const tabsContainer = $(this.tabsContainerID).find(this.panelsContainerID)[0];
        const navsContainer = $(this.tabsContainerID).find(this.navsContainerID)[0];

        const amount = $(tabsContainer).children().length;

        $(navsContainer).append(`<li class="${amount == 0 ? 'active' : ''}" title="${this.tabConfig[tabName].title}"><a id='tab-nav-${tabName}' href='#tab-panel-${tabName}' data-toggle='tab'>${this.tabConfig[tabName].icon}</a></li>`);
        $(tabsContainer).append(`<div class='tab-pane fade ${amount == 0 ? 'active in' : ''}' id='tab-panel-${tabName}'></div>`);
    }

    /**
     * Method that removes all the tabs
     */
    cleanTabs() {
        const tabsContainer = $(this.tabsContainerID).find(this.panelsContainerID)[0];
        const navsContainer = $(this.tabsContainerID).find(this.navsContainerID)[0];

        $(tabsContainer).empty();
        $(navsContainer).empty();
    }
}