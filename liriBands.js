// Reference to personal API keys Twitter and Spotify
require("dotenv").config();

var fs = require("fs");
// JS referencing variables for API keys
var keys = require("./keys.js");

// NPM packages
var request = require("request");

// Search type and search terms
var searchType = process.argv[2];

var searchTerm = process.argv.slice(3).join("+");

// Function to get the last 20 tweets from @dunanome
var concertThis = function () {
    var bandsintownURL = "https://rest.bandsintown.com/artists/" + searchTerm + "/events?app_id=codingbootcamp";
    // Search for Wonder Bread 5 if no search parameter is entered.
    if (!searchTerm) {
        bandsintownURL = "https://rest.bandsintown.com/artists/wonder+bread+5/events?app_id=codingbootcamp";
    }

    request(bandsintownURL, function (error, response, body) {
        if (error) {
            throw error;
        }
        
        else {
            var json = JSON.parse(body);
            console.log("========== Bands In Town SEARCH RESULTS ==========");
            console.log(json);
            console.log("Venue Name: " + json[0].venue.name);

            
        };

    });
}
if (searchType === "concert-this") {
    concertThis();
}
else if (searchType === "spotify-this-song") {
    spotifyThisSong(searchTerm);
}
else if (searchType === "movie-this") {
    movieThis(searchTerm);
}
else if (searchType === "do-what-it-says") {
    doWhatItSays();
}
else {
    console.log("Please enter valid parameters.")
}
;