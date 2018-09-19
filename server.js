// ==============================================================================
// EXPRESS CONFIGURATION
// ==============================================================================

const express = require("express");
const app = express();

app.use(express.static("public")); // Serve static content for the app from public

// ==============================================================================
// MONGODB CONNECTION
// ==============================================================================

const mongoose = require("mongoose");

// CONNECTION PATH
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// ES6 PROMISES
mongoose.Promise = global.Promise;

// MONGODB CONNECTION THRU MONGOOSE
mongoose.connect(MONGODB_URI);

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

const apiRoutes = require("./routes/apiRoutes");
const htmlRoutes = require("./routes/htmlRoutes");

app.use("/api",apiRoutes);
app.use(htmlRoutes);

// =============================================================================
// ERROR HANDLE
// =============================================================================

app.use(function(err, req, res, next) {
  // just message returned from error and error type
  res.status(422).send({error: err.message});
});

// =============================================================================
// LISTENER
// =============================================================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, function() {
  console.log("Server listening on: http://localhost:" + PORT);
});

module.exports = app;