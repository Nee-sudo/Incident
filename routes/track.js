const express = require("express");
const axios = require("axios");
const Location = require("../models/locationModel");
const Comment = require("../models/commentModel");
const countryCodes = require("../utils/countryCodes"); // Add this
const router = express.Router();

// Track User Location with IP
// Track User Location with IP
router.get("/track", async (req, res) => {
    try {
        const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

        if (ip === "127.0.0.1" || ip === "::1") {
            const mockData = {
                city: "Beijing",
                country: "China",
                loc: "39.9042,116.4074", // Coordinates for Beijing, China
                countryCode: "CN"
            };
            const { city, country, loc, countryCode } = mockData;
            const [lat, lng] = loc.split(",").map(Number);
            const flagUrl = `https://flagcdn.com/w320/${countryCode.toLowerCase()}.png`;

            const newLocation = new Location({ city, country, lat, lng, flagUrl });
            await newLocation.save();

            return res.json({ city, country, lat, lng, flagUrl });
        }

        const response = await axios.get(`https://ipinfo.io/${ip}/json`);
        const { city, country, loc, countryCode } = response.data;

        if (!city || !country || !loc) return res.status(400).json({ error: "Location not found" });

        const [lat, lng] = loc.split(",").map(Number);
        const flagUrl = `https://flagcdn.com/w320/${countryCode.toLowerCase()}.png`;

        const newLocation = new Location({ city, country, lat, lng, flagUrl });
        await newLocation.save();

        res.json({ city, country, lat, lng, flagUrl });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Could not track location" });
    }
});

// Manual Location Input
router.post("/track/manual", async (req, res) => {
    try {
        const { city, country, lat, lng } = req.body;
        if (!city || !country || !lat || !lng) {
            return res.status(400).json({ error: "All fields are required" });
        }
        if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
            return res.status(400).json({ error: "Invalid latitude or longitude" });
        }
        // Look up country code (convert country to lowercase for matching)
        const countryKey = country.toLowerCase();
        const countryCode = countryCodes[countryKey] || "xx"; // Fallback to "xx" if not found
        const flagUrl = `https://flagcdn.com/w320/${countryCode.toLowerCase()}.png`;
        const newLocation = new Location({ city, country, lat, lng, flagUrl });
        await newLocation.save();
        res.json({ city, country, lat, lng, flagUrl });
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
        const newComment = new Comment({ text });
        await newComment.save();
        res.status(201).json({ message: "Comment posted" });
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