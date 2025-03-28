const express = require("express");
const router = express.Router();
const Comment = require("../models/commentModel");
const { countries } = require("countries-list");

router.get("/", async (req, res) => {
    try {
        const comments = await Comment.find().sort({ timestamp: -1 });
        const countryList = Object.values(countries).map(country => ({
            name: country.name,
            code: country.code
        })).sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically
        res.render("index", { comments, countryList });
    } catch (error) {
        console.error("Error fetching comments:", error);
        res.render("index", { comments: [], countryList: [] });
    }
});

module.exports = router;