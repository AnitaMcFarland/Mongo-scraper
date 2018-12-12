var request = require("request");
var cheerio = require("cheerio");

var scrape = function (cb){
    request("https://www.washingtonpost.com", function(err, res, body){

    var $ = cheerio.load(body);
    var articles = [];

    $(".theme-description").each(function(i, element){

        var headlines = $(this).children(".headlines.basic").text().trim();
        var blurb = $(this).children(".description.basic").text().trim();

        if(headlines && description){
            var headNeat = head.replace(/(\r\n\|\n|\r|\t|\s+)/gm, "").trim();
            var blurbNeat = sum.replace(/(\r\n\|\n|\r|\t|\s+)/gm, "").trim();

            var dataToAdd = {
                headline: headNeat,
                description: descriptionNeat
            };
            articles.push(dataToAdd);
        }
    });
    cb(articles);
    });
};
module.exports = scrape;