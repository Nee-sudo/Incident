const { connectToDatabase } = require("./utils/db");
const Comment = require("../../models/commentModel");

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

        const comments = await Comment.find().sort({ timestamp: -1 });

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(comments),
        };
    } catch (error) {
        console.error("Error in comments function:", error.message);
        return {
            statusCode: 500,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ error: "Could not fetch comments" }),
        };
    }
};
