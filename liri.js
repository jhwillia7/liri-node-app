// LIRI App/Bot
require("dotenv").config();

// NPM - Packages && Required files
var Spotify = require('node-spotify-api');
var request = require('request');
var terminalLink = require('terminal-link');
var moment = require('moment');
var fs = require("fs");
var keys = require("./keys");
var data = fs.readFileSync("./random.txt", "utf8");

// Keys
var spotify = new Spotify(keys.spotify);


// Logs userinput
var search = process.argv[2];
var entireCmdLine = process.argv;
var findThis = "";

// Text colors
var FgBlue = "\x1b[34m";
var FgWhite = "\x1b[0m";
var FgCyan =  "\x1b[36m";
var FgGreen = "\x1b[32m";
var FgMagenta = "\x1b[35m";

// Turns user search into string for placement in urls (OMDB & Spotify)
// i === 3 to capture the first meaningful userinput

for (var i = 3; i < entireCmdLine.length; i++) {
    if (i > 3 && i < entireCmdLine.length) {
        findThis = findThis + "+" + entireCmdLine[i];

    } else {
        findThis += entireCmdLine[i];

    };
};

console.log(findThis);

// Searches for results based on userinput 
function liriBot() {

    switch (search) {
        case "concert-this":

        if (findThis === "") {
            findThis = "Wonder+Bread+5" //  If the user doesn't type a band in, the program will output data for the movie 'Wonder Bread 5'
        }
        console.log(findThis);

            var queryUrl = "https://rest.bandsintown.com/artists/" + findThis + "/events?app_id=" + keys.bandsintown.key;

            var logIt = search.concat("," + findThis)

            console.log("Searching " + FgCyan + "BandsInTown..." + FgWhite + "\n")

            request(queryUrl, function (error, response, body) {
                if (error) {
                    throw error;
                } else if (!error) {
                    var json = JSON.parse(body);
                    console.log(FgBlue + "----------Bands in Town Search Results----------\n" + FgWhite);
                    console.log(FgCyan + "Venue Name: " + FgWhite + json[0].venue.name );
                    console.log(FgCyan + "Venue Location: " + FgWhite + json[0].venue.city + ", " + json[0].venue.region);
                    console.log(FgCyan + "Event Date: " + FgWhite + (moment (json[0].datetime).format("MM/DD/YYYY")));
                    console.log(FgBlue + "\n---------------------------------------------" + FgWhite);
                    fs.appendFile("log.txt", logIt + "\n", function (err) {
                        if (err) {
                            return console.log(err);
                        }
                        console.log("\nlog.txt was updated!\n");
                    });
                } else {
                    console.log("That band does not exist in the " + FgCyan + "BandsInTown..." + FgWhite + "\n")
                }

            });

            break;

        case "spotify-this-song":
            var logIt = search.concat("," + findThis)

            if (findThis === "") {
                findThis = "The+sign+ace+of+base" //  If the user doesn't type a song in, the program will output data for the song "The Sign."
                logIt += "The Sign Ace of Base";
            }

            console.log("Searching " + FgGreen + "Spotify..." + FgWhite + "\n");

            spotify.search({ type: 'track', query: findThis }, function (err, data) {
                if (err) {
                    return console.log('Error occurred: ' + err);
                }

                console.log(FgGreen + "----------Spotify Search Results!----------\n" + FgWhite);
                console.log(FgGreen + 'Artist(s): ' + FgWhite + data.tracks.items[0].artists[0].name);
                console.log(FgGreen + 'Song: ' + FgWhite + data.tracks.items[0].name);
                console.log(FgGreen + 'Album: ' + FgWhite + data.tracks.items[0].album.name);
                console.log(terminalLink(FgGreen + 'Preview:' + FgWhite, data.tracks.items[0].artists[0].external_urls.spotify));
                console.log(FgGreen + "\n-------------------------------------------" + FgWhite);
                fs.appendFile("./log.txt", logIt + "\n", function (err) {
                    if (err) {
                        return console.log(err);
                    }
                    console.log("\nlog.txt was updated!\n");
                });
            });
            break;

        case "movie-this":

            if (findThis === "") {
                findThis = "Mr.+Nobody" //  If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.'
            }

            var queryUrl = "http://www.omdbapi.com/?t=" + findThis + "&y=&plot=short&apikey=" + keys.omdb.key;

            var logIt = search.concat("," + findThis)

            console.log("Searching " + FgBlue + "OMDB..." + FgWhite + "\n")

            request(queryUrl, function (error, response, body) {

                if (error) {
                    console.log(error);
                } else if (!error && response.statusCode === 200 && JSON.parse(body).Ratings !== undefined) {
                    console.log(FgBlue + "----------Your Movie Search Results----------\n" + FgWhite);
                    console.log(FgBlue + "Year: " + FgWhite + JSON.parse(body).Year);
                    console.log(FgBlue + "Title: " + FgWhite + JSON.parse(body).Title);
                    console.log(FgBlue + "Actors: " + FgWhite + JSON.parse(body).Actors);
                    console.log(FgBlue + "Country: " + FgWhite + JSON.parse(body).Country);
                    console.log(FgBlue + "Language: " + FgWhite + JSON.parse(body).Language);
                    console.log(FgBlue + "IMDB Rating: " + FgWhite + JSON.parse(body).imdbRating);
                    console.log(FgBlue + "Rotten Tomatoes Rating: " + FgWhite + JSON.parse(body).Ratings[1].Value);
                    console.log(FgBlue + "Plot: " + FgWhite + JSON.parse(body).Plot);
                    console.log(FgBlue + "\n---------------------------------------------" + FgWhite);
                    fs.appendFile("log.txt", logIt + "\n", function (err) {
                        if (err) {
                            return console.log(err);
                        }
                        console.log("\nlog.txt was updated!\n");
                    });
                } else {
                    console.log("That movie does not exist in the " + FgBlue + "OMDB..." + FgWhite + "\n")
                }

            });
            break;

        case "do-what-it-says":

            fs.readFile("random.txt", "utf8", function (error, data) {
                // Break the string down by comma separation and store the contents into the output array.
                var dataArr = data.split(",");
                if (error) {
                    return console.log(error);
                }
                search = dataArr[0];
                findThis = dataArr[1];
                liriBot();
            });

            break;

        default:
            console.log("Not a valid input. Please use the following options: "
            + FgCyan + "\n * concert-this " + FgGreen + "\n * spotify-this-song " + FgBlue + "\n * movie-this " + FgMagenta + "\n * do-what-it-says" + FgWhite)
            break;
    };
};

liriBot();