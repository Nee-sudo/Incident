const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
    city: String,
    country: String,
    lat: Number,
    lng: Number,
    flagUrl: String, // Country flag URL
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Location", locationSchema);
