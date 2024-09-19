// routes/auth.js
const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

// Registration route
router.post("/register", async (req, res) => {
	const { username, email, password } = req.body;
	try {
		const user = new User({ username, email, password });
		await user.save();
		res.status(201).json({ message: "User registered successfully" });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

// Login route
router.post("/login", async (req, res) => {
	const { email, password } = req.body;
	try {
		const user = await User.findOne({ email });
		if (!user) return res.status(401).json({ error: "Invalid credentials" });

		const isMatch = await user.comparePassword(password);
		if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
			expiresIn: "1h",
		});
		res.json({ token });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Middleware to protect routes
function authenticateToken(req, res, next) {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];
	if (token == null) return res.sendStatus(401);

	jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
		if (err) return res.sendStatus(403);
		req.user = user;
		next();
	});
}

module.exports = { router, authenticateToken };
