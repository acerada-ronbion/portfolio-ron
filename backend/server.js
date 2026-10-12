const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const profileRoutes = require("./routes/profileRoutes");
const projectRoutes = require("./routes/projectRoutes");
const certificateRoutes = require("./routes//certificateRoutes");
const documentRoutes = require("./routes/documentRoutes");
const linkRoutes = require("./routes/linkRoutes");

const app = express();
app.use(cors());
app.use(express.json());
const publicDirectory = path.join(__dirname, "../public");
app.use(express.static(publicDirectory));

app.use("/api/profile", profileRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/links", linkRoutes);
app.get("/", (req, res) => {
    res.redirect("/src/html/index.html");
});

const PORT = process.env.PORT || 5000;

if (!process.env.MONGO_URI) {
    console.error("Missing MONGO_URI in environment variables.");
    process.exit(1);
}

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected");

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err.message || err);
        process.exit(1);
    });