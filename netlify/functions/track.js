const axios = require("axios");
const { connectToDatabase } = require("./utils/db");
const Location = require("../../models/locationModel");

const IPINFO_TOKEN = process.env.IPINFO_TOKEN || "032783179f989d";

exports.handler = async (event) => {
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ error: "Method not allowed" }),
        };
    }

    try {
        await connectToDatabase();

        const { ipAddress } = JSON.parse(event.body);

        if (!ipAddress || typeof ipAddress !== "string") {
            return {
                statusCode: 400,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ error: "Valid IP address is required" }),
            };
        }

        const response = await axios.get(`https://ipinfo.io/${ipAddress}?token=${IPINFO_TOKEN}`);
        const { city, country: countryCode, loc } = response.data;

        if (!city || !countryCode || !loc) {
            return {
                statusCode: 400,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ error: "Incomplete location data from IP" }),
            };
        }

        const [lat, lng] = loc.split(",").map(Number);
        if (isNaN(lat) || isNaN(lng)) {
            return {
                statusCode: 400,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ error: "Invalid latitude/longitude format" }),
            };
        }

        const flagUrl = `https://flagcdn.com/w320/${countryCode.toLowerCase()}.png`;

        const newLocation = new Location({
            intendedCity: null,
            intendedCountry: null,
            actualCity: city,
            actualCountry: countryCode,
            lat,
            lng,
            flagUrl,
        });

        await newLocation.save();

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                intendedCity: null,
                intendedCountry: null,
                actualCity: city,
                actualCountry: countryCode,
                lat,
                lng,
                flagUrl,
            }),
        };
    } catch (error) {
        console.error("Error in track function:", error.message);
        return {
            statusCode: 500,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ error: "Internal server error" }),
        };
    }
};
