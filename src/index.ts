import dotenv from "dotenv";
dotenv.config();

import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerFile from "./swagger-output.json";
import session from "express-session";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "./auth/google";
import authRoutes from "./routes/auth/auth";
import contentRoutes from "./routes/not-in-use/content";
import linkedinAuthRoutes from "./routes/not-in-use/linkedinAuth";
import publishRoutes from "./routes/not-in-use/publish";
// import facebookAuthRoutes from "./routes/facebookAuth";
import xAuthRoutes from "./routes/auth/xAuth";
import linkedinPostRoutes from "./routes/not-in-use/linkedinPost";
import userProfileRoutes from "./routes/user/userProfile";
import contentPlanRoutes from "./routes/not-in-use/contentPlan";
import generateIdeas from "./routes/not-in-use/generateIdeas";
import post from "./routes/not-in-use/post";
import scheduledPost from "./routes/socials/scheduledPost";
import categoriesRoutes from "./routes/content/categories.routes";
import painPostsRoutes from "./routes/content/painSolution.routes";
import bulkPosts from "./routes/content/generateBulk.routes";
import aiSaasProfile from "./routes/content/saasProfile.routes";

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


app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use("/auth", authRoutes);
app.use("/content", contentRoutes);
app.use(categoriesRoutes);
app.use(linkedinAuthRoutes);
app.use(linkedinPostRoutes);
app.use("/publish", publishRoutes);
// app.use(facebookAuthRoutes);
app.use(xAuthRoutes);
app.use("/profile", userProfileRoutes);
app.use("/content-plan", contentPlanRoutes);
app.use(generateIdeas);
app.use(post);
app.use(scheduledPost);
app.use(painPostsRoutes);
app.use(bulkPosts);
app.use(aiSaasProfile);
async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI!, {
    });
    console.log("✅ MongoDB connected");
    app.get("/", (_, res) => res.send("Blogo backend running 🚀"));

    app.listen(4000, () => {
      console.log("Server running on http://localhost:4000");
    });
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
}

startServer();

