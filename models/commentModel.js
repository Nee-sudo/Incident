// models/commentModel.js
const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    text: String,
    country: String,
    flagUrl: String,
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Comment", commentSchema);