const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ContactSchema = new Schema(
  {
    firstName: String,
    lastName: String,
    email: String,
    phoneNumber: String,
    relationship: String,
  }
)

const CaseSchema = new Schema(
  {
      name: String,
      type: String,
      status: String,
      contact: [ContactSchema],
      legalArea: String,
      description: String,
  }
)

const User = new Schema(
  {
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    city: String,
    state: String,
    verification: {
      verified: Boolean,
      verifyId: String,
    },
    cases: [CaseSchema],
    contacts: [ContactSchema],
    wantToReset: Boolean,
    service: String,
    resetCode: String,
    oldPasswords: Array,
    lastSignedIn: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("users", User);

