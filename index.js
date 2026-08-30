import express from "express";
import os from "os";

const app = express();

const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());

// Serve frontend
app.use(express.static("public"));


// ===============================
// API ROUTES
// ===============================

// Root API
app.get("/api", (req, res) => {
    res.json({
        application: "DevOps Dashboard",
        message: "Welcome to DevOps Dashboard PRO",
        status: "running"
    });
});


// Health Check
app.get("/api/health", (req, res) => {
    res.status(200).json({
        status: "UP",
        message: "Application is healthy",
        timestamp: new Date().toISOString()
    });
});


// Server Information
app.get("/api/info", (req, res) => {

    res.status(200).json({
        application: "DevOps Dashboard",
        version: "1.0.0",
        nodeVersion: process.version,
        platform: process.platform,
        hostname: os.hostname(),
        environment: process.env.NODE_ENV || "development",
        uptime: `${Math.floor(process.uptime())} seconds`
    });

});


// Test API
app.get("/api/message", (req, res) => {

    res.status(200).json({
        status: "success",
        message: "Hello from Node.js + Express!"
    });

});


// ===============================
// 404 HANDLER
// ===============================

app.use((req, res) => {

    res.status(404).json({
        status: "error",
        message: "Route not found"
    });

});


// ===================================== 
//  Export application for testing 
//  =====================================

export { app };

// ===============================
// START SERVER
// ===============================

app.listen(PORT, "0.0.0.0", () => {

    console.log("=================================");
    console.log(" DevOps Dashboard PRO");
    console.log("=================================");
    console.log(` Server running on port ${PORT}`);
    console.log(` http://localhost:${PORT}`);
    console.log("=================================");

});