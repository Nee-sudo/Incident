const express = require("express");
const axios = require("axios");
const Location = require("../models/locationModel");
const Comment = require("../models/commentModel");
const countryCodes = require("../utils/countryCodes");
const router = express.Router();

// Track User Location with IP
router.get("/track", async (req, res) => {
    try {
        const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

        if (ip === "127.0.0.1" || ip === "::1") {
            const mockData = {
                city: "Beijing",
                country: "China",
                loc: "39.9042,116.4074",
                countryCode: "CN"
            };
            const { city, country, loc, countryCode } = mockData;
            const [lat, lng] = loc.split(",").map(Number);
            const flagUrl = `https://flagcdn.com/w320/${countryCode.toLowerCase()}.png`;

            const newLocation = new Location({
                intendedCity: null,
                intendedCountry: null,
                actualCity: city,
                actualCountry: country,
                lat,
                lng,
                flagUrl
            });
            await newLocation.save();

            return res.json({
                intendedCity: null,
                intendedCountry: null,
                actualCity: city,
                actualCountry: country,
                lat,
                lng,
                flagUrl
            });
        }

        const response = await axios.get(`https://ipinfo.io/${ip}/json`);
        const { city, country, loc, countryCode } = response.data;

        if (!city || !country || !loc) return res.status(400).json({ error: "Location not found" });

        const [lat, lng] = loc.split(",").map(Number);
        const flagUrl = `https://flagcdn.com/w320/${countryCode.toLowerCase()}.png`;

        const newLocation = new Location({
            intendedCity: null,
            intendedCountry: null,
            actualCity: city,
            actualCountry: country,
            lat,
            lng,
            flagUrl
        });
        await newLocation.save();

        res.json({
            intendedCity: null,
            intendedCountry: null,
            actualCity: city,
            actualCountry: country,
            lat,
            lng,
            flagUrl
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Could not track location" });
    }
});

// Manual Location Input (Now based on intended country and IP)
router.post("/track/manual", async (req, res) => {
    try {
        const { city, country } = req.body;
        if (!country) {
            return res.status(400).json({ error: "Country is required" });
        }

        const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
        let actualCity, actualCountry, lat, lng, flagUrl;

        if (ip === "127.0.0.1" || ip === "::1") {
            const mockData = {
                city: "Beijing",
                country: "China",
                loc: "39.9042,116.4074",
                countryCode: "CN"
            };
            actualCity = mockData.city;
            actualCountry = mockData.country;
            [lat, lng] = mockData.loc.split(",").map(Number);
            flagUrl = `https://flagcdn.com/w320/${mockData.countryCode.toLowerCase()}.png`;
        } else {
            const response = await axios.get(`https://ipinfo.io/${ip}/json`);
            const { city: ipCity, country: ipCountry, loc, countryCode } = response.data;

            if (!ipCity || !ipCountry || !loc) {
                return res.status(400).json({ error: "Could not determine your location" });
            }

            actualCity = ipCity;
            actualCountry = ipCountry;
            [lat, lng] = loc.split(",").map(Number);
            flagUrl = `https://flagcdn.com/w320/${countryCode.toLowerCase()}.png`;
        }

        const newLocation = new Location({
            intendedCity: city || null,
            intendedCountry: country,
            actualCity,
            actualCountry,
            lat,
            lng,
            flagUrl
        });
        await newLocation.save();

        res.json({
            intendedCity: city || null,
            intendedCountry: country,
            actualCity,
            actualCountry,
            lat,
            lng,
            flagUrl
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Could not track location manually" });
    }
});

// Post a Comment
router.post("/comment", async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) return res.status(400).json({ error: "Comment text is required" });

        // Determine the user's country via IP
        const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
        let country, flagUrl;

        if (ip === "127.0.0.1" || ip === "::1") {
            country = "China";
            flagUrl = `https://flagcdn.com/w320/cn.png`;
        } else {
            const response = await axios.get(`https://ipinfo.io/${ip}/json`);
            const { country: ipCountry, countryCode } = response.data;

            if (!ipCountry || !countryCode) {
                return res.status(400).json({ error: "Could not determine your location" });
            }

            country = ipCountry;
            flagUrl = `https://flagcdn.com/w320/${countryCode.toLowerCase()}.png`;
        }

        const newComment = new Comment({ text, country, flagUrl });
        await newComment.save();
        res.status(201).json({ message: "Comment posted", country, flagUrl });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Could not post comment" });
    }
});

// Get All Tracked Locations
router.get("/locations", async (req, res) => {
    try {
        const locations = await Location.find().sort({ timestamp: -1 });
        res.json(locations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Could not fetch locations" });
    }
});

module.exports = router;