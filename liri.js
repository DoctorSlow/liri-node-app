//setting up require functions for node.js packages
require("dotenv").config();
var request = require('request');
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
// fs is a core Node package for reading and writing files
var fs = require("fs");
// passing the env. keys to js for API access/functionality
var keys = require('./keys.js');

// codes required to import the Spotify & Twitter keys
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

//setting input variables and accounting for multi-word inputs
var command = process.argv[2];
var inputName = process.argv[3];
// var inputName = inputName.replace(' ', '+');

//setting up a switch-case statement to accommodate multiple commands
switch (command) {
    case "my-tweets":
        myTweets();
        break;

    case "spotify-this-song":
        spotifyThisSong();
        break;

    case "movie-this":
        movieThis();
        break;

    case "do-what-it-says":
        doWhatItSays();
}

// `node liri.js my-tweets`
// Show your last 20 tweets and when they were created at in your terminal/bash window.
function myTweets() {
    var params = {
        screen_name: 'doctorslow',
    };
    client.get('statuses/user_timeline/', params, function (error, tweets, response) {
        if (!error) {
            console.log(tweets);
        }
    });
}


// function spotifyThisSong() {}
// `node liri.js spotify-this-song '<song name here>'`
// * If no song is provided then your program will default to "The Sign" by Ace of Base.
function spotifyThisSong() {
    spotify.search({
        type: 'track',
        query: inputName,
    }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        console.log("Artist: " + data.tracks.items[0].artists.name);
        console.log("Song: " + data.tracks.items[0].name);
        console.log("Preview link: " + data.tracks.items[0].preview_url);
        console.log("Album: " + data.tracks.items[0].album.name);
    });
}


// `node liri.js movie-this '<movie name here>'`
// * If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.'
function movieThis() {
    request("http://www.omdbapi.com/?t=" + inputName + "&y=&plot=short&apikey=trilogy", function (error, response, body) {
        if (!error && response.statusCode === 200) {
            // console.log(request);
            console.log("Title: " + JSON.parse(body).Title);
            console.log("Released on: " + JSON.parse(body).Released);
            console.log("Rated: " + JSON.parse(body).Rated);
            console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
            console.log("Released in: " + JSON.parse(body).Country);
            console.log("Language(s): " + JSON.parse(body).Language);
            console.log("Plot summary: " + JSON.parse(body).Plot);
            console.log("Starring: " + JSON.parse(body).Actors);
        };

    });
}


// `node liri.js do-what-it-says`
function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        // If the code experiences any errors it will log the error to the console.
        if (error) {
            return console.log(error);
        }
        // We will then print the contents of data
        console.log(data);
        // Then split it by commas (to make it more readable)
        var dataArr = data.split(",");
        // We will then re-display the content as an array for later use.
        console.log(dataArr);
        var doItInput = console.log("node liri.js " + dataArr[0] + " " + dataArr[1]);
    });

    function doIt(doItInput) {}
};

// ### BONUS
// * In addition to logging the data to your terminal/bash window, output the data to a .txt file called `log.txt`.
// * Make sure you append each command you run to the `log.txt` file. 
// * Do not overwrite your file each time you run a command.

console.log(process.argv);