const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");


// Middleware to serve static files from the public folder
app.use(express.static(path.join(__dirname, "public")));

// Set view engine to EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware to parse the request body
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:5173", "https://fishonworldtour.up.railway.app","http://127.0.0.1:3000","https://fishonworldtour.netlify.app","https://fishonworldtour.vercel.app","https://fishonworldtour.onrender.com"], // Added Vite port 5173
    methods: ["GET", "POST"],
    credentials: true
}));


// Middleware to parse JSON bodies
app.use(express.json());

// Connect to MongoDB
const mongoDBUrl = process.env.MONGO_DB_URL || "mongodb://localhost:27017/fishTracker";
mongoose.connect(mongoDBUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("Failed to connect to MongoDB", err));



// Import routes (ensure each route file exports a router)
const homeRoute = require("./routes/home");
const goalRoute = require("./routes/goal");
const dreamRoute = require("./routes/dream");
const aboutRoute = require("./routes/about");
const trackRoutes = require("./routes/track");


// Use routes
app.use("/", homeRoute);
app.use("/goal", goalRoute);
app.use("/dream", dreamRoute);
app.use("/about", aboutRoute);
app.use("/api", trackRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
