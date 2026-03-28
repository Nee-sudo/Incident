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

        const leaderboardData = await Location.aggregate([
            {
                $group: {
                    _id: "$actualCountry",
                    visits: { $sum: 1 },
                    flagUrl: { $first: "$flagUrl" },
                },
            },
            { $sort: { visits: -1 } },
            { $limit: 10 },
            {
                $project: {
                    country: "$_id",
                    visits: 1,
                    flagUrl: 1,
                    countryCode: {
                        $toLower: "$_id",
                    },
                    _id: 0,
                },
            },
        ]);

        const enrichedData = leaderboardData.map((entry) => ({
            country: entry.country || "Unknown",
            visits: entry.visits,
            countryCode: entry.countryCode || "xx",
            flagUrl: entry.flagUrl || `https://flagcdn.com/w320/xx.png`,
        }));

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(enrichedData),
        };
    } catch (error) {
        console.error("Error in leaderboard function:", error.message);
        return {
            statusCode: 500,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ error: "Internal server error" }),
        };
    }
};
