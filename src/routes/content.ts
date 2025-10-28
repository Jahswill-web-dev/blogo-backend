import { Router } from "express";
import crypto from "crypto";
import { runGemini } from "../services/geminiClient";
import { prompts } from "../services/prompts/prompts";
import jwtAuth from "../middleware/jwtAuth";
import { bulkGeneratePrompt } from "../services/prompts/bulkGenerate";
import UserProfile from "../models/UserProfile";
import ContentIdeas from "../models/ContentIdeas";
import ContentPost from "../models/ContentPost";

const router = Router();

// POST /content/generate
router.post("/generate-posts", jwtAuth, async (req, res) => {
  try {
    const user = req.user;
    const { platform, voice } = req.body;
    const capitalize = (value: string) => {
      if (!value) return value;
      return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    };

    const formattedPlatform = capitalize(platform);
    const formattedVoice = capitalize(voice);
    console.log("Platform:", formattedPlatform, "Voice:", formattedVoice);
    // if (!mode || !text) {
    //   return res.status(400).json({ error: "mode and text are required" });
    // }

    // let prompt: string;
    // if (mode === "platform_adaptation" && platform) {
    //   prompt = prompts.platform_adaptation(text, platform);
    // } else if(mode === "audience_simulation" && target) {
    //     prompt = prompts.audience_simulation(text, target);
    // }
    // else {
    //   prompt = (prompts as any)[mode](text);
    // }
    const userProfile = await UserProfile.findOne({ userId: (user as any)._id });
    if (!userProfile) return res.status(404).json({ error: "User profile not found" });
    const latestideas = await ContentIdeas.findOne({ userId: (user as any)._id }).sort({ createdAt: -1 }).limit(1);
    const ideas = latestideas.ideas || [];

    // console.log("Latest Ideas:", ideas.join(", "));
    if (ideas.length === 0) {
      return res.status(404).json({ error: "No content ideas found for user" });
    }
    const promptData = {
      startup_name: userProfile.companyName,
      industry: userProfile.industry,
      description: userProfile.description,
      // product_overview: userProfile.productOverview,
      audience: userProfile.audience.join(", "),
      platform: formattedPlatform,
      voice: voice,
      ideas: ideas
    };

    let prompt = bulkGeneratePrompt.developPosts(promptData);

    const output = await runGemini(prompt);
    // store output in database
    if (!output) {
      return res.status(500).json({ error: "AI generation failed" });
    }

    let posts: { content: string }[] = [];
    try {
      const parsed = JSON.parse(output);
      console.log("Parsed Gemini Response:", parsed);
      if (parsed.posts && Array.isArray(parsed.posts)) {
        posts = parsed.posts;
      } else {
        throw new Error("Invalid posts format");
      }
    } catch (error) {
      console.error("Failed to parse Gemini response:", error);
      return res.status(500).json({
        error: "Invalid AI response format. Expected JSON with 'posts' array.",
      });
    }


    const batchId = crypto.randomUUID();

    const postBatch = await ContentPost.create({
      userId: (user as any)._id,
      batchId,
      platform: formattedPlatform,
      posts: posts.map((p, index) => ({
        postText: p.content,
      })),
      generatedCount: posts.length,
    });


    res.json({ posts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate content" });
  }
});


export default router;
