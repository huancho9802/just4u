// require dependencies
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const session = require("express-session");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const path = require("path");

const db = require("./db/database.js");

const app = express();
const serverPort = process.env.PORT || 5000;

// handle db error
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(cookieParser());
app.use(bodyParser.json());

// initialize session
app.set("trust proxy", 1); // trust first proxy
app.use(
  session({
    name: "sessionId",
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: { path: "/", httpOnly: true, secure: true, sameSite: true, maxAge: 15 * 60 * 1000 },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Serve any static files
app.use(express.static(path.join(__dirname, "client/build")));

// load routes
app.get("/", (req, res) => {
  res.send("Hello App");
});

const apiRouter_v1 = require("./routes/api-router-v1.js");
const authStrategies = require("./auth/auth.js");
authStrategies(); // use authentication strategies
app.use("/api/v1", apiRouter_v1); // use /api router

// Handle React routing, return all requests to React app
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "client/build", "index.html"));
});

app.listen(serverPort, function () {
  console.log(
    `App listening on port ${serverPort}! Go to http://localhost:${serverPort}/`
  );
});
