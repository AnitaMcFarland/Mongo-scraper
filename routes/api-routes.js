var Note = require("../models/note.js");
var Item = require("../models/article.js");
var request = require("request");
var axios = require("axios");
var cheerio = require("cheerio");

module.exports = function(app) {
  app.get("/scrape", function(req, res) {
    Item.find({ saved: false }).remove().exec();
    axios.get("http://time.com/").then(function(response) {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(response.data);

      $("article h2").each(function(i, element) {
        if (i < 20) {
          var result = {};

          result.title = $(this).children("a").text();
          result.link = $(this).children("a").attr("href");

          

          console.log(result);
          var entry = new Item(result);

          entry.save(function(err, doc) {
            if (err) throw err;
            console.log(doc);
          });
          // console.log(result);
        }


      });
      res.redirect('/');
    });

  });

  app.get("/saved", function(req, res) {
    Item.find({ saved: true })
      .sort({ date: -1 })
      .exec( function(error, data) {
      if (error) throw error;
      res.render('saved', {content: data});
      });
  });

  app.get("/items/:id", function(req, res) {

    Item.findOne({"_id": req.params.id})
    .populate("note")
    .exec(function(err, data) {
      if (err) throw err;
      res.json(data);
    });
  });

  app.post("/items/:id", function(req, res) {
    var newNote = new Note(req.body);
    newNote.save(function(error, doc) {
      if (error) throw error;
      Item.findOneAndUpdate({ "_id": req.params.id}, {"note": doc._id})
      .exec(function(err, data) {
        if (err) throw err;
        res.send(data);
      });
    });
  });

  app.post("/saveItem/:id", function(req,res) {
    Item.findByIdAndUpdate(req.params.id, {$set: { saved: true }})
  .exec( function(err, data) {
    if (err) throw err;
    res.end();
  });
  });

  app.get("/", function(req,res) {
    Item.find({ saved: false })
      .sort({ date: -1 })
      .exec( function(error, data) {
      if (error) throw error;
      res.render('index', {content: data});
      });
  });
};