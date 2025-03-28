const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    // Render the goal.ejs view
    res.render("about");
});

module.exports = router;
