// MONGOOSE DEPENDENCY
const mongoose = require("mongoose");

// CONNECTION PATH
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// ES6 PROMISES
mongoose.Promise = global.Promise;

// MONGODB CONNECTION THRU MONGOOSE
mongoose.connect(MONGODB_URI);