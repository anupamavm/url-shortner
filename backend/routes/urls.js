const express = require("express");
const shortid = require("shortid");
const Url = require("../models/Url");
const { authenticateToken } = require("./auth");

const router = express.Router();

// POST /shorten - Create a shortened URL (protected route)
router.post("/shorten", authenticateToken, async (req, res) => {
	const originalUrl = req.body.url;
	const shortUrl = shortid.generate();

	const url = new Url({ original_url: originalUrl, short_url: shortUrl });
	await url.save();

	res.json({
		originalUrl,
		shortUrl: `${process.env.BASE_URL}/${shortUrl}`, // No "/urls" prefix here
	});
});

// GET /:shortUrl - Redirect to the original URL
router.get("/:shortUrl", async (req, res) => {
	const { shortUrl } = req.params;
	const url = await Url.findOne({ short_url: shortUrl });

	if (url) {
		res.redirect(url.original_url);
	} else {
		res.status(404).send("URL not found");
	}
});

module.exports = router;
