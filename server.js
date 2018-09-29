// ==============================================================================
// EXPRESS CONFIGURATION
// ==============================================================================

const express = require("express");
const app = express();

app.use(express.static("public"));

// ==============================================================================
// MONGODB CONNECTION
// ==============================================================================

const mongoose = require("mongoose");

// CONNECTION PATH
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// ES6 PROMISES
mongoose.Promise = Promise;

// MONGODB CONNECTION THRU MONGOOSE
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

// ==============================================================================
// BODY-PARSER
// ==============================================================================

const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// =============================================================================
// HANDLEBARS
// =============================================================================

const exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// =============================================================================
// ROUTES
// =============================================================================

const router = require("./routes/routes");
app.use("/", router);

// =============================================================================
// METHOD OVERRIDE
// =============================================================================

// npm that allows you to add PUT requests in html
var methodOverride = require("method-override");
app.use(methodOverride("_method"));

// =============================================================================
// ERROR HANDLE
// =============================================================================

app.use(function(err, req, res, next) {
  res.status(422).send({error: err.message});
});

// =============================================================================
// LISTENER
// =============================================================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, function() {
  console.log("Server listening on: http://localhost:" + PORT);
});