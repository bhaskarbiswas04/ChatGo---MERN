import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors"
import dotenv from "dotenv";

import { app, server } from "./socket/socket.js";
import connectDB from "./config/database.js";

dotenv.config({});
connectDB();

import userRoute from "./routes/userRoute.js";
import messageRoute from "./routes/messageRoute.js"


const PORT = process.env.PORT || 5000;

//middleware
app.use(express.urlencoded({extended: true}))
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
  "http://localhost:5173",
  "https://chat-go-ui.vercel.app",
];

const corsOptions = {
  origin: allowedOrigins,
  credentials: false,
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

//routes
app.get("/", (req, res) => {
  res.send("Backend is running - ChatGo application.");
});
app.use("/api/v1/user", userRoute);
app.use("/api/v1/message", messageRoute)

server.listen(PORT, ()=>{
    console.log(`Server listen at port: ${PORT}`);
})