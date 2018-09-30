// Express
const express = require('express');
const router = express.Router();
const request = require("request");
const cheerio = require("cheerio");
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

      db.Article.create(result)
      .then(function(dbArticle) {
        console.log(dbArticle);
      })
      .catch(function(err) {
        return res.json(err);
      });
        
    });
    res.redirect("/");
  });
  alert("New articles succesfully scraped!");
});

// Home
router.get("/", function(req, res) {
  db.Article.find({ saved: false }, function(err, data) {
      if (err) {
        console.log(err);
      } else {
          res.render("index", { article: data });
      }
    });
});

// Displays saved articles page
router.get("/saved", function(req, res) {
  // join note body to articles note id prop with populate
  db.Article.find({saved: true}).populate("note", 'body').exec(function(err, doc) {
    if (err) {
      res.send(err);
    } else {
      res.render("saved", {saved: doc});
    }
  });
});

// Put route to save article
router.post("/saved/:id", function(req, res) {
  db.Article.findOneAndUpdate({_id: req.params.id}, {$set: {saved: true}}, function(err, data) {
    if (err) {
      console.log(err);
    } else {
        res.redirect("/");
    }
  });
});

// Deletes articles from saved
router.post("/delete/:id", function(req, res){
    db.Article.findOneAndUpdate({_id: req.params.id}, {$set: {saved: false}}, function(err, data) {
      if (err) {
        console.log(err);
      } else {
          res.redirect("/saved");
      }
  });
});

router.post("/saved/notes/:id", function(req, res) {
  db.Note.create(req.body)
      .then(function(dbNote) {
        db.Article.findOneAndUpdate({_id: req.params.id}, { $push: {"note": dbNote._id} }, {new: true}, 
          function(err, data) {
            if (err) {
              console.log(err);
            } else {
              console.log(data);
            }
        });
      }).catch(function(err) {
        return res.json(err);
      });
  res.redirect("/saved");
});

// Delete route to a note
router.post("/saved/delete/:id", function(req, res) {
  db.Note.remove({_id: req.params.id}, function(err, data){
    if (err) {
      console.log(err);
    } else {
        res.redirect("/saved");
        console.log("note succesfully removed");
      }
  });
});

module.exports = router;