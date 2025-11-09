const { connectToDatabase } = require("./utils/db");
const Location = require("../../models/locationModel");

exports.handler = async (event) => {
    if (event.httpMethod !== "GET") {
        return {
            statusCode: 405,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ error: "Method not allowed" }),
        };
    }

    try {
        await connectToDatabase();

        const locations = await Location.find().sort({ timestamp: -1 });

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(locations),
        };
    } catch (error) {
        console.error("Error in locations function:", error.message);
        return {
            statusCode: 500,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ error: "Could not fetch locations" }),
        };
    }
};
