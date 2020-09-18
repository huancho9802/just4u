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
const MongoStore = require("connect-mongo")(session);

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

// session options
var options = {
  name: "sessionId",
  secret: process.env.SESSION_SECRET,
  rolling: true,
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db,
    autoRemove: "native",
    collection: "sessions",
    secret: process.env.SESSION_STORE_SECRET,
  }),
  cookie: {
    path: "/",
    httpOnly: true,
    sameSite: true,
    maxAge: 15 * 60 * 1000,
  },
};

// production mode
if (app.get("env") === "production") {
  app.set("trust proxy", 1); // trust first proxy
  sess.cookie.secure = true; // serve secure cookies
}

// initialize session
app.use(session(options));
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
    `App listening on port ${serverPort}!`
  );
});
