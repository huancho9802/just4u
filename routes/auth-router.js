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
      subject: "just4u Verification ID",
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

authRouter.get('/', (req, res) => {
    return res.json({isAuthenticated: req.isAuthenticated()})
})

// sign in
authRouter.use("/signin", (req, res, next) =>
  ensureUnauthenticated(req, res, next)
);

authRouter
  .route("/signin")
  .get((req, res) => {
    res.status(200).json({ message: "Sign In" });
  })
  .post((req, res, next) => {
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
        if (!user.verification.verified) {
          res.redirect("/api/v1/auth/verify?email=" + user.email); // redirect to verify
        }
        return res.status(200).json({ message: "Successful sign in" });
      });
    })(req, res, next);
  });

// sign up
authRouter.use("/signup", (req, res, next) =>
  ensureUnauthenticated(req, res, next)
);

authRouter.get("/signup", (req, res) => {
  res.status(200).json({ message: "Sign Up" });
});

authRouter.post(
  "/signup",
  (req, res, next) => {
    User.findOne({ email: req.body.email }, (err, user) => {
      if (err) {
        return next(err);
      } else if (user) {
        return res
          .status(400)
          .json({ message: "User with this email already exists" });
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
          .json({ message: "An error occured during signup: user not found" });
      }
      // send verification ID
      sendVerifyIdOrResetCode(
        user,
        res.locals.plainVerifyId,
        "verification ID"
      );
      res.redirect("/api/v1/auth/verify?email=" + user.email); // redirect to verify
    });
  }
);

// verification
authRouter.use("/verify", (req, res, next) =>
  ensureAuthenticated(req, res, next)
);

authRouter.get("/verify", (req, res) => {
  return res
    .status(200)
    .json({
      message:
        "Signup successful. Please enter the verification ID sent to " +
        req.query.email,
    });
});

authRouter.post("/verify", (req, res) => {
  User.findOne({ email: req.query.email }, (err, user) => {
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
        return res.status(200).json({ message: "Verification success" });
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
authRouter.get(
  "/signout",
  (req, res, next) => ensureAuthenticated(req, res, next),
  (req, res) => {
    req.logout();
    return res.status(200).json({ message: "User signed out" });
  }
);

// forget password

authRouter.get("/reset-password", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(200).json({ message: "Please enter your email" });
  }
});

authRouter.post("/reset-password", (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) {
      return console.error(err);
    }
    if (!user || user.resetCodeSent) {
      // no user or reset code already sent
      return res.status(400).json({ message: "Invalid email" });
    }
    // generate new verification ID
    let resetCode = shortid.generate();
    user.resetCode = bcrypt.hashSync(resetCode, saltRounds);
    user.resetCodeSent = true;
    user.wantToReset = true;
    user.save();
    sendVerifyIdOrResetCode(user, resetCode, "code to reset password");
    return res.redirect(
      "/api/v1/auth/confirm-reset-code?id=" + user._id + "&resend=false"
    );
  });
});

authRouter.get("/confirm-reset-code", (req, res) => {
  if (req.query.resend === "false") {
    return res
      .status(200)
      .json({ message: "Please enter the reset code sent to you" });
  } else if (req.query.resend === "true") {
    User.findOne({ _id: req.query.id }, (err, user) => {
      if (err) {
        return console.error(err);
      }
      if (!user) {
        return res.status(400).json({ message: "Invalid path" });
      }
      // generate new reset code to resend
      let resetCode = shortid.generate();
      user.resetCode = bcrypt.hashSync(resetCode, saltRounds);
      user.save();
      sendVerifyIdOrResetCode(user, resetCode, "code to reset password");
      return res.redirect(
        "/api/v1/auth/confirm-reset-code?id=" + user._id + "&resend=false"
      );
    });
  } else {
    return res.status(400).json({ message: "Invalid path" });
  }
});

// new password
authRouter.get("/new-password", (req, res) => {
  User.findOne({ _id: req.query.id }, (err, user) => {
    if (err) {
      return console.error(err);
    }
    if (!user || user.resetCode || !user.wantToReset) {
      // still have reset code or incorrect id or dont want to reset
      return res.status(400).json({ message: "Invalid path" });
    }
    return res.status(200).json({ message: "Please enter new password" });
  });
});

authRouter.post("/new-password", (req, res) => {
  User.findOne({ _id: req.query.id }, (err, user) => {
    if (err) {
      return console.error(err);
    }
    if (!user || user.resetCode || !user.wantToReset) {
      // still have reset code or incorrect id or dont want to reset
      return res.status(400).json({ message: "Invalid path" });
    }
    bcrypt.compare(req.body.newPassword, user.password, (err, result) => {
      if (err) {
        return console.error(err);
      }
      if (result) {
        return res
          .status(400)
          .json({
            message: "New password must be different from the previous one",
          });
      } else {
        user.password = bcrypt.hashSync(req.body.newPassword, saltRounds);
        user.wantToReset = false;
        user.save();
        return res.status(201).json({ message: "New password created" });
      }
    });
  });
});

module.exports = authRouter;