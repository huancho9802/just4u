const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Schema for Event
const EventSchema = new Schema({
  case: Number,
  subject: String,
  description: String,
  additionalComments: String,
  startTime: Date,
  endTime: Date,
  location: String,
  priority: String,
  attendees: [Number],
});

// Schema for Note
const NoteSchema = new Schema({
  subject: String,
  note: String,
  time: Date,
  contactsLinked: [Number],
});

// Schema for Task
const TaskSchema = new Schema({
  subject: String,
  description: String,
  additionalComments: String,
  dueDate: Date,
  priority: String,
  contactsLinked: [Number],
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
  attorneys: [Number],
  additionalContacts: [Number],
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
    events: [EventSchema],
    tasks: [TaskSchema],
    notes: [NoteSchema],
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
