const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    city: String,
    state: { type: String, required: true },
    verification: {
      verified: Boolean,
      verifyId: String,
    },
    wantToReset: Boolean,
    service: { type: String, required: true },
    resetCode: String,
    oldPasswords: { type: Array, required: true },
    lastSignedIn: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("users", User);

