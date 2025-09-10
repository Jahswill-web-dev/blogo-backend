import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "./auth/google";
import authRoutes from "./routes/auth";



const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());
app.use("/auth", authRoutes);

mongoose.connect(process.env.MONGO_URI!).then(() => {
  console.log("✅ MongoDB connected");
});

app.get("/", (_, res) => res.send("Blogo backend running 🚀"));

app.listen(4000, () => {
  console.log("Server running on http://localhost:4000");
});
