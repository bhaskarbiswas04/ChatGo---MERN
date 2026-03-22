import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors"
import dotenv from "dotenv";
dotenv.config({});


import connectDB from "./config/database.js";

connectDB();

import userRoute from "./routes/userRoute.js";
import messageRoute from "./routes/messageRoute.js"

const app = express();

const PORT = process.env.PORT || 5000;

//middleware
app.use(express.urlencoded({extended: true}))
app.use(express.json());
app.use(cookieParser());

const corsOptions = {
  origin: "http://localhost:5173",
  credentials:true,
};
app.use(cors(corsOptions));

//routes
app.get("/", (req, res) => {
  res.send("🚀 Backend is running - Chat application.");
});

app.use("/api/v1/user", userRoute);
app.use("/api/v1/message", messageRoute)

app.listen(PORT, ()=>{
    console.log(`Server listen at port: ${PORT}`);
})