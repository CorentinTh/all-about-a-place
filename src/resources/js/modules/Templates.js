/**
 * Created by Corentin THOMASSET on 25/02/2018.
 */

import moment from 'moment'

moment.updateLocale('en', {
    relativeTime: {
        future: 'in %s',
        past: '%s ago',
        s: 's',
        ss: '%ss',
        m: '1m',
        mm: '%dm',
        h: 'an hour',
        hh: '%dh',
        d: '1d',
        dd: '%dd',
        M: '1M',
        MM: '%dM',
        y: '1Y',
        yy: '%dY'
    }
});


export default class Templates {

    static getReviewTemplate(review){
        return `
<div class="review-container">
    <div><strong>${review.username}</strong><span class="text-muted"> - ${moment(review.timestamp).fromNow()}</span></div>
    <div style="margin-bottom: 10px">${review.content}</div>
</div>

`;
    }

    static getReviewsHeader(){
        return `
<div id="review-header">
    <div class="text-center"><strong>Reviews </strong> are appreciation feedback given by real users</div>
    <div class="text-center" style="margin-top:10px"><button id="reviews-add-review-button" class="btn btn-sm btn-success">Add a review <i class="fa fa-chevron-right"></i></button></div>
<hr>
</div>
`;
    }

    static getTweet(data) {
        return `
<div class="tweet-container" id="tweet-id-${data.id}">

    <div class="tweet-pp">
        <a href="https://twitter.com/${data.user.screen_name}"><img src="${data.user.profile_image_url_https}" alt="tweet-pp"></a>
    </div>

    <div class="tweet-content">
        <div class="tweet-header">
            <strong>${data.user.name}</strong> <a href="https://twitter.com/${data.user.screen_name}">@${data.user.screen_name}</a> - ${moment(new Date(data.created_at)).fromNow()}
        </div>
        <span class="tweet-text">${data.text}</span>
    </div>
    
    <div class="tweet-sentiments">
        
    </div>
</div>
`;
    }

    static getSentimentTable(data){

        let toPercent = (nb) => Math.floor(nb * 100);

        return `
<table>
    <tr class="tweet-sentiment-joy">
            <td>Joy: </td>
            <td>${toPercent(data.joy)}%</td>
    </tr>
    <tr class="tweet-sentiment-sadness">
            <td>Sad.: </td>
            <td>${toPercent(data.sadness)}%</td>
    </tr>
    <tr class="tweet-sentiment-fear">
            <td>Fear: </td>
            <td>${toPercent(data.fear)}%</td>
    </tr>
    <tr class="tweet-sentiment-disgust">
            <td>Disgust: </td>
            <td>${toPercent(data.disgust)}%</td>
    </tr>
    <tr class="tweet-sentiment-anger">
            <td>Anger: </td>
            <td>${toPercent(data.anger)}%</td>
    </tr>
</table>
`;
    }

    static getSentimentAnalysisOverview(){
        return `
<div id="tweet-sentiment-overview-container">
    <div class="text-center" id="tweet-sentiment-overview-no-sentiment"><i>No sentiment analysis could be proceed for the given tweets.</i></div>
    
    <div id="tweet-sentiment-overview" style="display: none">
        <div>Average sentiment analysis for <span id="tweet-amount">0</span> tweets:</div>
        
        <table>
            <tr>
                <td>joy</td>
                <td><div class="tweet-sentiment-overview-bar-wrapper"><div id="tweet-sentiment-overview-bar-joy"></div></div></td>
            </tr>
            <tr>
                <td>sadness</td>
                <td><div class="tweet-sentiment-overview-bar-wrapper"><div id="tweet-sentiment-overview-bar-sadness"></div></div></td>
            </tr>
            <tr>
                <td>anger</td>
                <td><div class="tweet-sentiment-overview-bar-wrapper"><div id="tweet-sentiment-overview-bar-anger"></div></div></td>
            </tr>
            <tr>
                <td>disgust</td>
                <td><div class="tweet-sentiment-overview-bar-wrapper"><div id="tweet-sentiment-overview-bar-disgust"></div></div></td>
            </tr>
            <tr>
                <td>fear</td>
                <td><div class="tweet-sentiment-overview-bar-wrapper"><div id="tweet-sentiment-overview-bar-fear"></div></div></td>
            </tr>
            
        </table>

    </div>
</div>
`
    }

    static getHtmlWeatherCurrent(data) {

        let icon = '';

        switch (data.weather[0].icon) {
            case '01d':
                icon = '<i class=\'wi wi-day-sunny\'></i>';
                break;
            case '01n':
                icon = '<i class=\'wi wi-night-clear\'></i>';
                break;
            case '02d':
                icon = '<i class=\'wi wi-day-cloudy\'></i>';
                break;
            case '02n':
                icon = '<i class=\'wi wi-night-cloudy\'></i>';
                break;
            case '03d':
                icon = '<i class=\'wi wi-cloud\'></i>';
                break;
            case '03n':
                icon = '<i class=\'wi wi-cloud\'></i>';
                break;
            case '04d':
                icon = '<i class=\'wi wi-cloudy\'></i>';
                break;
            case '04n':
                icon = '<i class=\'wi wi-cloudy\'></i>';
                break;
            case '09d':
                icon = '<i class=\'wi wi-rain\'></i>';
                break;
            case '09n':
                icon = '<i class=\'wi wi-rain\'></i>';
                break;
            case '10d':
                icon = '<i class=\'wi wi-day-rain\'></i>';
                break;
            case '10n':
                icon = '<i class=\'wi wi-night-rain\'></i>';
                break;
            case '11d':
                icon = '<i class=\'wi wi-thunderstorm\'></i>';
                break;
            case '11n':
                icon = '<i class=\'wi wi-thunderstorm\'></i>';
                break;
            case '13d':
                icon = '<i class=\'wi wi-day-snow\'></i>';
                break;
            case '13n':
                icon = '<i class=\'wi wi-night-snow\'></i>';
                break;
            case '50d':
                icon = '<i class=\'wi wi-fog\'></i>';
                break;
            case '50n':
                icon = '<i class=\'wi wi-fog\'></i>';
                break;

        }

        return `
<div class='current-weather'> 
    <div> 
        <div class='w-icon'> 
            ${icon}
        </div> 
        <div class='w-info'> 
            <strong>${data.weather[0].description.capitalize()}</strong> 
            <p class='temp'>${data.main.temp}°C</p> 
        </div> 
    </div> 
    <div> 
        <div class='w-details'> 
            <table> 
                <tr> 
                    <td class='w-details-head'><i class=\'wi wi-wind\'></i></td> 
                    <td>${data.wind.speed} m/s <i class='wi wi-wind towards-${data.wind.deg}-deg'></i> ${data.wind.deg}°</td> 
                    <td class='w-details-head'><i class=\'wi wi-sunrise\'></i></td> 
                    <td>${new Date(data.sys.sunrise * 1000).toLocaleTimeString()}</td> 
                </tr> 
                <tr> 
                    <td class='w-details-head'><i class=\'wi wi-humidity\'></i></td> 
                    <td>${data.main.humidity}%</td> 
                    <td class='w-details-head'><i class=\'wi wi-sunset\'></i></td> 
                    <td>${new Date(data.sys.sunset * 1000).toLocaleTimeString()}</td>                    
                </tr> 
                <tr> 
                    <td class='w-details-head'><i class=\'wi wi-barometer\'></i></td> 
                    <td>${data.main.pressure} hpa</td> 
                    <td class='w-details-head'><i class=\'wi wi-cloud\'></i></td> 
                    <td>${data.clouds.all}%</td> 
                </tr> 
            </table> 
        </div> 
    </div> 
</div>
`;
    }

    static getSlideshow() {
        return `
<div id="flick-slideshow-wrapper">
    <div id="flick-slideshow-container"></div>
    <button id="flick-slideshow-button-prev" class="btn"><i class="fa fa-chevron-left"></i></button>
    <button id="flick-slideshow-button-next" class="btn"><i class="fa fa-chevron-right"></i></button>
</div>`;
    }
}


/*
 return `
 <div class='current-weather'>
 <div>
 <div class='w-icon'>
 ${icon}
 </div>
 <div class='w-info'>
 <strong>${data.weather[0].description.capitalize()}</strong>
 <p class='temp'>${data.main.temp}°C</p>
 </div>
 </div>
 <div>
 <div class='w-details'>
 <table>
 <tr>
 <td class='w-details-head'>Wind</td>
 <td>${data.wind.speed} m/s <i class='wi wi-wind towards-${data.wind.deg}-deg'></i> ${data.wind.deg}°</td>
 </tr>
 <tr>
 <td class='w-details-head'>Humidity</td>
 <td>${data.main.humidity}%</td>
 </tr>
 <tr>
 <td class='w-details-head'>Pressure</td>
 <td>${data.main.pressure} hpa</td>
 </tr>
 <tr>
 <td class='w-details-head'>Cloudiness</td>
 <td>${data.clouds.all}%</td>
 </tr>
 </table>
 </div>
 </div>
 </div>
 `;



 */