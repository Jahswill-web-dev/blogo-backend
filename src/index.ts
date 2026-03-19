import dotenv from "dotenv";
dotenv.config();

import express from "express";
import path from "path";
import swaggerUi from "swagger-ui-express";
import swaggerFile from "./swagger-output.json";
import session from "express-session";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "./auth/google";
import authRoutes from "./routes/auth/auth";
import xAuthRoutes from "./routes/auth/xAuth";
import userProfileRoutes from "./routes/user/userProfile";
import categoriesRoutes from "./routes/content/categories.routes";
import aiSaasProfile from "./routes/content/saasProfile.routes";
import subtopicRoutes from "./routes/content/subtopic.routes";
import subtopicPostRoutes from "./routes/content/subtopicPost.routes";

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


app.get("/test-ui", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "test-ui.html"));
});

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use("/auth", authRoutes);
app.use(xAuthRoutes);
app.use("/profile", userProfileRoutes);
app.use(categoriesRoutes);
app.use(aiSaasProfile);
app.use(subtopicRoutes);
app.use(subtopicPostRoutes);

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

