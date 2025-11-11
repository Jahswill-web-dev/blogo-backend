// import { Router } from "express";
// import crypto from "crypto";
// import { runGemini } from "../services/geminiClient";
// import { prompts } from "../services/prompts/prompts";
// import jwtAuth from "../middleware/jwtAuth";
// import { bulkGeneratePrompt } from "../services/prompts/bulkGenerate";
// import UserProfile from "../models/UserProfile";
// import ContentIdeas from "../models/ContentIdeas";
// import ContentPost from "../models/ContentPost";

// const router = Router();

// // POST /content/generate
// router.post("/generate-posts", jwtAuth, async (req, res) => {
//   try {
//     const user = req.user;
//     const { platform, voice } = req.body;
//     const capitalize = (value: string) => {
//       if (!value) return value;
//       return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
//     };

//     const formattedPlatform = capitalize(platform);
//     const formattedVoice = capitalize(voice);
//     console.log("Platform:", formattedPlatform, "Voice:", formattedVoice);
//     // if (!mode || !text) {
//     //   return res.status(400).json({ error: "mode and text are required" });
//     // }

//     // let prompt: string;
//     // if (mode === "platform_adaptation" && platform) {
//     //   prompt = prompts.platform_adaptation(text, platform);
//     // } else if(mode === "audience_simulation" && target) {
//     //     prompt = prompts.audience_simulation(text, target);
//     // }
//     // else {
//     //   prompt = (prompts as any)[mode](text);
//     // }
//     const userProfile = await UserProfile.findOne({ userId: (user as any)._id });
//     if (!userProfile) return res.status(404).json({ error: "User profile not found" });
//     const latestideas = await ContentIdeas.findOne({ userId: (user as any)._id }).sort({ createdAt: -1 }).limit(1);
//     const ideas = latestideas.ideas || [];

//     // console.log("Latest Ideas:", ideas.join(", "));
//     if (ideas.length === 0) {
//       return res.status(404).json({ error: "No content ideas found for user" });
//     }
//     const promptData = {
//       startup_name: userProfile.companyName,
//       industry: userProfile.industry,
//       description: userProfile.description,
//       // product_overview: userProfile.productOverview,
//       audience: userProfile.audience.join(", "),
//       platform: formattedPlatform,
//       voice: voice,
//       ideas: ideas
//     };

//     let prompt = bulkGeneratePrompt.developPosts(promptData);

//     const output = await runGemini(prompt);
//     // store output in database
//     if (!output) {
//       return res.status(500).json({ error: "AI generation failed" });
//     }

//     let posts: { content: string }[] = [];
//     try {
//       const parsed = JSON.parse(output);
//       console.log("Parsed Gemini Response:", parsed);
//       if (parsed.posts && Array.isArray(parsed.posts)) {
//         posts = parsed.posts;
//       } else {
//         throw new Error("Invalid posts format");
//       }
//     } catch (error) {
//       console.error("Failed to parse Gemini response:", error);
//       return res.status(500).json({
//         error: "Invalid AI response format. Expected JSON with 'posts' array.",
//       });
//     }


//     const batchId = crypto.randomUUID();

//     const postBatch = await ContentPost.create({
//       userId: (user as any)._id,
//       batchId,
//       platform: formattedPlatform,
//       posts: posts.map((p, index) => ({
//         postText: p.content,
//       })),
//       generatedCount: posts.length,
//     });


//     res.json({ posts });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to generate content" });
//   }
// });


// export default router;


import { Router, Request, Response } from "express";
import crypto from "crypto";
import ContentPost from "../models/ContentPost";
import jwtAuth from "../middleware/jwtAuth";
import { runGemini } from "../services/geminiClient";
import { bulkPrompts } from "../services/prompts/bulkPrompts";
import UserProfile from "../models/UserProfile";

const router = Router();

router.post("/bulk-generate", jwtAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any)._id;
    const { platform } = req.body;
    const batchId = crypto.randomUUID();

    // 1️⃣ Fetch user profile
    const userProfile = await UserProfile.findOne({ userId });
    if (!userProfile) {
      return res.status(404).json({ error: "User profile not found" });
    }

    // Build prompt data object
    const promptData = {
      startup_name: userProfile.companyName,
      industry: userProfile.industry,
      description: userProfile.description,
      audience: userProfile.audience?.join(", ") || "",
      platform,
      tone: userProfile.tone || "friendly",
      product_description: userProfile.description || "",
      pain_points: userProfile.painPoints?.join(", ") || "",
      benefits: userProfile.benefits?.join(", ") || "",
    };

    // 2️⃣ Storage for all categories
    const allResults: Record<string, any[]> = {};

    // 3️⃣ Loop through each category
    for (const [category, promptFn] of Object.entries(bulkPrompts)) {
      const generatedPosts: { content: string }[] = [];
       const promptsArray = promptFn(promptData);
      for (const promptText of promptsArray) {
        try {
          
          const output = await runGemini(promptText);
          if (!output) continue;

          // Parse AI output safely
          let posts: { content: string }[] = [];
          try {
            const parsed = JSON.parse(output);
            if (Array.isArray(parsed.posts)) {
              posts = parsed.posts;
            } else if (Array.isArray(parsed)) {
              posts = parsed.map((p) => ({ content: p }));
            } else if (typeof parsed === "string") {
              posts = [{ content: parsed }];
            }
          } catch {
            // fallback if output isn't JSON
            posts = [{ content: output }];
          }

          generatedPosts.push(...posts);
        } catch (err) {
          console.error(`❌ Error generating posts for category "${category}":`, err);
        }
      }

      // 4️⃣ Save generated posts to DB
      if (generatedPosts.length > 0) {
        await ContentPost.create({
          userId,
          batchId,
          platform,
          category,
          posts: generatedPosts,
          generatedCount: generatedPosts.length,
        });
      }

      allResults[category] = generatedPosts;
    }

    // 5️⃣ Return all results
    res.status(200).json({
      success: true,
      batchId,
      data: allResults,
    });
  } catch (err) {
    console.error("❌ Bulk generation error:", err);
    res.status(500).json({ error: "Failed to generate bulk content" });
  }
});

export default router;
