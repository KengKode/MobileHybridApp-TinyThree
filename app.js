
var tweet = function(){

    var myList;

    var init = function() {

        $('#tweetPage').live('pageinit', function() {
            myList = $('#myTweetList');

            $('#tweetSearchButton').bind('click', function(e) {
                console.log('searching for tweets ...');
                searchTweet($('#tweetSearch').val());
                // testTemplate();
            });

        });

    };

    var testTemplate = function() {
        var source   = $('#list-template').html();
        var template = Handlebars.compile(source);
        var context = { items:[
            {name: 'A', age:10},
            {name: 'B', age:20},
            {name: 'C', age:30},
            {name: 'D', age:40},
            {name:'E', age:50}
            ]};
        var html    = template(context);
        myList.html(html).listview('refresh');        
    };

    var searchTweet = function(search) {

        $.mobile.showPageLoadingMsg();

        var keyword = "" || search;

        $.ajax({

            type: 'GET',
            url: 'http://search.twitter.com/search.json',
            data: {q: keyword},
            dataType: 'jsonp'

        }).success(function(data){

            if (data.results) {
                var template = Handlebars.compile($('#tweet-template').html());
                myList.empty();

                $.each(data.results, function(i,item){
                    var tweet = item;
                    tweet.timeAgo = timeAgo(tweet.created_at);


                    var html = template(tweet);
                    myList.append(html);
                });
                myList.listview('refresh');
            }
            console.log('success');

        }).error(function(jqXHR, textStatus, errorThrown){
            alert("error: "+errorThrown);

        }).complete(function(){
            $.mobile.hidePageLoadingMsg();
        });

    };

    timeAgo = function(dateString) {
        var rightNow = new Date(),
            then = new Date(dateString),
            diff = rightNow - then,
            second = 1000,
            minute = second * 60,
            hour = minute * 60,
            day = hour * 24,
            week = day * 7;

        // return blank string if unknown
        if (isNaN(diff) || diff < 0) {
            return "";
        }

        // within 2 seconds
        if (diff < second * 2) {
            return "now";
        }

        if (diff < minute) {
            return Math.floor(diff / second) + "s";
        }

        if (diff < hour) {
            return Math.floor(diff / minute) + "m";
        }

        if (diff < day) {
            return  Math.floor(diff / hour) + "h";
        }

        if (diff < day * 365) {
            return Math.floor(diff / day) + "d";
        }
        else {
            return "yr+";
        }
    };

    return {
        init : init()

    };

}();

var flickr = function(){

    var myList;

    var init = function() {

        $('#flickrPage').live('pageinit', function() {
            myList = $('#myFlickrList');

            $('#flickrSearchButton').bind('click', function(e) {
                console.log('searching for flickrs ...');
                searchFlickr($('#flickrSearch').val());
                // testTemplate();
            });

        });

    };

    var searchFlickr = function(search) {

        $.mobile.showPageLoadingMsg();

        var keyword = "" || search;

        $.ajax({

            type: 'GET',
            url: 'http://api.flickr.com/services/feeds/photos_public.gne',
            data: {
                    tags: keyword,
                    tagmode: "any",
                    format: "json"
            },
            dataType: 'jsonp',
            jsonp: 'jsoncallback'

        }).success(function(data){

            if (data.items) {
                var template = Handlebars.compile($('#flickr-template').html());
                myList.empty();

                $.each(data.items, function(i,item){
                    var flickr = item;
                    flickr.timeAgo = timeAgo(flickr.date_taken);


                    var html = template(flickr);
                    $(html).bind('tap', function(e){
                        e.stopPropagation();
                        showBigImage(item);
                        return true;
                    }).appendTo(myList);
                    //myList.append(html);
                });
                //myList.grid();
            }
            console.log('success');

        }).error(function(jqXHR, textStatus, errorThrown){
            alert("error: "+errorThrown);

        }).complete(function(){
            $.mobile.hidePageLoadingMsg();
        });

    };

    var showBigImage = function(item) {
        console.log('picurl: '+item.media.m);

        if ($('body div[data-role="page"][id="imagePage"]').length == 0) {
            var imagePage = $('<div id="imagePage" data-role="page" data-fullscreen="true" data-add-back-btn="true">');
            imagePage.append($('<div data-role="header" data-position="fixed">').html('<h1 id="imageName">ImageName</h1>'));
            imagePage.append($('<div data-role="content">').html('<img id="bigImage">'));
            imagePage.append($('<div data-role="footer" data-position="fixed">').html('<h4 id="authorBy">by whom</h4>'));
            imagePage.appendTo($('body'));
            imagePage.page();           
        }

        $('#imageName').html(item.title);
        $('#authorBy').html(item.author);
        $('#imagePage').css('background-image', "url('"+item.media.m+"')")
        .css('background-color', '#000')
        .css('background-size','contain')
        .css('background-position', 'center')
        .css('background-repeat','no-repeat').page();

        $.mobile.changePage('#imagePage', {
            transition: 'fade'
        });
    };

    return {
        init : init()

    };

}();

var weather = function(){

    var myList;

    var init = function() {

        $('#weatherPage').live('pageinit', function() {
            myList = $('#myWeatherList');

            $('#weatherSearchButton').bind('click', function(e) {
                console.log('searching for weathers ...');
                searchWeather($('#weatherSearch').val());
                // testTemplate();
            });

        });

    };

    var searchWeather = function(search) {

        $.mobile.showPageLoadingMsg();

        var keyword = "" || search;

        $.ajax({

            type: 'GET',
            url: 'http://free.worldweatheronline.com/feed/weather.ashx',
            data: {q: keyword, format:'json', num_of_days:'5', key:'a2f2d74f75072819121708'},
            dataType: 'jsonp'

        }).success(function(data){

            if (data.data.weather) {
                var template = Handlebars.compile($('#weather-template').html());
                myList.empty();

                $.each(data.data.weather, function(i,item){
                    var weather = item;         
                    if (i===0 && data.data.current_condition[0]) {
                        weather = data.data.current_condition[0];
                        weather.date = new Date();
                    }
                    weather.iconUrl = weather.weatherIconUrl[0].value;
                    weather.dayOfWeek = dayOfWeek(weather.date);


                    var html = template(weather);
                    myList.append(html);
                }); 

                myList.listview('refresh');
            }
            console.log('success');

        }).error(function(jqXHR, textStatus, errorThrown){
            alert("error: "+errorThrown);

        }).complete(function(){
            $.mobile.hidePageLoadingMsg();
        });

    };

    dayOfWeek = function(dateString){
        var d = new Date(dateString),
            days = [ 'Sun','Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ],
            day = days[d.getDay()];
        return day;
    };

    return {
        init : init()

    };

}();



