require("dotenv").config();
var request = require("request");

// codes required to import the Spotify & Twitter keys
var spotify = new Spotify(keys.spotify);
// var client = new Twitter(keys.twitter);

var command = process.argv[2];
var movieName = process.argv[3];
var movieName = movieName.replace(' ', '+');
var songName = songName.replace(' ', '+');

switch (command) {
    //     case "my-tweets":
    //         myTweets();
    //         break;

    case "spotify-this-song":
        spotifyThisSong();
        break;

    case "movie-this":
        movieThis();
        break;

        //     case "do-what-it-says":
        // doWhatItSays();
}

// function myTweets() {}

// `node liri.js my-tweets`
//    Show your last 20 tweets and when they were created at in your terminal/bash window.

function spotifyThisSong() {
    request("https://api.spotify.com/v1/searchq=" + songName + "&type=track", function (error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log(request);
            console.log("Artist: " + JSON.parse(body).artists);
            console.log("Song: " + JSON.parse(body).name);
            console.log("Preview link: " + JSON.parse(body).preview_url);
            console.log("Album: " + JSON.parse(body).album);
        }
    })
}
// function spotifyThisSong() {}
// `node liri.js spotify-this-song '<song name here>'`
//    * If no song is provided then your program will default to "The Sign" by Ace of Base.

function movieThis() {
    request("http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy", function (error, response, body) {
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
// `node liri.js movie-this '<movie name here>'`
//    * If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.'

// function doWhatItSays() {}
// `node liri.js do-what-it-says`
//    * Using the `fs` Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.   
//      * It should run `spotify-this-song` for "I Want it That Way," as follows the text in `random.txt`.    
//      * Feel free to change the text in that document to test out the feature for other commands.


// ### BONUS
// * In addition to logging the data to your terminal/bash window, output the data to a .txt file called `log.txt`.
// * Make sure you append each command you run to the `log.txt` file. 
// * Do not overwrite your file each time you run a command.

console.log(process.argv);