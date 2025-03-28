const express = require("express");
const router = express.Router();
const Comment = require("../models/commentModel"); // MongoDB Comment Model

router.get("/", async (req, res) => {
    try {
        const comments = await Comment.find().sort({ timestamp: -1 });
        res.render("index", { comments });
    } catch (error) {
        console.error("Error fetching comments:", error);
        res.render("index", { comments: [] });
    }
});

module.exports = router;
