const axios = require("axios");
const { connectToDatabase } = require("./utils/db");
const Comment = require("../../models/commentModel");

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

        const { text, ipAddress } = JSON.parse(event.body);

        if (!text || typeof text !== "string") {
            return {
                statusCode: 400,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ error: "Comment text is required" }),
            };
        }

        if (!ipAddress || typeof ipAddress !== "string") {
            return {
                statusCode: 400,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ error: "Valid IP address is required" }),
            };
        }

        const response = await axios.get(`https://ipinfo.io/${ipAddress}?token=${IPINFO_TOKEN}`);
        const { country: countryCode } = response.data;

        if (!countryCode) {
            return {
                statusCode: 400,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ error: "Could not determine country from IP" }),
            };
        }

        const flagUrl = `https://flagcdn.com/w320/${countryCode.toLowerCase()}.png`;

        const newComment = new Comment({
            text,
            country: countryCode,
            flagUrl,
        });

        await newComment.save();

        return {
            statusCode: 201,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                message: "Comment posted",
                country: countryCode,
                flagUrl,
            }),
        };
    } catch (error) {
        console.error("Error in comment function:", error.message);
        return {
            statusCode: 500,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ error: "Internal server error" }),
        };
    }
};
