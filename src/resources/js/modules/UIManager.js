/**
 * Created by Corentin THOMASSET on 23/02/2018.
 */

import ReviewManager    from './ReviewManager';
import Templates        from './Templates';
import Slideshow        from './Slideshow';
import Chart            from 'chart.js/dist/Chart.bundle.min';

export default class UIManager {

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

    setWikipediaText(text) {
        this.setInTab('wikipedia', text);
    }

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

    setSentimentToTweet(sentiments, tweetId, error) {

        const sentimentElement = $('#tweet-id-' + tweetId).find('.tweet-sentiments')[0];

        if (error) {
            $(sentimentElement).html(error);
            return;
        } else {
            $(sentimentElement).html(Templates.getSentimentTable(sentiments));
        }

    }

    setTweets(data) {

        let html = Templates.getSentimentAnalysisOverview();


        for (const tweet of data) {
            //console.log(tweet);
            html += Templates.getTweet(tweet);
        }

        this.setInTab('twitter', html);
    }

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


    remove(id) {
        $(id).remove();
    }

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


    createTab(tabName) {
        $(this.tabsContainerID).show();

        const tabsContainer = $(this.tabsContainerID).find(this.panelsContainerID)[0];
        const navsContainer = $(this.tabsContainerID).find(this.navsContainerID)[0];

        const amount = $(tabsContainer).children().length;

        $(navsContainer).append(`<li class="${amount == 0 ? 'active' : ''}" title="${this.tabConfig[tabName].title}"><a id='tab-nav-${tabName}' href='#tab-panel-${tabName}' data-toggle='tab'>${this.tabConfig[tabName].icon}</a></li>`);
        $(tabsContainer).append(`<div class='tab-pane fade ${amount == 0 ? 'active in' : ''}' id='tab-panel-${tabName}'></div>`);
    }

    cleanTabs() {
        const tabsContainer = $(this.tabsContainerID).find(this.panelsContainerID)[0];
        const navsContainer = $(this.tabsContainerID).find(this.navsContainerID)[0];

        $(tabsContainer).empty();
        $(navsContainer).empty();
    }
}