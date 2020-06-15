// require dependencies
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const session = require("express-session");
const passport = require("passport");
const fs = require("fs");
const https = require("https");
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");
var rootCas = require("ssl-root-cas/latest").create();

// default for all https requests
// (whether using https directly, request, or another module)
https.globalAgent.options.ca = rootCas;

const db = require("./db/database.js");

const app = express();
const serverPort = process.env.PORT || 5000;

// middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(flash());
app.set("view engine", "pug");

// initialize session
app.set("trust proxy", 1); // trust first proxy
app.use(
  session({
    name: "sessionId",
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: { path: "/", httpOnly: true, secure: true, sameSite: true },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// handle db errorn
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// load routes
app.get("/", (req, res) => {
  res.send("Hello App");
});

const apiRouter_v1 = require("./routes/api-router-v1.js");
const authStrategies = require("./auth/auth.js");
authStrategies(); // use authentication strategies
app.use("/api/v1", apiRouter_v1); // use /api router

// other errors handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage;

  if (err.errors) {
    // mongoose validation error
    errCode = 400; // bad request
    const keys = Object.keys(err.errors);
    // report the first validation error
    errMessage = errCode + " " + err.errors[keys[0]].message;
  } else {
    // generic or custom error
    errCode = err.status || 500;
    errMessage = err.message || `${err.status} Internal Server Error`;
  }
  res.status(errCode).type("txt").send(errMessage);
});

// handle 404
app.use((req, res, next) => {
  return res.status(404).send("404 Not Found");
});

https
  .createServer(
    {
      key: fs.readFileSync(process.env.SSL_KEY),
      cert: fs.readFileSync(process.env.SSL_CERT),
    },
    app
  )
  .listen(serverPort, function () {
    console.log(
      `App listening on port ${serverPort}! Go to https://localhost:${serverPort}/`
    );
  });
