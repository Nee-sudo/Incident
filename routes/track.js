const express = require("express");
const axios = require("axios");
const Location = require("../models/locationModel");
const Comment = require("../models/commentModel");
const countryCodes = require("../utils/countryCodes");
const router = express.Router();

// ipinfo.io API token (replace with your own token)
const IPINFO_TOKEN = "032783179f989d"; // Sign up at ipinfo.io to get a free token

// Track User Location with IP
router.post("/track", async (req, res) => {
    try {
        const { ipAddress } = req.body;
        console.log("IP Address:", ipAddress); // Log the IP address for debugging

        if (!ipAddress) {
            return res.status(400).json({ error: "IP address is required" });
        }
        else {
            console.log("IP Address provided:", ipAddress); // Log the provided IP address
        }

        // For local testing, use mock data
        // if (ipAddress) {
        //     const mockData = {
        //         city: "Beijing",
        //         country: "China",
        //         loc: "39.9042,116.4074",
        //         countryCode: "CN" // Mock data for local testing
        //     };
        //     const { city, country, loc, countryCode } = mockData;
        //     const [lat, lng] = loc.split(",").map(Number);
        //     const flagUrl = `https://flagcdn.com/w320/${countryCode.toLowerCase()}.png`;

        //     const newLocation = new Location({
        //         intendedCity: null,
        //         intendedCountry: null,
        //         actualCity: city,
        //         actualCountry: country,
        //         lat,
        //         lng,
        //         flagUrl
        //     });
        //     await newLocation.save();

        //     return res.json({
        //         intendedCity: null,
        //         intendedCountry: null,
        //         actualCity: city,
        //         actualCountry: country,
        //         lat,
        //         lng,
        //         flagUrl
        //     });
        // }

        // Fetch geolocation data using ipinfo.io
        const response = await axios.get(`https://ipinfo.io/${ipAddress}?token=${IPINFO_TOKEN}`);
        const { city, country, loc, countryCode } = response.data;
        console.log("Geolocation data:", response.data); // Log the geolocation data for debugging

        if (!city || !country || !loc) {
            return res.status(400).json({ error: "Location not found" });
        }

        const [lat, lng] = loc.split(",").map(Number);
        const flagUrl = `https://flagcdn.com/w320/${country.toLowerCase()}.png`;

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
        console.error("Error tracking location:", error.message);
        res.status(500).json({ error: "Could not track location" });
    }
});

// Manual Location Input (Now based on intended country and IP)
router.post("/track/manual", async (req, res) => {
    try {
        const { city, country, ipAddress } = req.body;
        if (!country) {
            return res.status(400).json({ error: "Country is required" });
        }
        if (!ipAddress) {
            return res.status(400).json({ error: "IP address is required" });
        }

        let actualCity, actualCountry, lat, lng, flagUrl;

        // For local testing, use mock data
        if (ipAddress === "127.0.0.1" || ipAddress === "::1") {
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
            // Fetch geolocation data using ipinfo.io
            const response = await axios.get(`https://ipinfo.io/${ipAddress}?token=${IPINFO_TOKEN}`);
            const { city: ipCity, country: ipCountry, loc, countryCode } = response.data;

            if (!ipCity || !ipCountry || !loc || !countryCode) {
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
        console.error("Error tracking location manually:", error.message);
        res.status(500).json({ error: "Could not track location manually" });
    }
});

// Post a Comment
router.post("/comment", async (req, res) => {
    try {
        const { text, ipAddress } = req.body;
        console.log("User IP Address:", ipAddress); // Log the IP address for debugging
        if (!text) return res.status(400).json({ error: "Comment text is required" });
        if (!ipAddress) return res.status(400).json({ error: "IP address is required" });

        let country, flagUrl;

        // Fetch geolocation data using ipinfo.io
        const response = await axios.get(`https://ipinfo.io/${ipAddress}?token=${IPINFO_TOKEN}`);
        console.log("Geolocation data for comment:", response.data);
        
        if (!response.data || !response.data.country) {   
            return res.status(400).json({ error: "Could not determine your location" });
        }

        // Assign values properly
        country = response.data.country;
        flagUrl = `https://flagcdn.com/w320/${country.toLowerCase()}.png`;

        // Save comment to the database
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