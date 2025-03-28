// models/locationModel.js
const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
    intendedCity: String, // City the user selected (optional)
    intendedCountry: String, // Country the user selected
    actualCity: String, // Actual city from IP
    actualCountry: String, // Actual country from IP
    lat: Number, // Actual latitude from IP
    lng: Number, // Actual longitude from IP
    flagUrl: String, // Flag URL based on actual country
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Location", locationSchema);