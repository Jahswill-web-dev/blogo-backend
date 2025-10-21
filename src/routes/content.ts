import { Router } from "express";
import { runGemini } from "../services/geminiClient";
import { prompts } from "../services/prompts/prompts";
import jwtAuth from "../middleware/jwtAuth";
import { bulkGeneratePrompt } from "../services/prompts/bulkGenerate";
import UserProfile from "../models/UserProfile";
import ContentIdeas from "../models/ContentIdeas";

const router = Router();

// POST /content/generate
router.post("/generate-posts", jwtAuth, async (req, res) => {
  try {
    const user = req.user;
    const { platform, voice } = req.body;

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
      platform: platform,
      voice:voice,
      ideas:ideas
    };

    let prompt = bulkGeneratePrompt.developPosts(promptData);

    const output = await runGemini(prompt);
    res.json({ output });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate content" });
  }
});


export default router;
