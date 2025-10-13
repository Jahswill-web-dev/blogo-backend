import dotenv from "dotenv";
dotenv.config();

import express from "express";
import session from "express-session";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "./auth/google";
import authRoutes from "./routes/auth";
import contentRoutes from "./routes/content";
import linkedinAuthRoutes from "./routes/linkedinAuth";
import publishRoutes from "./routes/publish";
import facebookAuthRoutes from "./routes/facebookAuth";
import xAuthRoutes from "./routes/xAuth";
import linkedinPostRoutes from "./routes/linkedinPost";
import userProfileRoutes from "./routes/userProfile";
import contentPlanRoutes from "./routes/contentPlan";


const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // ⚠️ remember to set to true only in production with HTTPS
  })
);


app.use("/auth", authRoutes);
app.use("/content", contentRoutes);
app.use(linkedinAuthRoutes);
app.use(linkedinPostRoutes);
app.use("/publish", publishRoutes);
app.use(facebookAuthRoutes);
app.use(xAuthRoutes);
app.use("/profile", userProfileRoutes);
app.use("/content-plan", contentPlanRoutes);

mongoose.connect(process.env.MONGO_URI!).then(() => {
  console.log("✅ MongoDB connected");
});

app.get("/", (_, res) => res.send("Blogo backend running 🚀"));

app.listen(4000, () => {
  console.log("Server running on http://localhost:4000");
});
