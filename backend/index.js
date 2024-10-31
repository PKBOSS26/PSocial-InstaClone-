import express, { urlencoded } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./utils/db.js";
import userRoute from './routes/userRoute.js';
import postRoute from './routes/postRoute.js';
import messageRoute from './routes/messageRoute.js';
import { app, server } from "./socket/socket.js";
import path from "path";

dotenv.config({});

const PORT = process.env.PORT || 3000;

const __dirname = path.resolve();


// Root route
app.get("/", (req, res) => {
    return res.status(200).json({
        msg: "talking from be",
        success: true
    });
});

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));

//CORS configuration
const corsOptions = {
    origin: "http://localhost:5173", // Frontend origin
    credentials: true // Correct key for allowing credentials
};
app.use(cors(corsOptions));

// API routes
app.use('/api/v1/user', userRoute);
app.use('/api/v1/post', postRoute);
app.use('/api/v1/message', messageRoute);

// Serve static files
app.use(express.static(path.join(__dirname, "/frontend/dist")));
app.get("*", (req,res)=>{
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
})

// Start server and connect to database
server.listen(PORT, () => {
    connectDB();
    console.log(`App is listening on port ${PORT}`);
});
