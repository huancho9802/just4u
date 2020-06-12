const mongoose = require('mongoose')
const Schema = mongoose.Schema

const User = new Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true },
        password: { type: String, required: true },
        provider: String,
        city: String,
        state: { type: String, required: true },
        verification: {
            verified: Boolean,
            verifyId: String
        },
        wantToReset: {type: Boolean, required: true},
        resetCode: String,
        resetCodeSent: Boolean,
        lastSignedIn: Date
    },
    { timestamps: true },
)

module.exports = mongoose.model('users', User)