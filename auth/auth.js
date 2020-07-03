const passport = require('passport')
const ObjectID = require("mongodb").ObjectID
const LocalStrategy = require('passport-local')
const bcrypt = require('bcrypt')
const User = require('../models/user-model.js')

const authStrategies = () => {
    // Serialize User
    passport.serializeUser((user, done) => {
      done(null, user._id)
    });

    // Deserialize User
    passport.deserializeUser((id, done) => {
      User.findOne({ _id: new ObjectID(id) }, (err, user) => {
        done(null, user)
      });
    });

    // Local Strategy
    passport.use(
      new LocalStrategy({ usernameField: 'email', passwordField: 'password' },
        function(email, password, done) {
        User.findOne({ email }, (err, user) => {
          console.log("User " + email + " attempted to sign in.")
          if (err) {
            return done(err)
          }
          if (!user) {
            return done(null, false, {message: 'Invalid email or password'})
          }
          bcrypt.compare(password, user.password, (error, result) => {
            if (error) {
              return done(error)
            }
            if (!result) {
              return done(null, false, {message: 'Invalid email or password'})
            } else {
              return done(null, user)
            }
          })
        })
      })
    )
}

module.exports = authStrategies