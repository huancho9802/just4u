const passport = require("passport");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const shortid = require("shortid");
var authRouter = require("express").Router();

const User = require("../models/user-model.js");

// salt rounds for hashing
const saltRounds = parseInt(process.env.SALT_ROUNDS);

// ensure authentication/unauthentication
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ message: "Unauthorized path" });
};

const ensureUnauthenticated = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return next();
  }
  return res.status(400).json({ message: "Cannot access path" });
};

// send verification ID or OTP
const sendVerifyIdOrResetCode = (user, plain, type) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.NODEMAILER_USERNAME,
      pass: process.env.NODEMAILER_PASSWORD,
    },
  });

  transporter.sendMail(
    {
      from: process.env.NODEMAILER_USERNAME,
      to: user.email,
      subject: `just4u ${type}`,
      text: `Hi ${user.firstName},\n\nYour one-time ${type} is ${plain} (if you did not request this, please ignore).\n\nThank you,\n\njust4u Team`,
    },
    function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    }
  );
};

authRouter.get("/", (req, res) => {
  if (!req.user) {
    return res.json({ isAuthenticated: req.isAuthenticated() });
  }
  return res.json({
    isAuthenticated: req.isAuthenticated(),
    isVerified: req.user.verification.verified,
  });
});

// sign in
authRouter.use("/signin", (req, res, next) =>
  ensureUnauthenticated(req, res, next)
);

authRouter.post("/signin", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ message: info.message });
    }
    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
      user.lastSignedIn = new Date();
      user.save();
      return res.status(200).json({
        message: "Successful sign in",
        isVerified: user.verification.verified,
      });
    });
  })(req, res, next);
});

// sign up
authRouter.use("/signup", (req, res, next) =>
  ensureUnauthenticated(req, res, next)
);

authRouter.post(
  "/signup",
  (req, res, next) => {
    User.findOne({ email: req.body.email.toLowerCase() }, (err, user) => {
      if (err) {
        return next(err);
      } else if (user) {
        return res.status(400).json({ message: "Email already taken" });
      } else {
        bcrypt.hash(req.body.password, saltRounds, function (error, hash) {
          // hash the inputted password
          if (error) {
            return next(error);
          }
          let plainVerifyId = shortid.generate();
          User.create(
            {
              ...req.body,
              password: hash,
              verification: {
                verified: false,
                verifyId: bcrypt.hashSync(plainVerifyId, saltRounds),
              },
              wantToReset: false,
              oldPasswords: [],
              service: "local",
            },
            (e) => {
              if (e) {
                return console.error(e);
              } else {
                res.locals.plainVerifyId = plainVerifyId;
                return next();
              }
            }
          );
        });
      }
    });
  },
  (req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
      if (err) {
        return console.error(err);
      }
      if (!user) {
        return res
          .status(400)
          .json({ message: "An error occured during signup" });
      }
      // send verification ID
      sendVerifyIdOrResetCode(
        user,
        res.locals.plainVerifyId,
        "verification ID"
      );
      res.status(201).json({ message: "Signup successful" });
    });
  }
);

// verification
authRouter.use("/verify", (req, res, next) =>
  ensureAuthenticated(req, res, next)
);

authRouter.post("/verify", (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) {
      return console.error(err);
    }
    let plainVerifyId = req.body.verifyId;
    if (user.verification.verified || !user) {
      return res.status(400).json({ message: "Invalid verification ID" });
    }
    bcrypt.compare(plainVerifyId, user.verification.verifyId, (err, result) => {
      if (err) {
        return console.error(err);
      }
      if (!result) {
        return res.status(400).json({ message: "Invalid verification ID" });
      } else {
        // change status to verified
        user.verification.verified = true;
        user.verification.verifyId = undefined;
        user.save();
        return res.status(200).json({ message: "Verification successful" });
      }
    });
  });
});

// resend verification ID
authRouter.use("/resend-verifyId", (req, res, next) =>
  ensureAuthenticated(req, res, next)
);

authRouter.post("/resend-verifyId", (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) {
      return console.error(err);
    }
    if (!user || user.verification.verified) {
      return res.status(400).json({ message: "Invalid email" });
    }
    // generate new verification ID
    let plainVerifyId = shortid.generate();
    user.verification.verifyId = bcrypt.hashSync(plainVerifyId, saltRounds);
    user.save();
    sendVerifyIdOrResetCode(user, plainVerifyId, "verification ID");
    return res.status(201).json({ message: "New verification ID sent" });
  });
});

// logout
authRouter.get("/signout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return console.error(err);
    } else {
      req.logout();
      req.session = null;
      res.clearCookie("sessionId");
      return res.status(200).json({ message: "User signed out" });
    }
  });
});

// reset password
authRouter.post("/reset-password", (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) {
      return console.error(err);
    }
    if (!user) {
      // no user
      return res.status(400).json({ message: "Invalid email" });
    }
    if (user.service !== "local") {
      // non-local user
      return res
        .status(400)
        .json({ message: "Email already used for third-party authentication" });
    }
    // generate new reset code
    let plainResetCode = shortid.generate();
    user.resetCode = bcrypt.hashSync(plainResetCode, saltRounds);
    user.wantToReset = true;
    user.save();
    sendVerifyIdOrResetCode(user, plainResetCode, "code to reset password");
    return res.json({ message: "Reset code sent" });
  });
});

// confirm reset code
authRouter.post("/confirm-reset-code", (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) {
      return console.error(err);
    }
    if (!user || !user.wantToReset || !user.resetCode) {
      // no user or wrong reset statuss
      return res.status(400).json({ message: "Invalid email" });
    }
    // check reset code
    bcrypt.compare(req.body.resetCode, user.resetCode, (err, result) => {
      if (err) {
        return console.error(err);
      }
      if (!result) {
        return res.status(400).json({ message: "Invalid reset code" });
      } else {
        // delete reset code
        user.resetCode = undefined;
        user.oldPasswords.push(user.password);
        user.save();
        return res.status(200).json({ message: "Correct reset code" });
      }
    });
  });
});

// new password
authRouter.post("/new-password", (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) {
      return console.error(err);
    }
    if (!user || user.resetCode || !user.wantToReset) {
      // still have reset code or incorrect email or dont want to reset
      return res.status(400).json({ message: "Invalid path" });
    }
    // check if new password is the same as old ones
    newPassDifferent = 1; // initial value
    user.oldPasswords.forEach((oldPassword) => {
      let result = bcrypt.compareSync(req.body.newPassword, oldPassword);
      if (result) {
        newPassDifferent = newPassDifferent * 0;
      } else {
        newPassDifferent = newPassDifferent * 1;
      }
    });
    // return values for 2 different cases
    if (newPassDifferent === 0) {
      return res.status(400).json({
        message: "New password must be different from used ones",
      });
    } else {
      user.password = bcrypt.hashSync(req.body.newPassword, saltRounds);
      user.wantToReset = false;
      user.save();
      return res.status(201).json({ message: "New password created" });
    }
  });
});

module.exports = authRouter;
