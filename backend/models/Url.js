// models/Url.js
const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
	original_url: String,
	short_url: String,
	createdAt: { type: Date, default: Date.now, expires: "30d" }, // 'expires' sets TTL
});

module.exports = mongoose.model("Url", urlSchema);
