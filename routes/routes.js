// Express
const express = require('express');
const router = express.Router();
const request = require("request");
const cheerio = require("cheerio");
var methodOverride = require("method-override");
// Models
const db = require("../models");

// Scraper
router.get("/scrape", function(req,res){
  request("http://www.espn.com/", function(err, response, html){

    const $ = cheerio.load(html);
      
    $("ul.headlineStack__list li").each(function(i, element) {
      const result = {};
      // save as properties of the result object
      result.title = $(this).children().text();
      result.link = "http://www.espn.com" + $(this).children().attr("href");

      db.Article.findOne({title: result.title}).then(function (dbFinder) {
        if (dbFinder) {
          return;
        }
        else {
          db.Article.create(result)
          .then(function(dbArticle) {
            console.log(dbArticle);
          })
          .catch(function(err) {
            return res.json(err);
          });
        }

      });
    });
    res.redirect("/");
  });
});

// Home
router.get("/", function(req, res) {
  db.Article.find({}, function(error, data) {
      if (error) {
        console.log(error);
      } else {
          res.render("index", { article: data });
      }
    });
});

// Displays articles as JSON objects
router.get("/articles", function(req, res) {
  db.Article.find({})
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// Allows for looking up specific article by id
router.get("/articles/:id", function(req, res) {
  db.Article.findOne({ _id: req.params.id })
    .populate("note")
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// Posts notes to articles
router.post("/articles/:id", function(req, res) {
  db.Note.create(req.body)
    .then(function(dbNote) {
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// Displays saved articles page
router.get("/saved", function(req, res) {
  db.Article.find({ saved: true }).exec(function(err, doc) {
    if (err) {
      res.send(err);
    } else {
      res.render("saved", {saved: doc});
    }
  });
});

// put route to updated the article to be saved:true
router.post("/saved/:id", function(req, res) {
  db.Article.updateOne({_id: req.params.id}, {$set: {saved: true}}, function(err, doc) {
    if (err) {
      res.send(err);
    } else {
      res.redirect("/");
    }
  });
});

// delete route for articles on the saved page
router.post("/delete/:id", function(req, res){
    db.Article.updateOne({_id: req.params.id}, {$set: {saved: false}}, function(err, doc) {
    if (err) {
      res.send(err);
    } else {
      res.redirect("/saved");
    }
  });
});

module.exports = router;