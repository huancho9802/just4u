const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Case = new Schema(
    {
        name: { type: String, required: true },
        status: { type: String, required: true },
        isOpen: { type: Boolean, required: true },
        contact: { type: String, required: true },
        legalArea: { type: String, required: true }
    }
);

module.exports = mongoose.model("cases", Case);