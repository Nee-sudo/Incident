const express = require("express");
const axios = require("axios");
const Location = require("../models/locationModel");
const Comment = require("../models/commentModel");
const router = express.Router();

// ipinfo.io API token (replace with your own token)
const IPINFO_TOKEN = "032783179f989d"; // Ensure this is valid; sign up at ipinfo.io for a free token

// Track User Location with IP
router.post("/track", async (req, res) => {
    try {
        const { ipAddress } = req.body;

        // Log IP for debugging
        console.log("Received IP Address for /track:", ipAddress);

        // Validate IP address
        if (!ipAddress || typeof ipAddress !== "string") {
            return res.status(400).json({ error: "Valid IP address is required" });
        }

        // Fetch geolocation data using ipinfo.io
        const response = await axios.get(`https://ipinfo.io/${ipAddress}?token=${IPINFO_TOKEN}`);
        const { city, country: countryCode, loc } = response.data;

        console.log("Geolocation data:", response.data);

        // Validate response data
        if (!city || !countryCode || !loc) {
            return res.status(400).json({ error: "Incomplete location data from IP" });
        }

        const [lat, lng] = loc.split(",").map(Number);
        if (isNaN(lat) || isNaN(lng)) {
            return res.status(400).json({ error: "Invalid latitude/longitude format" });
        }

        // Use country code for flag URL (ipinfo returns country as code like "US")
        const flagUrl = `https://flagcdn.com/w320/${countryCode.toLowerCase()}.png`;

        const newLocation = new Location({
            intendedCity: null,
            intendedCountry: null,
            actualCity: city,
            actualCountry: countryCode, // Store as code, not full name
            lat,
            lng,
            flagUrl
        });

        await newLocation.save();

        res.json({
            intendedCity: null,
            intendedCountry: null,
            actualCity: city,
            actualCountry: countryCode,
            lat,
            lng,
            flagUrl
        });
    } catch (error) {
        console.error("Error in /track endpoint:", error.message);
        if (error.response) {
            // Handle API-specific errors
            return res.status(502).json({ error: "Failed to fetch location data from ipinfo.io" });
        }
        res.status(500).json({ error: "Internal server error" });
    }
});

// Manual Location Input (Based on intended country and IP)
router.post("/track/manual", async (req, res) => {
    try {
        const { city, country, ipAddress } = req.body;

        // Validate inputs
        if (!country || typeof country !== "string") {
            return res.status(400).json({ error: "Valid country is required" });
        }
        if (!ipAddress || typeof ipAddress !== "string") {
            return res.status(400).json({ error: "Valid IP address is required" });
        }

        let actualCity, actualCountry, lat, lng, flagUrl;

        // Handle localhost IPs
        if (ipAddress === "127.0.0.1" || ipAddress === "::1") {
            const mockData = {
                city: "Beijing",
                country: "CN",
                loc: "39.9042,116.4074"
            };
            actualCity = mockData.city;
            actualCountry = mockData.country;
            [lat, lng] = mockData.loc.split(",").map(Number);
            flagUrl = `https://flagcdn.com/w320/${mockData.country.toLowerCase()}.png`;
        } else {
            // Fetch geolocation data
            const response = await axios.get(`https://ipinfo.io/${ipAddress}?token=${IPINFO_TOKEN}`);
            const { city: ipCity, country: ipCountry, loc } = response.data;

            if (!ipCity || !ipCountry || !loc) {
                return res.status(400).json({ error: "Incomplete location data from IP" });
            }

            actualCity = ipCity;
            actualCountry = ipCountry; // Country code (e.g., "US")
            [lat, lng] = loc.split(",").map(Number);
            flagUrl = `https://flagcdn.com/w320/${ipCountry.toLowerCase()}.png`;
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
        console.error("Error in /track/manual endpoint:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Post a Comment
router.post("/comment", async (req, res) => {
    try {
        const { text, ipAddress } = req.body;

        console.log("Received IP Address for /comment:", ipAddress);

        if (!text || typeof text !== "string") {
            return res.status(400).json({ error: "Comment text is required" });
        }
        if (!ipAddress || typeof ipAddress !== "string") {
            return res.status(400).json({ error: "Valid IP address is required" });
        }

        // Fetch geolocation data
        const response = await axios.get(`https://ipinfo.io/${ipAddress}?token=${IPINFO_TOKEN}`);
        const { country: countryCode } = response.data;

        if (!countryCode) {
            return res.status(400).json({ error: "Could not determine country from IP" });
        }

        const flagUrl = `https://flagcdn.com/w320/${countryCode.toLowerCase()}.png`;

        const newComment = new Comment({
            text,
            country: countryCode,
            flagUrl
        });

        await newComment.save();

        res.status(201).json({
            message: "Comment posted",
            country: countryCode,
            flagUrl
        });
    } catch (error) {
        console.error("Error in /comment endpoint:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Get All Comments
router.get("/comments", async (req, res) => {
    try {
        const comments = await Comment.find().sort({ timestamp: -1 });
        res.json(comments);
    } catch (error) {
        console.error("Error in /comments endpoint:", error.message);
        res.status(500).json({ error: "Could not fetch comments" });
    }
});

// Get All Tracked Locations
router.get("/locations", async (req, res) => {
    try {
        const locations = await Location.find().sort({ timestamp: -1 });
        res.json(locations);
    } catch (error) {
        console.error("Error in /locations endpoint:", error.message);
        res.status(500).json({ error: "Could not fetch locations" });
    }
});

// Leaderboard API Endpoint
router.get("/leaderboard", async (req, res) => {
    try {
        const leaderboardData = await Location.aggregate([
            {
                $group: {
                    _id: "$actualCountry", // Group by actual country (stored as code, e.g., "US")
                    visits: { $sum: 1 },
                    flagUrl: { $first: "$flagUrl" } // Take the first flag URL for consistency
                }
            },
            { $sort: { visits: -1 } }, // Sort by visits descending
            { $limit: 10 }, // Top 10 countries
            {
                $project: {
                    country: "$_id", // Country code (e.g., "US")
                    visits: 1,
                    flagUrl: 1, // Full flag URL (e.g., "https://flagcdn.com/w320/us.png")
                    countryCode: {
                        $toLower: "$_id" // Ensure country code is lowercase for frontend consistency
                    },
                    _id: 0
                }
            }
        ]);

        // Ensure flagUrl is valid; fallback if missing
        const enrichedData = leaderboardData.map(entry => ({
            country: entry.country || "Unknown",
            visits: entry.visits,
            countryCode: entry.countryCode || "xx",
            flagUrl: entry.flagUrl || `https://flagcdn.com/w320/xx.png`
        }));

        res.json(enrichedData);
    } catch (error) {
        console.error("Error in /leaderboard endpoint:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;