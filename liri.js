//setting up require functions for node.js packages
require("dotenv").config();
var request = require('request');
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var colors = require('colors');
var inquirer = require('inquirer');
// fs is a core Node package for reading and writing files
var fs = require("fs");
// passing the env. keys to js for API access/functionality
var keys = require('./keys.js');

// codes required to import the Spotify & Twitter keys
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

//setting input variables
var command = process.argv[2];
var inputName = process.argv[3];

//setting up the initial inquirer interface for interacting with Liri more easily
function liriIntro() {
    inquirer.prompt(

        {
            type: "list",
            name: "command",
            message: "    * * * * * \nWelcome. I'm Liri. \nI can assist you with information regarding film, music, Twitter-happenings, and more. \n     * * * * * \nChoose 'my-tweets' to see DoctorSlow's 20 most-recent tweets; 'movie-this' to inquire about any film; 'spotify-this-song' to retrieve information about any song/artist; and/or 'do-what-it-says' to have me execute whatever it says in the 'random.txt' file. \n     * * * * * ".blue,
            choices: ["my-tweets", "spotify-this-song", "movie-this", "do-what-it-says"]
        },

    ).then(function (user) {

        if (user.command == "my-tweets") {
            myTweets();


        } else if (user.command == "spotify-this-song") {
            inquirer.prompt({
                type: "input",
                name: "inputName",
                message: "Please tell me what song you're looking for:".blue
            }, ).then(function (user) {
                if (user.inputName === "") {
                    spotifyThisSong("The Sign, Ace of Base");
                } else {
                    spotifyThisSong(user.inputName);
                }
            })

        } else if (user.command == "movie-this") {
            inquirer.prompt({
                type: "input",
                name: "inputName",
                message: "Please tell me what movie you're looking for:".blue
            }, ).then(function (user) {
                if (user.inputName === "") {
                    movieThis("Mr. Nobody");
                } else {
                    movieThis(user.inputName);
                }
            })

        } else if (user.command == "do-what-it-says") {
            doWhatItSays();
        };
    });
};

function moreHelp() {
    inquirer.prompt({
        type: "list",
        name: "command",
        message: "   * * * * * \nI hope you found the information you were looking for. Can I assist you with something else?\n     * * * * * \nChoose from the following to continue: \n     * * * * * \n".blue,
        choices: ["my-tweets", "spotify-this-song", "movie-this", "do-what-it-says"]
    }, ).then(function (user) {

        if (user.command == "my-tweets") {
            myTweets();

        } else if (user.command == "spotify-this-song") {
            inquirer.prompt({
                type: "input",
                name: "inputName",
                message: "Please tell me what song you're looking for:".blue
            }, ).then(function (user) {
                if (user.inputName === "") {
                    spotifyThisSong("The Sign, Ace of Base");
                } else {
                    spotifyThisSong(user.inputName);
                }
            })

        } else if (user.command == "movie-this") {
            inquirer.prompt({
                type: "input",
                name: "inputName",
                message: "Please tell me what movie you're looking for:".blue
            }, ).then(function (user) {
                if (user.inputName === "") {
                    movieThis("Mr. Nobody");
                } else {
                    movieThis(user.inputName);
                }
            })

        } else if (user.command == "do-what-it-says") {
            doWhatItSays();
        };
    });
}

// setting up a switch-case statement to accommodate multiple commands
// wrap in a function w / command and input arguments
function switchCase(command, inputName) {
    switch (command) {
        case "my-tweets":
            myTweets();
            break;

        case "spotify-this-song":
            if (inputName) {
                spotifyThisSong(inputName)
            } else {
                spotifyThisSong("The Sign, Ace of Base");
                console.log("     ** Next time, try and choose your own song. **".red)
            };
            break;

        case "movie-this":
            if (inputName) {
                movieThis(inputName)
            } else {
                movieThis("Mr. Nobody");
                console.log("     ** Next time, try and choose your own film. **".red)
            };
            break;

        case "do-what-it-says":
            doWhatItSays();
    };
};

// 'node liri.js my-tweets'
function myTweets() {
    var params = {
        screen_name: 'doctorslow',
        count: 20,
        tweet_mode: 'extended',
    };
    client.get('statuses/user_timeline/', params, function (error, tweets, response) {
        if (!error) {
            // let text = status["retweeted_status"]["full_text"];
            console.log("Here you go:".blue);
            console.log("     <---------------------------------->".red);
            for (i = 0; i < tweets.length; i++) {
                console.log("Date: ".green + tweets[i].created_at);
                console.log("Tweet: ".green + tweets[i].full_text.yellow);
                console.log("     <---------------------------------->".red);
            };
        };
        moreHelp();
    });
};

// 'node liri.js spotify-this-song "song name" or "song name, artist name"'
// defaults to "The Sign, by Ace of Base"
function spotifyThisSong(inputName) {
    spotify.search({
        type: 'track',
        query: inputName,
    }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        console.log("Here you go:".blue);
        console.log("     <---------------------------------->".red);
        console.log("Artist: ".green + data.tracks.items[0].artists[0].name.yellow);
        console.log("Album: ".green + data.tracks.items[0].album.name.yellow);
        console.log("Song: ".green + data.tracks.items[0].name.yellow);
        // console.log("Preview link: ".green + data.tracks.items[0].preview_url);
        console.log("Spotify link: ".green + data.tracks.items[0].external_urls.spotify.yellow);
        console.log("     <---------------------------------->".red);
        moreHelp();
    });
};

// 'node liri.js movie-this "movie name"'
// defaults to "Mr. Nobody"
function movieThis(inputName) {
    request("http://www.omdbapi.com/?t=" + inputName + "&y=&plot=short&apikey=trilogy", function (error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log("Here you go:".blue);
            console.log("     <---------------------------------->".red);
            console.log("Title: ".green + JSON.parse(body).Title.yellow);
            console.log("Released on: ".green + JSON.parse(body).Released.yellow);
            console.log("Rated: ".green + JSON.parse(body).Rated.yellow);
            console.log("Rotten Tomatoes Rating: ".green + JSON.parse(body).Ratings[1].Value.yellow);
            console.log("Released in: ".green + JSON.parse(body).Country.yellow);
            console.log("Language(s): ".green + JSON.parse(body).Language.yellow);
            console.log("Plot summary: ".green + JSON.parse(body).Plot.yellow);
            console.log("Starring: ".green + JSON.parse(body).Actors.yellow);
            console.log("     <---------------------------------->".red);
        };
        moreHelp();
    });
}

// 'node liri.js do-what-it-says to read random.txt file'
function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        // If the code experiences any errors it will log the error to the console.
        if (error) {
            return console.log(error);
        }
        // print the contents of data to the console log
        console.log("The file says:\n".blue);
        console.log(data.inverse);
        console.log("\nAllow me to do that for you.\n     *  *  *  *  *".blue);

        // Then split it by commas (to make it more readable)
        var dataArr = data.split(",");
        // pass the two split data in the array as the command and userInput in the switchCase function
        //SwitchCase will run whichever command matches the argument in dataArr[0]
        switchCase(dataArr[0], dataArr[1]);
    });

};

liriIntro();
switchCase(command, inputName);

// ### BONUS
// * In addition to logging the data to your terminal/bash window, output the data to a .txt file called `log.txt`.
// * Make sure you append each command you run to the `log.txt` file. 
// * Do not overwrite your file each time you run a command.

// If the "log" function is called...
function log(command, inputName) {
    // We will add the user command and input to the log.text file. If it doesn't exist, we'll automatically create it
    fs.appendFile("log.txt", "\n<---------------------------------->\n" + command + " " + inputName + ".", function (err) {
        if (err) {
            return console.log(err);
        }
    });
    // We will then print the logged input that was added to the log.txt file.
    // console.log("Logged " + command + ": " + inputName + ".");
};

log();