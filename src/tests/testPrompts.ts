import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";

import { generateCategories, generatePainCategories, generateQuestionTypes } from "../pipelines/categoriesPipeline";
import { generateEducationalPost } from "../pipelines/generateFinalPost";
import { generateInitialPost } from "../pipelines/generateInitialPost";

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log("✅ MongoDB connected");
    const inputVars = {
      industry: "SaaS / Marketing Tech",
      product: "AI Content Engine for Solo SaaS Builders/indie hackers",
      target_audience: "Solo saas founders, Solo founders, Indie hackers/devs",
      pain_points: "inconsistent posting, lack of time, not getting users",
      content_goal: "help Solo saas builders publish consistently",
      description: "A tool that generate and schedule X posts for indie hackers and solo builders",
      tone: "friendly",
      creativity: "medium",
      platform: "X",
      // industry: "DevTools / Monitoring",
      // product: "Real-Time Bug & Error Tracker",
      // target_audience: "software engineers, solo devs, CTOs, early engineering teams",
      // pain_points: "missed bugs, user frustration, lack of visibility into failures",
      // content_goal: "help teams catch issues before users do",
      // description: "automatically identifies, logs, and alerts teams about app errors",
      // tone: "technical but approachable",
      // creativity: "medium",
      // platform: "X"
    };
    // const result = await generateInitialPost(inputVars);
    // const result = await generatePainCategories(inputVars);
    // const result = await generateCategories(inputVars);  
    // const result = await generateEducationalPost(inputVars);
     const result = await generateQuestionTypes(inputVars);

    console.log("POST JSON:", result);
  } catch (error) {
    console.error("Error in test script:", error);
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB disconnected");
  }
}

run();
