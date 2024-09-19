const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const { router: authRoutes } = require("./routes/auth");
const urlsRouter = require("./routes/urls"); // Import the urls routes

const app = express();

app.use(express.json());

// Connect to MongoDB
mongoose
	.connect(process.env.MONGODB_URL)
	.then(() => console.log("Connected to the database"))
	.catch((err) => console.error("MongoDB connection error:", err));

// Use authentication routes
app.use("/auth", authRoutes);

// Use URL shortener routes (protected)
app.use("/", urlsRouter); // Base path for URL routes is "/" to match short URL without "/urls"

app.listen(process.env.PORT || 3000, () => {
	console.log(`Server running on port ${process.env.PORT || 3000}`);
});
