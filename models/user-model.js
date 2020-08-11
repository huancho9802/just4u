const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Schema for Task
const TaskSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  phoneNumber: String,
  relationship: String,
  additionalInfo: String,
});

// Schema for Contact
const ContactSchema = new Schema({
  firstName: String,
  middleName: String,
  lastName: String,
  email: String,
  phoneNumber: String,
  relationship: String,
  additionalInfo: String,
  homeAddress: String,
  city: String,
  state: String,
});

// Schema for Case
const CaseSchema = new Schema({
  name: String,
  status: String,
  contactsInvolved: [Number],
  attorneys: [Number],
  type: String,
  legalArea: String,
  description: String,
  additionalComments: String,
});

// Schema for User
const User = new Schema(
  {
    firstName: String,
    middleName: String,
    lastName: String,
    phoneNumber: String,
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

// export user schema as a model
module.exports = mongoose.model("users", User);
