import express from "express";
import authRoutes from './routes/auth.routes.js';
import {connectDB} from "./db/connection.js";
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import cookieParser from "cookie-parser";


const app = express();
const PORT = process.env.PORT || 9000;

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser())

// routes
app.use("/api/auth", authRoutes)


app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
    connectDB();
});