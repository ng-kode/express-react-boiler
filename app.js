var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var apiRouter = require("./routes/api");

var app = express();

console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === "development") {
  var cors = require("cors");
  var whitelist = ["http://localhost:3001"];
  var corsOptions = {
    origin: function(origin, callback) {
      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    }
  };
  app.use(cors(corsOptions));
}

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "client/build")));

app.use("/api", apiRouter);

app.get("*", function(req, res, next) {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

module.exports = app;
